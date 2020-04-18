import { Process } from "./process";
import { Kernel } from "os/kernel";
import { MinerLTInfo } from "./miner_lt";

export class Init extends Process {
    constructor(kernel: Kernel) {
        let info = new InitInfo();
        super(kernel, info);
    }

    run() {
        console.log('running init');
        for (const room_name in Game.rooms) {
            console.log(room_name);
            let r = Game.rooms[room_name];
            let controller = r.controller;
            let spawns = r.find(FIND_MY_SPAWNS);
            let sources = r.find(FIND_SOURCES);

            _.forEach(sources, (source) => {
                let miner_lt_info = new MinerLTInfo(source.id);
                this.fork(miner_lt_info);
            });
        }
    }
}

export class InitInfo implements ProcessInfo {
    type: string = 'init';
    pid: string;
    priority: number;

    constructor() {
        this.pid = 'init';
        this.priority = 100;
    }
}
