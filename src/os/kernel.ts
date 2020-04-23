import { InitInfo, Init } from "./processes/init";
import { Process } from "./processes/process";
import { MinerLT } from "./processes/miner_lt";
import { Spawner } from "./processes/spawner";

/**
* Contains all Kernel level logic for managing processes, saving and loading state.
*/
export class Kernel {
    version: string = '0.0.1';
    debug: boolean = true;
    processes?: { [key: string]: ProcessInfo }

    public log(message: string) {
        if (this.debug) {
            console.log(message);
        }
    }

    public load_state() {
        let state = Memory['kernel'];
        if (!state) {
            this.boot();
        } else if (!state.processes) {
            this.boot();
        } else if (!state.processes['init']) {
            this.boot();
        }
        this.processes = Memory['kernel'].processes;
    }

    public boot() {
        console.log('Booting kernel: ' + this.version);
        Memory['kernel'] = {
            'version': this.version,
            'processes': {
                'init': new InitInfo()
            }
        }
    }

    public save_state() {
        let state = {
            'version': this.version,
            'processes': this.processes!
        }

        Memory['kernel'] = state;
    }

    public create_order(): ProcessInfo[] {
        if (this.processes) {
            return _.sortBy(this.processes, (info) => {
                return 100 - info.priority;
            });
        }

        return []
    }

    public run_process(info: ProcessInfo) {
        console.log('running proc ' + info.pid);
        let proc: Process = new proc_types[info.type](this, info);
        proc.run();
    }
}

const proc_types: { [key: string]: typeof Process } = {
    'init': Init,
    'miner_lt': MinerLT,
    'spawn': Spawner
}
