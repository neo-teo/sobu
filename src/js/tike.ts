import type p5 from "p5";
import type { Liftable } from "./liftable";
import { MoveSkit } from "./moveskit";

export class Tike {
    private p: p5;  // Store the p5 instance

    constructor(p: p5, liftables: Liftable[]) {
        this.p = p;

        // this.liftables = liftables;
    }

    private carJitters = [-1, 2, 1, -1, -1, 1, 2, 0, -2];
    private jitterI = 0;

    // NOTE: this draws the car at 0, 0. It expects called to translate it to the correct position
    draw(ignited: boolean): void {
        if (!MoveSkit.carImg) return;

        this.p.noSmooth();

        this.p.imageMode(this.p.CENTER);

        if (ignited) {
            // car starting sound car sound engine running
            this.jitterI++;
            if (this.jitterI >= this.carJitters.length) this.jitterI = 0;
        }

        this.p.image(
            MoveSkit.carImg,
            MoveSkit.carImg.width * 1.1,
            this.carJitters[this.jitterI],
            MoveSkit.carImg.width * 1.2,
            MoveSkit.carImg.height * 1.2
        );

        this.p.pop();
    }
}