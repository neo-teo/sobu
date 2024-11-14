import type p5 from "p5";
import type { Liftable } from "./liftable";

export class CargoBay {
    private p: p5;  // Store the p5 instance

    private static images: p5.Image[] = [];

    private liftables: Liftable[] = [];

    private readonly bayWidth = 250;
    private readonly bayHeight = 400;

    private displayWeight: number = 0;
    private targetWeight: number = 0;
    private isCalibrating: boolean = false;
    private calibrationStartTime: number = 0;
    private readonly CALIBRATION_DURATION: number = 500; // 2 seconds of calibration
    private lastUpdateTime: number = 0;
    private readonly UPDATE_INTERVAL: number = 100;


    constructor(p: p5, liftables: Liftable[]) {
        this.p = p;

        this.liftables = liftables;

        this.targetWeight = this.calculateTotalWeight();
        this.displayWeight = this.targetWeight;
    }

    public getLiftablesInBay(): Liftable[] {
        const inBayLiftables: Liftable[] = [];
        const bounds = this.getBayBounds();

        for (const liftable of this.liftables) {
            const objCenter = liftable.getCollisionBoundsCenter();
            if (objCenter.x >= bounds.x &&
                objCenter.x <= bounds.x + bounds.width &&
                objCenter.y >= bounds.y &&
                objCenter.y <= bounds.y + bounds.height) {
                inBayLiftables.push(liftable);
            }
        }
        return inBayLiftables;
    }

    private calculateTotalWeight(): number {
        let totalWeight = 0;

        for (const liftable of this.getLiftablesInBay()) {
            totalWeight += liftable.weight;
        }

        return totalWeight;
    }

    whatIsWeight(): number {
        const newWeight = this.calculateTotalWeight();

        // Start calibration if weight has changed
        if (newWeight !== this.targetWeight) {
            this.targetWeight = newWeight;
            this.displayWeight = this.targetWeight;
            this.isCalibrating = true;
            this.calibrationStartTime = Date.now();
            this.lastUpdateTime = Date.now();
        }

        // Handle calibration animation
        if (this.isCalibrating) {
            const elapsed = Date.now() - this.calibrationStartTime;

            if (elapsed > this.CALIBRATION_DURATION) {
                // Calibration complete
                this.isCalibrating = false;
                this.displayWeight = this.targetWeight;
            } else {
                // Only update fluctuation every UPDATE_INTERVAL
                const currentTime = Date.now();
                if (currentTime - this.lastUpdateTime >= this.UPDATE_INTERVAL) {
                    const progress = elapsed / this.CALIBRATION_DURATION;
                    const maxFluctuation = 2 * (1 - progress); // Increased fluctuation for visibility
                    const randomOffset = (Math.random() - 0.5) * maxFluctuation * 2;

                    this.lastUpdateTime = currentTime;
                    this.displayWeight = this.targetWeight + randomOffset;  // Update displayWeight
                }
                return this.displayWeight;  // Always return displayWeight
            }
        }

        return this.displayWeight;
    }

    private getBayBounds() {
        const middleX = this.p.width - this.bayWidth / 2;
        const middleY = this.p.height / 2;

        return {
            x: middleX - this.bayWidth / 2,
            y: middleY - this.bayHeight / 2,
            width: this.bayWidth + 30,
            height: this.bayHeight + 30
        };
    }

    draw(): void {
        if (!CargoBay.images[0] || !CargoBay.images[1] || !CargoBay.images[2]) return;

        let rectW = 10;

        let yoff = this.bayHeight + rectW;
        let xoff = this.bayWidth + rectW;

        let middleX = this.p.width - this.bayWidth / 2;
        let middleY = this.p.height / 2;

        this.p.push();
        this.p.translate(middleX, middleY);
        this.p.imageMode(this.p.CENTER);

        const weight = this.whatIsWeight();
        this.p.noSmooth();

        // walls
        this.p.image(CargoBay.images[0], 0, -yoff / 2, this.bayWidth, rectW);
        this.p.image(CargoBay.images[0], 0, +yoff / 2, this.bayWidth, rectW);
        this.p.image(CargoBay.images[1], -xoff / 2, 0, rectW, this.bayHeight);

        // computer
        this.p.image(CargoBay.images[2], 20, -this.bayHeight / 1.65);

        this.p.fill(74, 246, 38);
        if (weight > 100) {
            this.p.fill('red');
        }
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(10);
        this.p.text(
            weight === 0
                ? '--'
                : weight > 100
                    ? weight.toFixed(0)
                    : weight.toFixed(1)
            , CargoBay.images[2].width / 2.55, -this.bayHeight / 1.58);

        this.p.pop();
    }

    static loadImages(p: p5): void {
        this.images = [
            p.loadImage('/cargobay/horizontal.png'),
            p.loadImage('/cargobay/vertical.png'),
            p.loadImage('/cargobay/display.png')
        ];
    }
}