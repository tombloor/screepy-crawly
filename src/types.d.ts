// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  //room: string;
  working: boolean;
}

interface Memory {
  //uuid: number;
  //log: any;
  kernel: KernelMemory;
}

interface KernelMemory {
  version: string;
  processes: { [key: string]: ProcessInfo };
}

interface ProcessInfo {
  type: string;
  pid: string;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
