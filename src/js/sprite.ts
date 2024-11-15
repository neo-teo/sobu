import p5 from 'p5'; // Import the p5 library

import { Obstacle } from './obstacle';
import type { Liftable } from './liftable';
import { Tike } from './tike';
import { CargoBay } from './cargobay';

export default class Sprite {
    static images: { [key: string]: p5.Image } = {};
    private static imagesLoaded: boolean = false;

    private p: p5;  // Store the p5 instance
    private img: p5.Image | null = null
    x: number;
    y: number;
    vx: number;
    vy: number;
    private friction: number;  // Friction for sliding effect
    private speed: number;
    private baseSpeed: number;

    private obstacles: Obstacle[]; // Array of obstacles
    private liftedObject: Liftable | null = null;
    private liftableObjects: Liftable[] = [];
    private lastLiftTime: number = 0;
    private LIFT_COOLDOWN: number = 250; // 250ms cooldown

    private lastDirection: 'left' | 'right' | 'up' | 'down' = 'down';

    private tike: Tike;  // Add reference to Tike
    private cargoBay: CargoBay;  // Add this property

    constructor(p: p5, tike: Tike, cargoBay: CargoBay) {  // Add cargoBay parameter
        this.p = p;
        this.tike = tike;
        this.cargoBay = cargoBay;
        this.x = p.width / 2 - 100;
        this.y = p.height / 2 + 150;
        this.vx = 0;
        this.vy = 0;
        this.friction = .80;
        this.baseSpeed = 1;
        this.speed = this.baseSpeed;
        this.obstacles = [];
    }

    static loadImages(p: p5): void {
        this.images.walkingUp = p.loadImage('/sprite/up.gif');
        this.images.walkingDown = p.loadImage('/sprite/down.gif');
        this.images.walkingLeft = p.loadImage('/sprite/left.gif');
        this.images.walkingRight = p.loadImage('/sprite/right.gif');
        this.images.standingLeft = p.loadImage('/sprite/left_rest.gif');  // Or separate standing images if you have them
        this.images.standingRight = p.loadImage('/sprite/right_rest.gif');
        this.images.standingUp = p.loadImage('/sprite/up_rest.gif');
        this.images.standingDown = p.loadImage('/sprite/down_rest.gif');
        this.images.sleeping = p.loadImage('/sprite/sleep.gif');

        this.imagesLoaded = true;
    }

    setObstacles(obstacles: Obstacle[]): void {
        this.obstacles = obstacles;
    }

    setLiftableObjects(liftables: Liftable[]): void {
        this.liftableObjects = liftables;
    }

    public hasInteractedRecently(): boolean {
        return Date.now() - this.lastLiftTime < this.LIFT_COOLDOWN * 2;
    }

    private isColliding(x: number, y: number): boolean {
        if (!this.img) return false;

        const spriteWidth = this.img.width * 0.8;
        const spriteHeight = this.img.height * 0.8;

        return this.obstacles.some(obstacle =>
            !('isLifted' in obstacle && (obstacle as unknown as Liftable).isLifted) &&
            obstacle.isColliding(x, y, spriteWidth, spriteHeight)
        );
    }

    handleInput(): void {
        // If Tike is transitioning, force sprite to move right and disable controls
        if (this.tike.isTransitioning) {
            this.img = Sprite.images.standingRight;
            this.x = this.tike.x + Sprite.images.standingRight.width; // Follow behind Tike
            this.y = this.tike.y - Sprite.images.standingRight.height / 2; // Follow behind Tike
            return;
        }

        // Guard against unloaded images
        if (!Sprite.images || !this.img) return;

        this.speed = this.baseSpeed;
        if (this.liftedObject) {
            const weight = this.liftedObject.weight;
            this.speed = this.baseSpeed * (1 / (1 + weight * 0.07));
        }

        const currentTime = Date.now();
        let moved = false;

        if (this.p.keyIsDown(69) && // 'E' key
            currentTime - this.lastLiftTime > this.LIFT_COOLDOWN) {
            this.lastLiftTime = currentTime;
            this.handleLifting();
        }

        let ax = 0;
        let ay = 0;

        // Handle horizontal movement
        if (this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65)) {
            ax = -this.speed;
            this.img = Sprite.images.walkingLeft;
            this.lastDirection = 'left';
            moved = true;
        } else if (this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68)) {
            ax = this.speed;
            this.img = Sprite.images.walkingRight;
            this.lastDirection = 'right';
            moved = true;
        }

        // Handle vertical movement
        if (this.p.keyIsDown(this.p.UP_ARROW) || this.p.keyIsDown(87)) {
            ay = -this.speed;
            // Only update sprite image if not moving horizontally
            if (!ax) {
                this.img = Sprite.images.walkingUp;
                this.lastDirection = 'up';
            }
            moved = true;
        } else if (this.p.keyIsDown(this.p.DOWN_ARROW) || this.p.keyIsDown(83)) {
            ay = this.speed;
            // Only update sprite image if not moving horizontally
            if (!ax) {
                this.img = Sprite.images.walkingDown;
                this.lastDirection = 'down';
            }
            moved = true;
        }

        // Normalize diagonal movement to maintain consistent speed
        if (ax !== 0 && ay !== 0) {
            ax *= 0.707; // approximately 1/√2
            ay *= 0.707;
        }

        if (!moved) {
            switch (this.lastDirection) {
                case 'left': this.img = Sprite.images.standingLeft; break;
                case 'right': this.img = Sprite.images.standingRight; break;
                case 'up': this.img = Sprite.images.standingUp; break;
                case 'down': this.img = Sprite.images.standingDown; break;
            }
        }

        // Apply acceleration to velocity
        this.vx += ax;
        this.vy += ay;
    }

    private handleLifting(): void {
        if (this.liftedObject) {
            this.liftedObject.drop(this.lastDirection);
            this.liftedObject = null;
            return;
        }

        const spriteCenter = {
            x: this.x + (this.img?.width ?? 0) * 0.4,
            y: this.y + (this.img?.height ?? 0) * 0.4
        };
        let closestLiftable: Liftable | null = null;
        let closestDistance = Infinity;

        for (const liftable of this.liftableObjects) {
            // Skip Tike if cargo bay is overweight
            if (liftable === this.tike && this.cargoBay.isOverweight()) {
                continue;
            }

            if (liftable.isNearby(spriteCenter.x, spriteCenter.y)) {
                const liftableCenter = liftable.getCollisionBoundsCenter();
                const dx = liftableCenter.x - spriteCenter.x;
                const dy = liftableCenter.y - spriteCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestLiftable = liftable;
                }
            }
        }

        if (closestLiftable) {
            this.liftedObject = closestLiftable;
            closestLiftable.lift();
        }
    }

    update(): void {
        this.vx *= this.friction;
        this.vy *= this.friction;

        const newX = this.x + this.vx;
        const newY = this.y + this.vy;

        if (!this.isColliding(newX, this.y)) {
            this.x = newX;
        }
        if (!this.isColliding(this.x, newY)) {
            this.y = newY;
        }

        // If the velocity is very small, stop the sprite completely
        if (Math.abs(this.vx) < 0.01) this.vx = 0;
        if (Math.abs(this.vy) < 0.01) this.vy = 0;
    }

    draw(): void {
        this.update();
        if (this.img) {
            this.p.image(this.img, this.x, this.y, this.img.width * 0.8, this.img.height * 0.8);
        } else if (Sprite.imagesLoaded) {
            this.img = Sprite.images.standingDown;
        }

        if (this.liftedObject) {
            this.liftedObject.followSprite(this.x, this.y);
        }
    }
}
