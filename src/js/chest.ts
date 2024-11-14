import type p5 from "p5";
import { Obstacle } from "./obstacle";
import { LiftableMixin, type Liftable, type InteractionArea } from "./liftable";

export class Chest extends Obstacle implements Liftable, InteractionArea {
    private static image: p5.Image;
    private liftableImpl: LiftableMixin;
    isLifted: boolean = false;
    img: p5.Image;

    name: string = 'Chest';
    description: string = 'Good for storage, and for taking a seat';

    get vx(): number { return this.liftableImpl.vx; }
    get vy(): number { return this.liftableImpl.vy; }

    constructor(p: p5, x: number, y: number) {
        super(p, x, y, 50, 50);
        this.weight = 40.5;
        this.width = Chest.image.width;
        this.height = Chest.image.height;
        this.liftableImpl = new LiftableMixin(p, x, y, this);

        this.img = Chest.image;
    }

    lift(): void {
        this.liftableImpl.lift();
        this.isLifted = this.liftableImpl.isLifted;
    }

    update(): void {
        this.liftableImpl.update();
        this.x = this.liftableImpl.x;
        this.y = this.liftableImpl.y;
    }

    drop(direction: 'left' | 'right' | 'up' | 'down'): void {
        this.liftableImpl.drop(direction);
        this.isLifted = this.liftableImpl.isLifted;
    }

    followSprite(spriteX: number, spriteY: number): void {
        this.liftableImpl.followSprite(spriteX, spriteY);
        this.x = this.liftableImpl.x;
        this.y = this.liftableImpl.y;
    }

    isNearby(spriteX: number, spriteY: number, threshold?: number): boolean {
        return this.liftableImpl.isNearby(spriteX, spriteY, threshold);
    }

    setJumpingEnabled(enabled: boolean): void {
        this.liftableImpl.setJumpingEnabled(enabled);
    }

    setObstacles(obstacles: InteractionArea[]): void {
        this.liftableImpl.setObstacles(obstacles);
    }

    getCollisionBounds() {
        return {
            x: this.x + this.width / 4,
            y: this.y + this.height / 4,
            width: this.width / 2,
            height: this.height / 1.5
        };
    }

    getCollisionBoundsCenter(): { x: number, y: number } {
        return this.liftableImpl.getCollisionBoundsCenter();
    }

    static loadImage(p: p5): void {
        this.image = p.loadImage('/chest.png');
    }

    draw(scale?: number): void {
        this.p.image(this.img, this.x, this.y, this.img.width * (scale ?? 1), this.img.height * (scale ?? 1));
    }

    set_x_unsafe(x: number): void {
        this.liftableImpl.set_x_unsafe(x);
    }

    set_y_unsafe(y: number): void {
        this.liftableImpl.set_y_unsafe(y);
    }
} 