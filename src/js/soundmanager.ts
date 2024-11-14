import type p5 from 'p5';
import 'p5/lib/addons/p5.sound';

declare global {
    interface Window {
        p5: {
            prototype: {
                loadSound: (path: string, success?: () => void, error?: (err: any) => void) => any;
            };
        };
    }
}

export class SoundManager {
    // Background music
    private static evergreenbgm: p5.SoundFile;
    private static moveskitbgm: p5.SoundFile;
    private static currentbgm: p5.SoundFile | null = null;

    // Sound effects
    private static pickupSound: p5.SoundFile;
    private static dropSound: p5.SoundFile;
    private static footsteps: p5.SoundFile;
    private static isWalking: boolean = false;

    public static loadSounds(p: p5): void {
        const loadSound = window.p5.prototype.loadSound;

        try {
            // Load background music
            this.evergreenbgm = loadSound.call(p, '/sounds/evergreen.mp3');
            // this.moveskitbgm = loadSound.call(p, '/sounds/moveskit.mp3');

            // // Load sound effects
            // this.pickupSound = loadSound.call(p, '/sounds/pickup.mp3');
            // this.dropSound = loadSound.call(p, '/sounds/drop.mp3');
            // this.footsteps = loadSound.call(p, '/sounds/footsteps.mp3');
        } catch (error) {
            console.error('Error loading sounds:', error);
        }
    }

    public static playEvergreen(): void {
        this.switchBGM(this.evergreenbgm);
    }

    public static playMoveskit(): void {
        this.switchBGM(this.moveskitbgm);
    }

    private static switchBGM(newBGM: p5.SoundFile): void {
        if (this.currentbgm === newBGM) return;

        if (this.currentbgm && this.currentbgm.isPlaying()) {
            this.currentbgm.stop();
        }

        this.currentbgm = newBGM;
        newBGM.setVolume(0.5);
        newBGM.loop();
    }

    public static playPickup(): void {
        this.pickupSound.play();
    }

    public static playDrop(): void {
        this.dropSound.play();
    }

    public static updateWalking(isMoving: boolean): void {
        if (isMoving && !this.isWalking) {
            this.footsteps.setVolume(0.3);
            this.footsteps.loop();
            this.isWalking = true;
        } else if (!isMoving && this.isWalking) {
            this.footsteps.stop();
            this.isWalking = false;
        }
    }
} 