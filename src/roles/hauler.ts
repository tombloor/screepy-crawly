
export class Hauler {
    static role_name = 'hauler';
    static body = [MOVE, CARRY];

    creep: Creep;
    memory: HaulerMemory;

    constructor(creep: Creep) {
        this.creep = creep;
        this.memory = <HaulerMemory>creep.memory;
    }

    public static get_active(): Creep[] {
        let creeps = _.filter(Game.creeps, (c) => {
            return c.memory['role'] == Hauler.role_name;
        });
        return creeps;
    }

    public static spawn(spawn: StructureSpawn) {
        let name = this.role_name + '_' + Game.time;
        let memory = new HaulerMemory();
        memory['spawn'] = spawn.id;

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
        let memory = <HaulerMemory>this.memory;
        let spawn: StructureSpawn;

        if (!memory.spawn) {
            console.log('Hauler has no spawn!');
            return;
        } else {
            spawn = Game.getObjectById(memory.spawn!)!;
        }

        if (memory.working) {
            let transfer_result = this.creep.transfer(spawn, RESOURCE_ENERGY);
            if (transfer_result == ERR_NOT_IN_RANGE) {
                this.creep.say('Dropoff');
                this.creep.moveTo(spawn);
            } else {
                this.creep.memory.working = false;
            }
        } else {
            let target = this.creep.pos.findClosestByPath(
                FIND_DROPPED_RESOURCES
            );
            if (target) {
                if (this.creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    this.creep.say('Pickup');
                    this.creep.moveTo(target);
                }
            }
        }

        let free_cap = this.creep.store.getFreeCapacity(RESOURCE_ENERGY);
        if (free_cap == 0) {
            this.creep.memory.working = true;
        }
    }
}

export class HaulerMemory implements CreepMemory {
    role = Hauler.role_name;
    working = false;
    spawn?: Id<StructureSpawn>;
}
