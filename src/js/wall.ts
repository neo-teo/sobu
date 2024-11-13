import p5 from "p5";
import { Obstacle } from "./obstacle";

export class Wall extends Obstacle {
    public static images: p5.Image[] = [];

    img: p5.Image;

    constructor(p: p5, x: number, y: number, width: number, height: number) {
        super(p, x, y, width, height);

        if (width > height) {
            this.img = Wall.images[0];
        } else {
            this.img = Wall.images[1];
        }
    }

    draw(): void {
        this.p.image(this.img, this.x, this.y, this.width, this.height);
    }

    static loadImages(p: p5): void {
        this.images = [
            p.loadImage('/sobu/walls/horizontal.png'),
            p.loadImage('/sobu/walls/vertical.png'),
        ];
    }
}