import type p5 from "p5";
import { LiftableMixin, type Liftable, type InteractionArea } from "./liftable";
import { MoveSkit } from "./moveskit";

export class Tike implements Liftable, InteractionArea {
    private p: p5;
    private liftableImpl: LiftableMixin;
    isLifted: boolean = false;
    private _x: number;
    private _y: number;
    img: p5.Image;

    readonly weight: number = 0;

    private _isTransitioning: boolean = false;
    private transitionX: number = 0;
    private readonly TRANSITION_SPEED = 0.3;
    private readonly TRANSITION_DISTANCE = 100;
    private startX: number = 0;

    private carJitters = [-1, 1, 1, -1, -1, 1, 2, 0, -2];
    private jitterI = 0;

    constructor(p: p5, x: number, y: number) {
        this.p = p;
        this._x = x;
        this._y = y;
        this.img = MoveSkit.carImg || p.createImage(0, 0);

        this.liftableImpl = new LiftableMixin(p, x, y, this);
    }

    get x(): number { return this._isTransitioning ? this.transitionX : this.liftableImpl.x; }
    get y(): number { return this.liftableImpl.y; }
    get vx(): number { return this.liftableImpl.vx; }
    get vy(): number { return this.liftableImpl.vy; }

    lift(): void {
        if (this.isLifted) return;
        this.isLifted = true;
        this._isTransitioning = true;
        this.startX = this.liftableImpl.x;
        this.transitionX = this.startX;
    }

    drop(): void {
        // Car can't be dropped
    }

    followSprite(spriteX: number, spriteY: number): void {
        // Car doesn't follow sprite
    }

    isNearby(spriteX: number, spriteY: number, threshold: number = 70): boolean {
        return this.liftableImpl.isNearby(spriteX, spriteY, threshold);
    }

    getCollisionBounds() {
        const imageWidth = MoveSkit.carImg?.width || 0;
        const imageHeight = MoveSkit.carImg?.height || 0;
        return {
            x: this.x + imageWidth * 1.1,
            y: this.y,
            width: imageWidth * 1.2 / 4,
            height: imageHeight * 1.2 / 4
        };
    }

    getCollisionBoundsCenter(): { x: number; y: number; } {
        return this.liftableImpl.getCollisionBoundsCenter();
    }

    setObstacles(obstacles: InteractionArea[]): void {
        this.liftableImpl.setObstacles(obstacles);
    }

    update(): void {
        if (this._isTransitioning) {
            if (this.transitionX < this.startX + this.TRANSITION_DISTANCE) {
                this.transitionX += this.TRANSITION_SPEED;
            }
        } else {
            this.liftableImpl.update();
        }
    }

    get weMovedOut(): boolean {
        return this._isTransitioning && this.x >= this.startX + this.TRANSITION_DISTANCE;
    }

    draw(ignited: boolean): void {
        this.p.push();
        this.p.noSmooth();
        this.p.imageMode(this.p.CENTER);

        let yOffset = 0;
        if (ignited) {
            this.jitterI++;
            if (this.jitterI >= this.carJitters.length) this.jitterI = 0;
            yOffset = this._isTransitioning
                ? this.carJitters[this.jitterI] / 4
                : this.carJitters[this.jitterI] / 2;
        }

        this.p.image(
            this.img,
            this.x + this.img.width * 1.1,
            this.y + yOffset,
            this.img.width * 1.2,
            this.img.height * 1.2
        );

        this.p.pop();
    }

    get isTransitioning(): boolean {
        return this._isTransitioning;
    }
}