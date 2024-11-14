import type p5 from "p5";
import { Liftable } from "./liftable";

export class Rivington {
    private p: p5;

    constructor(p: p5) {
        this.p = p;
    }

    draw(liftables: Liftable[]): void {
        this.p.background('lightblue');
        this.drawLiftables(liftables);
    }

    private drawLiftables(liftables: Liftable[]): void {
        const sortedLiftables = [...liftables]
            .sort((a, b) => b.weight - a.weight)
            .reverse();

        let currentY = 100;
        const centerX = this.p.width / 2;

        this.p.push();
        this.p.imageMode(this.p.CENTER);

        for (const liftable of sortedLiftables) {
            const imgWidth = liftable.img.width * 2;
            const imgHeight = liftable.img.height * 2;

            // Check if mouse is hovering over the liftable
            const isHovered = this.p.mouseX > centerX - imgWidth / 2 &&
                this.p.mouseX < centerX + imgWidth / 2 &&
                this.p.mouseY > currentY - imgHeight / 2 &&
                this.p.mouseY < currentY + imgHeight / 2;

            const scale = isHovered ? 2.2 : 2;

            this.p.image(
                liftable.img,
                centerX,
                currentY,
                liftable.img.width * scale,
                liftable.img.height * scale
            );

            if (isHovered) {
                this.p.textAlign(this.p.CENTER, this.p.CENTER);
                this.p.text(liftable.name, centerX, this.p.height - 100);
                this.p.text(liftable.description, centerX, this.p.height - 50);
            }

            currentY += liftable.img.height * 2 + 50;
        }

        this.p.pop();
    }
}