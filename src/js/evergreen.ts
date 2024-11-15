import p5 from "p5";
import { Wall } from "./wall";
import { Box } from "./box";
import { Plant } from "./plant";
import { CargoBay } from "./cargobay";
import { Chest } from "./chest";
import Sprite from "./sprite";
import { Tike } from "./tike";
import { Liftable } from "./liftable";

export class Evergreen {
    walls: Wall[];
    boxes: Box[];
    plants: Plant[];
    chest: Chest;
    cargobay: CargoBay;
    sprite: Sprite;
    p: p5;
    tike: Tike;
    moveOutWith: Liftable[] | null;

    constructor(p: p5) {
        this.p = p;
        this.tike = new Tike(p, p.width - 150, p.height / 2);

        this.walls = this.createWalls();

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
        this.sprite = new Sprite(p, this.tike, this.cargobay);

        this.moveOutWith = null;
    }

    drawCargobay(): void {
        this.walls.forEach((w) => w.draw());

        this.cargobay.draw();
    }

    draw(): void {
        const liftables = [...this.boxes, this.chest, ...this.plants];

        liftables.forEach(obj => {
            if (!obj.isLifted && !obj.vx && !obj.vy) obj.draw();
        });

        this.tike.ignited = this.cargobay.whatIsWeight() > 25 && this.cargobay.whatIsWeight() < 99;

        if (!this.tike.isLifted) {
            this.tike.draw();
        }

        this.sprite.draw();

        liftables.forEach(obj => {
            if (obj.isLifted || obj.vx !== 0 || obj.vy !== 0) obj.draw();
        });

        if (this.tike.isLifted) {
            this.tike.draw();
        }
    }

    update(): void {
        this.boxes.forEach((box) => box.update());
        this.chest.update();
        this.plants.forEach((plant) => plant.update());
        this.tike.update();
    }

    setupObstacles(): void {
        const obstacles = [...this.walls, ...this.boxes, ...this.plants, this.chest];
        const liftables = [...this.boxes, ...this.plants, this.chest, this.tike];

        this.sprite.setObstacles(obstacles);
        this.sprite.setLiftableObjects(liftables);

        this.boxes.forEach((box) => box.setObstacles(obstacles));
        this.plants.forEach((plant) => plant.setObstacles(obstacles));
        this.chest.setObstacles(obstacles);
        this.tike.setObstacles(obstacles);
    }

    public movedOutWith(): Liftable[] {
        if (!this.moveOutWith) this.moveOutWith = this.cargobay.getLiftablesInBay();
        return this.moveOutWith;
    }

    weMovedOut(): boolean {
        return this.tike.weMovedOut;
    }

    private createWalls(): Wall[] {
        return [
            // vertical walls
            new Wall(this.p, 0, 0, 20, this.p.windowHeight),
            new Wall(this.p, this.p.windowWidth - 20, 0, 20, this.p.windowHeight / 2 - 200),
            new Wall(this.p, this.p.windowWidth + 20, this.p.windowHeight / 2 - 200, 20, 400),
            new Wall(this.p, this.p.windowWidth - 20, this.p.windowHeight / 2 + 200, 20, this.p.windowHeight / 2),
            // horizontal walls
            new Wall(this.p, 0, 0, this.p.windowWidth, 20),
            new Wall(this.p, 0, this.p.windowHeight - 20, this.p.windowWidth, 20),
        ];
    }

    private updateWalls(): void {
        this.walls = this.createWalls();
    }

    public resize(): void {
        this.updateWalls();
        this.setupObstacles();
    }
}
