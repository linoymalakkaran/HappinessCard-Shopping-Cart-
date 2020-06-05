export default class Offer {
    id: number;
    title: string;
    details: string;
    img: string;
    location: string;
    category: string;
    valid_from: string;
    valid_till: string;
    likes: number;
    percent_off:number;
    flip: boolean = false;
    selected: boolean = false;
}