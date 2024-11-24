import { Dietician } from "./dietician";
import { Hospital } from "./hospital";

export class Ward {
    constructor(
        public id: number,
        public name: string,
        public phoneNumber: string,
        public hospital: Hospital,
        public dieticians: Dietician[]
    ){}
}
