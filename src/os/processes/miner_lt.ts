import { Process } from "./process";
import { Kernel } from "os/kernel";

export class MinerLT extends Process {
    info!: MinerLTInfo;

    constructor(kernel: Kernel, info: MinerLTInfo) {
        super(kernel, info);
    }

    run() {
        console.log('running miner lt');
        let creep = Game.creeps[this.info.creep ?? ''];
        if (!creep) {
            // Need to spawn a creep
            // this.fork(spawninfo)
        } else {
            // Create harvest process if it doesn't exist
        }
    }
}

export class MinerLTInfo implements ProcessInfo {
    type: string = 'miner_lt';
    pid: string;
    priority: number;

    source: Id<Source>;
    creep?: Id<Creep>;

    constructor(source: Id<Source>, creep?: Id<Creep>) {
        this.pid = this.type + '_' + source;
        this.priority = 90;
        this.source = source;
        this.creep = creep;
    }
}
