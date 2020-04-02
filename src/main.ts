import { ErrorMapper } from "utils/ErrorMapper";
import { spawn } from "child_process";

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

	const miner_role = 'miner';
	let miner_body = [MOVE, WORK];
	let miners = _.filter(Game.creeps, (c) => {
		return c.memory['role'] == miner_role;
	});

	const hauler_role = 'hauler';
	let hauler_body = [MOVE, CARRY];
	let haulers = _.filter(Game.creeps, (c) => {
		return c.memory['role'] == hauler_role;
	});

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
			console.log('No miners, spawning one.');
			let result = spawn.spawnCreep(miner_body, 'Miner1', {
				memory: { role: miner_role, working: false }
			});

			if (result == OK) {
				console.log('Spawning successful');
			} else {
				console.log('Unable to spawn: ' + result.toString())
			}
		}
		else if (haulers.length < 1) {
			console.log('no haulers, spawning one.');
			let result = spawn.spawnCreep(hauler_body, 'Hauler1', {
				memory: { role: hauler_role, working: false }
			});

			if (result == OK) {
				console.log('Spawning successful');
			} else {
				console.log('Unable to spawn: ' + result.toString())
			}
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
		let working = creep.memory['working'];

		console.log(creep.name + ' (' + role + ')');

		if (role == miner_role) {
			console.log(creep.name + ' mining');
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source);
			} else {
				creep.memory.working = true;
			}
		} else if (role == hauler_role) {
			console.log(creep.name + '  hauling');
			if (creep.memory.working) {
				let transfer_result = creep.transfer(spawn, RESOURCE_ENERGY);
				console.log('Haul transfer result:' + transfer_result);
				if (transfer_result == ERR_NOT_IN_RANGE) {
					creep.moveTo(spawn);
				} else {
					creep.memory.working = false;
				}
			} else {
				let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
				if (target) {
					if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				} else {
					console.log('No resources to collect');
				}
			}

			let free_cap = creep.store.getFreeCapacity(RESOURCE_ENERGY);
			if (free_cap == 0) {
				creep.memory.working = true;
			}
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
