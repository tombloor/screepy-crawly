import { Process } from "./process";
import { Kernel } from "os/kernel";
import { strict } from "assert";

export class Move extends Process {
    info!: MoveInfo;

    constructor(kernel: Kernel, info: MoveInfo) {
        super(kernel, info);
    }

    run() {
        this.kernel.log('running move');
        let creep = Game.creeps[this.info.creep];
        if (creep) {
            let x = this.info.target.x;
            let y = this.info.target.y;
            let room = Game.rooms[this.info.target.room];
            let moveTarget = room.getPositionAt(x, y)!;
            if (creep.pos == moveTarget) {
                this.kernel.log('arrived');
                return this.done();
            } else {
                this.kernel.log('moving');
                let result = creep.moveTo(moveTarget, {
                    'visualizePathStyle': {
                        fill: 'transparent',
                        stroke: '#fff',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: .1
                    }
                });
                this.kernel.log(result.toString());
            }

            let lastPos = this.info.lastPos;
            let currentPos = creep.pos;
            if (lastPos.roomName == currentPos.roomName, lastPos.x == currentPos.x, lastPos.y == currentPos.y) {
                this.info.stuckCount += 1;
                this.kernel.log('New stuck count: ' + this.info.stuckCount);
            } else {
                this.info.stuckCount = 0;
                this.info.lastPos = creep.pos;
            }

            if (this.info.stuckCount > 3) {
                this.kernel.log('creep seems to be stuck');
                return this.done();
            }
        } else {
            this.kernel.log('Creep no longer exists');
            return this.done();
        }
    }
}

export class MoveInfo implements ProcessInfo {
    type: string = 'move';
    pid: string;
    priority: number;

    target: { room: string, x: number, y: number };
    creep: string;
    lastPos: RoomPosition
    stuckCount: number

    constructor(creep: string, target: { room: string, x: number, y: number }) {
        this.pid = this.type + '_' + creep;
        this.priority = 90;
        this.target = target;
        this.creep = creep;
        this.lastPos = Game.creeps[this.creep].pos;
        this.stuckCount = 0;
    }
}
