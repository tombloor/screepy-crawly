import { Process } from "./process";
import { Kernel } from "os/kernel";

/**
 * Process to handle spawning a single creep
 */
export class Spawner extends Process {
    info!: SpawnerInfo;

    constructor(kernel: Kernel, info: SpawnerInfo) {
        super(kernel, info);
    }

    run() {
        this.kernel.log('running spawner');
        let spawn = Game.getObjectById(this.info.spawn_id)!;
        let creep = Game.creeps[this.info.creep_name];
        if (creep) {
            if (creep.spawning) {
                return;
                // return wait 1
            } else {
                this.done();
                return;
                // return done
            }
        } else {
            let result = spawn.spawnCreep(this.info.body, this.info.creep_name);
        }
    }
}

export class SpawnerInfo implements ProcessInfo {
    type: string = 'spawn';
    pid: string;
    priority: number;

    spawn_id: Id<StructureSpawn>;
    creep_name: string;
    body: BodyPartConstant[];

    /**
     *
     * @param spawn_id ID of the spawn to use
     * @param creep_name Name to assign to the creep
     * @param body Body part array for the creep
     */
    constructor(spawn_id: Id<StructureSpawn>, creep_name: string, body: BodyPartConstant[]) {
        this.pid = this.type + '_' + creep_name;
        this.priority = 90;
        this.spawn_id = spawn_id;
        this.creep_name = creep_name;
        this.body = body;
    }
}
