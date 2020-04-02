import { ErrorMapper } from "utils/ErrorMapper";
import { Miner } from "roles/miner";
import { Hauler } from "roles/hauler";
import { Upgrader } from "roles/upgrader";

console.log('New global loaded');

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}

	let spawn = Game.spawns['Spawn1'];

	let miners = Miner.get_active();
	let haulers = Hauler.get_active();
	let upgraders = Upgrader.get_active();

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
			Upgrader.spawn(spawn);
		}
	} else {
		console.log('Spawning: ' + spawn.spawning!.name);
	}

	_.forEach(Game.creeps, (creep) => {
		let role = creep.memory['role'];

		if (role == Miner.role_name) {
			let miner = new Miner(creep);
			miner.run();
		} else if (role == Hauler.role_name) {
			let hauler = new Hauler(creep);
			hauler.run();
		} else if (role == Upgrader.role_name) {
			let upgrader = new Upgrader(creep);
			upgrader.run();
		}
	});
});
