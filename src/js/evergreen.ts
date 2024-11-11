import p5 from "p5";
import { Wall } from "./wall";
import { Box } from "./box";
import { Plant } from "./plant";
import { CargoBay } from "./cargobay";
import { Chest } from "./chest";

export class Evergreen {
    walls: Wall[];
    boxes: Box[];
    plants: Plant[];
    chest: Chest;
    cargobay: CargoBay;
    p: p5;

    constructor(p: p5) {
        this.p = p;

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

        this.cargobay = new CargoBay(p, [...this.boxes, ...this.plants])
    }

    drawCargobay(): void {
        this.cargobay.draw();
    }

    draw(): void {
        this.walls.forEach((w) => w.draw());

        this.boxes.forEach((b) => b.draw());
        this.chest.draw();
        this.plants.forEach((p) => p.draw());

        // if cargoBay.isOverloaded, show exit object which is glowing circle on top of tike lol 
    }
}