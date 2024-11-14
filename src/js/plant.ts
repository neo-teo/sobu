import type p5 from "p5";
import { Obstacle } from "./obstacle";
import { LiftableMixin, type Liftable, type InteractionArea } from "./liftable";

export class Plant extends Obstacle implements Liftable, InteractionArea {
    private static images: p5.Image[] = [];
    private liftableImpl: LiftableMixin;
    isLifted: boolean = false;
    img: p5.Image;

    name: string;
    description: string;

    get vx(): number { return this.liftableImpl.vx; }
    get vy(): number { return this.liftableImpl.vy; }

    private readonly potWidth = 45;
    private readonly potHeight = 30;

    constructor(p: p5, x: number, y: number, type: 'snake' | 'bird') {
        super(p, x, y, 50, 50);

        switch (type) {
            case 'bird':
                this.name = 'Bird of Paradise';
                this.description = 'Good for shade';
                this.img = Plant.images[0];
                this.weight = 4.8;
                break;
            case 'snake':
                this.name = 'Snake Plant';
                this.description = 'Good for poking things';
                this.img = Plant.images[1];
                this.weight = 2.3;
                break;
        }

        this.width = this.img.width;
        this.height = this.img.height;

        this.liftableImpl = new LiftableMixin(p, x, y, this);
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
            x: this.x + (this.width - this.potWidth) / 2,
            y: this.y + this.height - this.potHeight,
            width: this.potWidth,
            height: this.potHeight
        };
    }

    getCollisionBoundsCenter(): { x: number, y: number } {
        return this.liftableImpl.getCollisionBoundsCenter();
    }

    static loadImages(p: p5): void {
        this.images = [
            p.loadImage('/plants/bird.png'),
            p.loadImage('/plants/snake.png'),
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
