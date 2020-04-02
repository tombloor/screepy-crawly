
export class Upgrader {
    static role_name = 'upgrader';
    static body = [MOVE, CARRY, CARRY, WORK];

    creep: Creep;
    memory: UpgraderMemory;

    constructor(creep: Creep) {
        this.creep = creep;
        this.memory = <UpgraderMemory>creep.memory;
    }

    public static get_active(): Creep[] {
        let creeps = _.filter(Game.creeps, (c) => {
            return c.memory['role'] == Upgrader.role_name;
        });
        return creeps;
    }

    public static spawn(spawn: StructureSpawn) {
        let name = this.role_name + '_' + Game.time;
        let memory = new UpgraderMemory();
        memory['spawn'] = spawn.id;
        memory['controller'] = spawn.room.controller!.id;

        console.log('Attempting to spawn: ' + name);
        let result = spawn.spawnCreep(this.body, name, {
            'memory': memory
        });

        if (result == OK) {
            console.log('Spawning successful');
        } else {
            console.log('Unable to spawn: ' + result.toString())
        }
    }

    public run() {
        let memory = <UpgraderMemory>this.memory;
        let spawn: StructureSpawn;
        let controller: StructureController;

        if (!memory.spawn) {
            console.log('Upgrader has no spawn!');
            return;
        } else {
            spawn = Game.getObjectById(memory.spawn!)!;
        }

        if (!memory.controller) {
            console.log('Upgrader has no controller!');
            return;
        } else {
            controller = Game.getObjectById(memory.controller!)!;
        }

        if (memory.working) {
            let upgrade_result = this.creep.upgradeController(controller);
            if (upgrade_result == ERR_NOT_IN_RANGE) {
                this.creep.say('To ctrler!');
                this.creep.moveTo(controller!);
            }

            if (this.creep.store.energy == 0) {
                this.creep.memory.working = false;
            }
        } else {
            if (spawn.store.energy == spawn.energyCapacity) {
                let withdraw_result = this.creep.withdraw(
                    spawn,
                    RESOURCE_ENERGY
                );
                if (withdraw_result == ERR_NOT_IN_RANGE) {
                    this.creep.say('To spawn!');
                    this.creep.moveTo(spawn);
                } else if (withdraw_result == OK) {
                    this.creep.memory.working = true;
                }
            } else {
                this.creep.say('W8 4 spwn');
                this.creep.moveTo(spawn);
            }
        }
    }
}

export class UpgraderMemory implements CreepMemory {
    role = Upgrader.role_name;
    working = false;
    spawn?: Id<StructureSpawn>;
    controller?: Id<StructureController>;
}
