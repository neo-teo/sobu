import p5 from "p5";
import { Wall } from "./wall";
import { Box } from "./box";
import { Plant } from "./plant";
import { CargoBay } from "./cargobay";
import { Chest } from "./chest";
import Sprite from "./sprite";

export class Evergreen {
    walls: Wall[];
    boxes: Box[];
    plants: Plant[];
    chest: Chest;
    cargobay: CargoBay;
    sprite: Sprite;
    p: p5;

    constructor(p: p5, sprite: Sprite) {
        this.p = p;
        this.sprite = sprite;

        this.walls = [
            new Wall(p, 0, 0, 20, p.windowHeight),
            new Wall(p, p.windowWidth - 20, 0, 20, p.windowHeight / 2 - 100),
            new Wall(p, p.windowWidth + 20, p.windowHeight / 2 - 100, 20, 200),
            new Wall(p, p.windowWidth - 20, p.windowHeight / 2 + 100, 20, p.windowHeight / 2),
            new Wall(p, 0, 0, p.windowWidth, 20),
            new Wall(p, 0, p.windowHeight - 20, p.windowWidth, 20),
        ];

        this.boxes = [];
        this.boxes.push(new Box(p, p.width / 2 + 40, p.height / 2 - 170, 'md'));
        this.boxes.push(new Box(p, p.width / 2 + 100, p.height / 2 - 215, 'md'));
        this.boxes.push(new Box(p, p.width / 2 + 40, p.height / 2 - 215, 'md'));
        this.boxes.push(new Box(p, p.width / 2 + 100, p.height / 2 - 170, 'md'));
        this.boxes.push(new Box(p, p.width / 2 + 70, p.height / 2 - 275, 'lg'));

        this.boxes.push(new Box(p, p.width / 2 + 50, p.height / 2 + 175, 'sm'));

        this.chest = new Chest(p, p.width / 2 - 200, p.height / 2 - 210);

        this.plants = [];
        this.plants.push(new Plant(p, p.width / 2 - 40, p.height / 2 - 200, 'snake'));
        this.plants.push(new Plant(p, p.width / 2 - 300, p.height / 2 - 280, 'bird'));

        this.cargobay = new CargoBay(p, [
            ...this.boxes,
            ...this.plants,
            this.chest
        ]);
    }

    drawCargobay(): void {
        this.cargobay.draw();
    }

    draw(): void {
        this.walls.forEach((w) => w.draw());

        const liftables = [...this.boxes, ...this.plants, this.chest];

        liftables.forEach(obj => {
            if (!obj.isLifted && !obj.vx && !obj.vy) obj.draw();
        });

        this.sprite.draw();

        liftables.forEach(obj => {
            if (obj.isLifted || obj.vx !== 0 || obj.vy !== 0) obj.draw();
        });
    }

    update(): void {
        this.boxes.forEach((box) => box.update());
        this.plants.forEach((plant) => plant.update());
        this.chest.update();
    }
}
