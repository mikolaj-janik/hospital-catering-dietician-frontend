import { Hospital } from "./hospital";

export class Dietician {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public surname: string,
        public hospital: Hospital,
        public picture: string
    ){}
}
