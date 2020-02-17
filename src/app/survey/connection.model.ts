export class Connection {
    constructor(
        public id: number,
        public idSmena: number,
        public order: number,
        public type: string,
        public line: string,
        public connectionId: number,
        public origin: string,
        public destination: string,
        public from: string,
        public till: string,
        public comment: string
    ) {}
}
