import { Connection} from './connection.model';
import { Worker } from './worker.model';

export class Shift {
    constructor(
        public id: number,
        public idPruzkum: number,
        public name: string,
        public type: string,
        public comment: string,
        public spoje: Connection[],
        public scitaci: Worker[]
    ) {}
}
