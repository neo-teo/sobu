import type p5 from "p5";
import Sprite from "./sprite";

export class MoveSkit {
    private static backgroundImg: p5.Image | null = null;
    static carImg: p5.Image | null = null;

    private frameCount: number = 0;
    private currentBounceOffset: number = 0;
    private readonly BOUNCE_HEIGHTS: number[] = [0, -1, -3, -1, -3, -2, -1, -3];  // Pixel positions for bounce
    private readonly FRAME_DELAY: number = 10;  // How many frames to wait before changing height

    private p: p5;

    constructor(p: p5) {
        this.p = p;
    }

    static loadImages(p: p5): void {
        this.backgroundImg = p.loadImage('/sobu/street.gif');
        this.carImg = p.loadImage('/sobu/tike.png');
    }

    draw(): void {
        if (!MoveSkit.backgroundImg || !MoveSkit.carImg || !Sprite.images.standingRight) return;

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
            this.p.height - Sprite.images.standingRight.height * 3 + this.currentBounceOffset,
            Sprite.images.standingRight.width * 2,
            Sprite.images.standingRight.height * 2
        );
        this.p.image(
            MoveSkit.carImg,
            this.p.width / 2 - MoveSkit.carImg.width * 3 / 2,
            this.p.height - MoveSkit.carImg.height * 2.7 + this.currentBounceOffset,
            MoveSkit.carImg.width * 3,
            MoveSkit.carImg.height * 3
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