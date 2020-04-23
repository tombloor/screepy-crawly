import { Kernel } from "os/kernel";

/**
* Base class for all processes.
* Type should be overridden for each new process
*/
export class Process {
    kernel: Kernel;
    info: ProcessInfo;

    constructor(kernel: Kernel, info: ProcessInfo) {
        this.kernel = kernel;
        this.info = info;
    }

    /**
     * Fork a new process from this one
     */
    fork(info: ProcessInfo) {
        let proc = this.kernel.processes![info.pid];
        if (proc) {
            this.kernel.log('process already exists ' + info.pid);
        } else {
            this.kernel.processes![info.pid] = info;
        }
    }

    /**
     * Run the process for a tick.
     * This should be overridden.
     */
    run() {
        console.log('This should be overriden');
    }

    /**
     * This process has done what it needed to to.
     * Remove it from the kernel.
     */
    done() {
        if (this.kernel.processes)
            delete this.kernel.processes[this.info.pid];
    }
}
