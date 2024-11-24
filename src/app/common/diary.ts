import { Diet } from "./diet";
import { Meal } from "./meal";

export class Diary {
    constructor(
        public id: number,
        public date: string,
        public diet: Diet,
        public breakfast: Meal,
        public lunch: Meal,
        public supper: Meal
    ){}
}
