export class UserShifts {
    constructor(
        public id: number,
        public idSmena: number,
        public idScitac: number,
        public date: string,
        public comment: string,
        public idPruzkum: number,
        public name: string,
        public type: string,
        public origin: string,
        public from: string
    ) {}
}
