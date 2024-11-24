import { Diet } from "./diet";
import { Ward } from "./ward";

export class Patient {
    constructor(
        public id: number,
        public diet: Diet,
        public ward: Ward,
        public email: string,
        public login: string,
        public name: string,
        public surname: string,
        public admissionDate: string
    ){}
}
