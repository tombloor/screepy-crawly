
export class Miner {
    static role_name = 'miner';
    static body = [WORK, MOVE];

    creep: Creep;
    memory: MinerMemory;

    constructor(creep: Creep) {
        this.creep = creep;
        this.memory = <MinerMemory>creep.memory;
    }

    public static get_active(): Creep[] {
        let creeps = _.filter(Game.creeps, (c) => {
            return c.memory['role'] == Miner.role_name;
        });
        return creeps;
    }

    public static spawn(spawn: StructureSpawn) {
        let name = this.role_name + '_' + Game.time;
        let memory = new MinerMemory();

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
        let memory = <MinerMemory>this.memory;
        if (memory.source == undefined) {
            this.creep.say('Find src');
            let closest = this.creep.pos.findClosestByPath(FIND_SOURCES);
            if (closest) {
                memory.source = closest.id;
            } else {
                console.log('Miner cant find a source!');
            }
        }

        let source = <Source>Game.getObjectById(<Id<Source>>memory.source);

        if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.say('Moving');
            this.creep.moveTo(source);
        } else {
            this.creep.say('Mining ⛏');
            this.memory.working = true;
        }
    }
}

export class MinerMemory implements CreepMemory {
    role = Miner.role_name;
    working = false;
    source?: Id<Source>;
}
