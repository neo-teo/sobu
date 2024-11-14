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
        this.setLiftablePositions(liftables);
        liftables.forEach(liftable => liftable.setJumpingEnabled(true));
        liftables.forEach(liftable => liftable.update());
        this.drawLiftables(liftables);
        this.drawPlayAgainButton();
    }

    private hoverStates: Map<Liftable, boolean> = new Map();

    // TODO: i think ideally this should only be called once...
    setLiftablePositions(liftables: Liftable[]): void {
        const sortedLiftables = [...liftables]
            .sort((a, b) => b.weight - a.weight);

        const centerX = this.p.width / 2;
        const itemsPerRow = 2;
        const padding = 50;

        let y = this.p.height - 200;

        for (let i = 0; i < sortedLiftables.length; i++) {
            const liftable = sortedLiftables[i];

            const imgWidth = liftable.img.width;
            const imgHeight = liftable.img.height;

            const col = i % itemsPerRow;

            const x = centerX + (col === 0 ? -imgWidth / 2 - padding * 1.5 : imgWidth / 2 + padding * 1.5);

            // when is i:2, i:4, i:6, i:8, increment y
            if (i > 0 && col === 0) {
                let prevRowHeight = Math.max(sortedLiftables[i - 1].img.height, sortedLiftables[i - 2].img.height) / 2;
                let thisRowHeight = liftable.img.height
                if (sortedLiftables[i + 1]) {
                    thisRowHeight = Math.max(liftable.img.height, sortedLiftables[i + 1]?.img.height ?? 0) / 2;
                }
                y -= prevRowHeight / 10 + thisRowHeight / 10 + 120;
            }

            liftable.set_x_unsafe(col === 0 ? x + imgWidth / 2 : x - imgWidth / 2);
            liftable.set_y_unsafe(y);

            this.hoverStates.set(liftable,
                this.p.mouseX > x - imgWidth &&
                this.p.mouseX < x + imgWidth &&
                this.p.mouseY > y - imgHeight / 2 &&
                this.p.mouseY < y + imgHeight / 2
            );
        }
    }

    private drawLiftables(liftables: Liftable[]): void {
        const sortedLiftables = [...liftables]
            .sort((a, b) => b.weight - a.weight)

        const centerX = this.p.width / 2;

        this.p.push();
        this.p.imageMode(this.p.CENTER);

        for (const liftable of sortedLiftables) {

            const isHovered = this.hoverStates.get(liftable);

            const scale = isHovered ? 1.2 : 1;

            liftable.draw(scale);

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

        const isHovered = this.p.mouseX > x &&
            this.p.mouseX < x + buttonWidth &&
            this.p.mouseY > y &&
            this.p.mouseY < y + buttonHeight;

        this.p.push();
        this.p.fill(isHovered ? 'black' : 'white');
        this.p.stroke('black');
        this.p.strokeWeight(2);
        this.p.rect(x, y, buttonWidth, buttonHeight);

        this.p.noStroke();
        this.p.fill(isHovered ? 'white' : 'black');
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(16);
        this.p.text('Play Again?', x + buttonWidth / 2, y + buttonHeight / 2);
        this.p.pop();

        this.p.image(Sprite.images.sleeping, 50, y - 20);

        if (isHovered && this.p.mouseIsPressed) {
            window.location.reload();
        }
    }
}