import type p5 from "p5";
import { Obstacle } from "./obstacle";
import { LiftableMixin, type Liftable, type InteractionArea } from "./liftable";

export class Box extends Obstacle implements Liftable, InteractionArea {
    private static images: p5.Image[] = [];
    private liftableImpl: LiftableMixin;
    isLifted: boolean = false;
    img: p5.Image;

    name: string;
    description: string;

    get vx(): number { return this.liftableImpl.vx; }
    get vy(): number { return this.liftableImpl.vy; }

    // TODO: change size with the thing it contains, base size and description based off that
    constructor(p: p5, x: number, y: number, size: 'sm' | 'md' | 'lg') {
        super(p, x, y, 50, 50);

        switch (size) {
            case 'sm':
                this.name = 'Small box';
                this.description = '?????';
                this.img = Box.images[0];
                this.weight = 5.0;
                break;
            case 'md':
                this.name = 'Medium box';
                this.description = '?????';
                this.img = Box.images[1];
                this.weight = 20.8;
                break;
            case 'lg':
                this.name = 'Large box';
                this.description = '?????';
                this.img = Box.images[2];
                this.weight = 8.5;
                break;
        }
        this.width = this.img.width;
        this.height = this.img.height;

        this.liftableImpl = new LiftableMixin(p, x, y, this);
    }

    setObstacles(obstacles: InteractionArea[]): void {
        this.liftableImpl.setObstacles(obstacles);
    }

    getCollisionBounds() {
        return {
            x: this.x + this.width / 6,
            y: this.y + this.height / 6,
            width: this.width / 2,
            height: this.height / 2
        };
    }

    getCollisionBoundsCenter(): { x: number, y: number } {
        return this.liftableImpl.getCollisionBoundsCenter();
    }

    lift(): void {
        this.liftableImpl.lift();
        this.isLifted = this.liftableImpl.isLifted;
    }

    update(): void {
        this.liftableImpl.update();
        // Update Box's position from the mixin
        this.x = this.liftableImpl.x;
        this.y = this.liftableImpl.y;
    }

    drop(direction: 'left' | 'right' | 'up' | 'down'): void {
        this.liftableImpl.drop(direction);
        this.isLifted = this.liftableImpl.isLifted;
    }

    followSprite(spriteX: number, spriteY: number): void {
        this.liftableImpl.followSprite(spriteX, spriteY);
        // Update Box's position from the mixin
        this.x = this.liftableImpl.x;
        this.y = this.liftableImpl.y;
    }

    isNearby(spriteX: number, spriteY: number, threshold?: number): boolean {
        return this.liftableImpl.isNearby(spriteX, spriteY, threshold);
    }

    setJumpingEnabled(enabled: boolean): void {
        this.liftableImpl.setJumpingEnabled(enabled);
    }

    static loadImages(p: p5): void {
        this.images = [
            p.loadImage('/boxes/small.png'),
            p.loadImage('/boxes/medium.png'),
            p.loadImage('/boxes/large.png'),
        ];
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