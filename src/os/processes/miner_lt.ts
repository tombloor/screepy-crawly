import { Process } from "./process";
import { Kernel } from "os/kernel";
import { SpawnerInfo } from "./spawner";
import { MoveInfo, Move } from "./move";

/**
 * Lifetime process for a single miner
 * Spawn, move, harvest
 */
export class MinerLT extends Process {
    info!: MinerLTInfo;

    constructor(kernel: Kernel, info: MinerLTInfo) {
        super(kernel, info);
    }

    run() {
        console.log('running miner lt');
        let creep = Game.creeps[this.info.creep];
        let source = Game.getObjectById(this.info.source)!;
        if (!creep) {
            if (source) {
                let room_spawn = source.room.find(FIND_MY_SPAWNS)[0];
                if (room_spawn) {
                    let body = [MOVE, WORK];
                    let spInfo = new SpawnerInfo(room_spawn.id, this.info.creep, body);
                    this.fork(spInfo);
                }
            }
        } else {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                let mvInfo = new MoveInfo(creep.name, {
                    'room': source.room.name,
                    'x': source.pos.x,
                    'y': source.pos.y

                });
                this.fork(mvInfo);
            }
        }
    }
}

export class MinerLTInfo implements ProcessInfo {
    type: string = 'miner_lt';
    pid: string;
    priority: number;

    source: Id<Source>;
    creep: string;

    /**
     *
     * @param source ID of the source to be mined
     * @param creep ID of the miner, or null if not spawned
     */
    constructor(source: Id<Source>, creep?: Id<Creep>) {
        this.pid = this.type + '_' + source;
        this.priority = 90;
        this.source = source;

        this.creep = 'miner_' + source;
    }
}
