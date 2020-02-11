export class Stop {
    constructor(
        public id: number,
        public name: string,
        public nameShort: string,
        public latitude: number,
        public longitude: number,
        public zone: string,
        public arrive: string,
        public departure: string,
        public stopOnRequest: string,
        public publicStop: string,
        public stopTypeId: number,
        public comment: string,
        public publicArrive: string,
        public publicDeparture: string,
        public substituteTransport: string,
        public stopId: number
    ) {}
}
