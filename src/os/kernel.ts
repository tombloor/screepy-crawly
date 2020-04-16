import { InitInfo } from "./processes/init";

/**
* Contains all Kernel level logic for managing processes, saving and loading state.
*/
export class Kernel {
    version: string = '0.0.1';
    processes?: { [key: string]: ProcessInfo }

    public load_state() {
        let state = Memory['kernel'];
        if (!state) {
            this.boot();
        } else if (!state.processes) {
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
}
