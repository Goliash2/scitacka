import { UserShifts } from './user-shift.model';

export class User {
    constructor(
        public id: number,
        public prefix: string,
        public name: string,
        public surname: string,
        public suffix: string,
        public email: string,
        public phone: string,
        public comment: string,
        public smeny: UserShifts[]
    ) {}
}
