import { ErrorMapper } from "utils/ErrorMapper";
import { Miner } from "roles/miner";
import { Hauler } from "roles/hauler";

console.log('New global loaded');

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}

	let spawn = Game.spawns['Spawn1'];
	let room = spawn.room;

	let miners = Miner.get_active();

	let haulers = Hauler.get_active();

	const upgrader_role = 'upgrader';
	let upgrader_body = [MOVE, CARRY, CARRY, WORK];
	let upgraders = _.filter(Game.creeps, (c) => {
		return c.memory['role'] == upgrader_role;
	})

	console.log('Active miners: ' + miners.length.toString())
	console.log('Active haulers: ' + haulers.length.toString())
	console.log('Active upgraders: ' + upgraders.length.toString())

	if (spawn.spawning == null) {
		if (miners.length < 1) {
			Miner.spawn(spawn);
		}
		else if (haulers.length < 2) {
			Hauler.spawn(spawn);
		}
		else if (upgraders.length < 2) {
			console.log('no upgraders, spawning one.');
			let result = spawn.spawnCreep(upgrader_body, 'Upgrader1', {
				memory: { role: upgrader_role, working: false }
			});

			if (result == OK) {
				console.log('Spawning successful');
			} else if (result == ERR_NAME_EXISTS) {
				spawn.spawnCreep(upgrader_body, 'Upgrader2', {
					memory: { role: upgrader_role, working: false }
				});
			}
			else {
				console.log('Unable to spawn: ' + result.toString())
			}
		}
	} else {
		console.log('Spawning: ' + spawn.spawning!.name);
	}

	let source = spawn.pos.findClosestByPath(FIND_SOURCES)!;

	_.forEach(Game.creeps, (creep) => {
		let role = creep.memory['role'];

		if (role == Miner.role_name) {
			let miner = new Miner(creep);
			miner.run();
		} else if (role == Hauler.role_name) {
			let hauler = new Hauler(creep);
			hauler.run();
		} else if (role == upgrader_role) {
			console.log(creep.name + '  upgrading');
			if (creep.memory.working) {
				let upgrade_result = creep.upgradeController(room.controller!);
				if (upgrade_result == ERR_NOT_IN_RANGE) {
					creep.moveTo(room.controller!);
				}

				if (creep.store.energy == 0) {
					creep.memory.working = false;
				}
			} else {
				if (spawn.store.energy == spawn.energyCapacity) {
					console.log('Spawn is full, withdrawing');
					let withdraw_result = creep.withdraw(spawn, RESOURCE_ENERGY);
					if (withdraw_result == ERR_NOT_IN_RANGE) {
						creep.moveTo(spawn);
					} else if (withdraw_result == OK) {
						creep.memory.working = true;
					}
				} else {
					creep.moveTo(spawn);
				}
			}
		}
	});
});
