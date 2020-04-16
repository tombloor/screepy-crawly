import { Kernel } from "os/kernel";

/**
* Base class for all processes.
* Type should be overridden for each new process
*/
export class Process {
    kernel: Kernel;
    info: ProcessInfo;
    type: string = 'base';

    constructor(kernel: Kernel, info: ProcessInfo) {
        this.kernel = kernel;
        this.info = info;
    }

    /**
     * Fork a new process from this one
     */
    fork() {

    }

    /**
     * Run the process for a tick.
     * This should be overridden.
     */
    run() {
        console.log('This should be overriden');
    }
}
