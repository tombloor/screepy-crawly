import { Process } from "./process";
import { Kernel } from "os/kernel";
import { SpawnerInfo } from "./spawner";

export class MinerLT extends Process {
    info!: MinerLTInfo;

    constructor(kernel: Kernel, info: MinerLTInfo) {
        super(kernel, info);
    }

    run() {
        console.log('running miner lt');
        let creep = Game.creeps[this.info.creep];
        if (!creep) {
            let source = Game.getObjectById(this.info.source);
            if (source) {
                let room_spawn = source.room.find(FIND_MY_SPAWNS)[0];
                if (room_spawn) {
                    let body = [MOVE, WORK];
                    let spInfo = new SpawnerInfo(room_spawn.id, this.info.creep, body);
                    this.fork(spInfo);
                }
            }
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
    creep: string;

    constructor(source: Id<Source>, creep?: Id<Creep>) {
        this.pid = this.type + '_' + source;
        this.priority = 90;
        this.source = source;

        this.creep = 'miner_' + source;
    }
}
