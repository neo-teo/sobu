import type p5 from "p5";
import Sprite from "./sprite";
import { Liftable } from "./liftable";
import { Wall } from "./wall";

export class MoveSkit {
    private static backgroundImg: p5.Image | null = null;
    static carImg: p5.Image | null = null;

    private frameCount: number = 0;
    private currentBounceOffset: number = 0;
    private readonly BOUNCE_HEIGHTS: number[] = [0, -1, -3, -1, -3, -2, -1, -3];  // Pixel positions for bounce
    private readonly FRAME_DELAY: number = 10;  // How many frames to wait before changing height
    private readonly ROTATION_ANGLE = 0.05; // Maximum rotation in radians
    private readonly ROTATION_SPEED = 0.02; // Speed of rotation cycle
    private rotationOffset: number = 0;

    private p: p5;
    private liftables: Liftable[] = [];

    public weArrived: boolean = false;
    private startTime: number | null = null;

    constructor(p: p5) {
        this.p = p;
    }

    public setLiftables(liftables: Liftable[]): void {
        this.liftables = liftables;
    }

    static loadImages(p: p5): void {
        this.backgroundImg = p.loadImage('/street.gif');
        this.carImg = p.loadImage('/tike.png');
    }

    draw(dialogIsDone: boolean): void {
        if (!MoveSkit.backgroundImg || !MoveSkit.carImg || !Sprite.images.standingRight) return;

        if (dialogIsDone && this.startTime === null) {
            this.startTime = Date.now();
        }

        // 5 seconds after we've finished the dialog
        if (this.startTime && Date.now() - this.startTime >= 5000 && dialogIsDone) {
            this.weArrived = true;
        }

        let { displayWidth, displayHeight } = this.getBackgroundDim();

        // Update bounce position every FRAME_DELAY frames
        if (this.frameCount % this.FRAME_DELAY === 0) {
            const baseHeight = this.BOUNCE_HEIGHTS[Math.floor(this.frameCount / this.FRAME_DELAY) % this.BOUNCE_HEIGHTS.length];
            // Add small random variation (-1, 0, or 1)
            this.currentBounceOffset = baseHeight + (Math.floor(Math.random() * 3) - 1);
        }
        this.frameCount++;

        this.p.push();
        this.p.imageMode(this.p.CENTER);
        this.p.image(MoveSkit.backgroundImg, this.p.width / 2, this.p.height / 2, displayWidth, displayHeight);
        this.p.imageMode(this.p.CORNER);
        this.p.noSmooth();
        this.p.image(
            Sprite.images.standingRight,
            this.p.width / 2 - Sprite.images.standingRight.width - 20,
            this.p.height - Sprite.images.standingRight.height * 2.55 + this.currentBounceOffset,
            Sprite.images.standingRight.width * 2,
            Sprite.images.standingRight.height * 2
        );
        this.p.image(
            MoveSkit.carImg,
            this.p.width / 2 - MoveSkit.carImg.width * 3 / 2,
            this.p.height - MoveSkit.carImg.height * 2.4 + this.currentBounceOffset,
            MoveSkit.carImg.width * 2.7,
            MoveSkit.carImg.height * 2.7
        );
        this.p.pop();
        this.drawLiftables();
    }

    private drawLiftables(): void {
        if (!MoveSkit.carImg || this.liftables.length === 0) return;

        const sortedLiftables = [...this.liftables]
            .sort((a, b) => b.weight - a.weight)
            .reverse();

        // Calculate total stack height
        let totalHeight = 0;
        sortedLiftables.forEach(liftable => {
            totalHeight += liftable.img.height * 2;
        });

        const carTop = this.p.height - MoveSkit.carImg.height * 2.4;

        let currentY = carTop - totalHeight;
        const centerX = this.p.width / 2 - 20;

        this.rotationOffset = Math.round(Math.sin(this.frameCount * this.ROTATION_SPEED) * 3) / 3 * this.ROTATION_ANGLE;

        this.p.push();
        this.p.imageMode(this.p.CORNER);

        // Apply stack rotation
        this.p.translate(centerX, carTop);
        this.p.rotate(this.rotationOffset);
        this.p.translate(-centerX, -carTop);

        for (const liftable of sortedLiftables) {
            this.p.image(
                liftable.img,
                centerX - liftable.img.width,
                currentY + this.currentBounceOffset,
                liftable.img.width * 2,
                liftable.img.height * 2
            );

            currentY += liftable.img.height * 2;
        }

        // Wall image (centered X, CORNER mode Y)
        this.p.image(
            Wall.images[0],
            centerX - (Wall.images[0].width * 0.1), // Center X
            currentY + this.currentBounceOffset,
            Wall.images[0].width * 0.2,
            Wall.images[0].height * .5
        );

        this.p.pop();
    }

    getBackgroundDim() {
        if (!MoveSkit.backgroundImg) return { displayWidth: 0, displayHeight: 0 };

        let canvasAspectRatio = this.p.width / this.p.height;
        let imageAspectRatio = MoveSkit.backgroundImg.width / MoveSkit.backgroundImg.height;

        let displayWidth, displayHeight;

        if (imageAspectRatio > canvasAspectRatio) {
            displayHeight = this.p.height;
            displayWidth = this.p.height * imageAspectRatio;
        } else {
            displayWidth = this.p.width;
            displayHeight = this.p.width / imageAspectRatio;
        }

        return { displayWidth, displayHeight };
    }
}