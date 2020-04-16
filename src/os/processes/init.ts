import { Process } from "./process";
import { Kernel } from "os/kernel";

export class Init extends Process {
    constructor(kernel: Kernel) {
        let info = new InitInfo();
        super(kernel, info);
    }

    run() {

    }
}

export class InitInfo implements ProcessInfo {
    type: string = 'init';
    pid: string;

    constructor() {
        this.pid = 'init';
    }
}
