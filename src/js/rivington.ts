import type p5 from "p5";
import { Liftable } from "./liftable";
import { Wall } from "./wall";
import Sprite from "./sprite";
import { MoveSkit } from "./moveskit";

export class Rivington {
    private p: p5;

    walls: Wall[];
    tikeImg: p5.Image;

    constructor(p: p5) {
        this.p = p;

        this.walls = this.createWalls();
        this.tikeImg = MoveSkit.carImg || this.p.createImage(0, 0);
    }

    private createWalls(): Wall[] {
        return [
            // vertical walls
            new Wall(this.p, 0, 0, 20, this.p.windowHeight / 2 - 100),
            new Wall(this.p, 0, this.p.windowHeight / 2 + 100, 20, this.p.windowHeight / 2),
            new Wall(this.p, this.p.windowWidth - 20, 0, 20, this.p.windowHeight),
            // horizontal walls
            new Wall(this.p, 0, 0, this.p.windowWidth, 20),
            new Wall(this.p, 0, this.p.windowHeight - 20, this.p.windowWidth, 20),
        ];
    }

    draw(liftables: Liftable[]): void {
        this.p.background('#FFF5E9');
        this.walls.forEach((w) => w.draw());
        this.p.image(this.tikeImg, -30, this.p.windowHeight / 2 - this.tikeImg.height / 2, this.tikeImg.width * 1.2, this.tikeImg.height * 1.2);

        this.drawLiftables(liftables);
        this.drawPlayAgainButton();
    }

    private drawLiftables(liftables: Liftable[]): void {
        const sortedLiftables = [...liftables]
            .sort((a, b) => b.weight - a.weight)
            .reverse();

        const centerX = this.p.width / 2;
        const itemsPerRow = 2;
        const padding = 50; // Space between items

        this.p.push();
        this.p.imageMode(this.p.CENTER);

        for (let i = 0; i < sortedLiftables.length; i++) {
            const liftable = sortedLiftables[i];
            const imgWidth = liftable.img.width;
            const imgHeight = liftable.img.height;

            // Calculate grid position
            const col = i % itemsPerRow;
            const row = Math.floor(i / itemsPerRow);

            // Calculate x position (centered around middle of screen)
            const x = centerX + (col === 0 ? -imgWidth / 2 - padding / 2 : imgWidth / 2 + padding / 2);
            const y = 100 + row * (imgHeight + padding);

            // Check if mouse is hovering over the liftable
            const isHovered = this.p.mouseX > x - imgWidth / 2 &&
                this.p.mouseX < x + imgWidth / 2 &&
                this.p.mouseY > y - imgHeight / 2 &&
                this.p.mouseY < y + imgHeight / 2;

            const scale = isHovered ? 1.2 : 1;

            this.p.image(
                liftable.img,
                x,
                y,
                liftable.img.width * scale,
                liftable.img.height * scale
            );

            if (isHovered) {
                this.p.textAlign(this.p.CENTER, this.p.CENTER);
                this.p.textSize(15);
                this.p.text(liftable.name, centerX, 100);
                this.p.textSize(12);
                this.p.text(liftable.description, centerX, 150);
            }
        }

        this.p.pop();
    }

    private drawPlayAgainButton(): void {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const x = this.p.width - buttonWidth - 50;
        const y = this.p.height - buttonHeight - 50;

        // Check if mouse is hovering over button
        const isHovered = this.p.mouseX > x &&
            this.p.mouseX < x + buttonWidth &&
            this.p.mouseY > y &&
            this.p.mouseY < y + buttonHeight;

        // Draw button
        this.p.push();
        this.p.fill(isHovered ? 'black' : 'white');
        this.p.stroke('black');
        this.p.strokeWeight(2);
        this.p.rect(x, y, buttonWidth, buttonHeight);

        // Draw text
        this.p.noStroke();
        this.p.fill(isHovered ? 'white' : 'black');
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(16);
        this.p.text('Play Again?', x + buttonWidth / 2, y + buttonHeight / 2);
        this.p.pop();

        this.p.image(Sprite.images.sleeping, 50, y - 20);

        // Handle click
        if (isHovered && this.p.mouseIsPressed) {
            window.location.reload();
        }
    }
}