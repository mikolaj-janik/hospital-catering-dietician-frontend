import { Diet } from "./diet";

export class Meal {
    constructor(
        public id: number,
        public diet: Diet,
        public name: string,
        public description: string,
        public price: number,
        public type: string,
        public calories: number,
        public protein: number,
        public carbohydrates: number,
        public fats: number,
        public image: string
    ){}
}
