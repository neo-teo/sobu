import p5 from 'p5';
import { Dialog } from './dialog';
import { Tutorial } from './tutorial';
import Sprite from './sprite';

export class DialogManager {
    p: p5;

    private isTutorialActive: boolean = true;
    private tutorial: Tutorial;
    private dialog: Dialog;

    constructor(p: p5) {
        this.p = p;
        this.tutorial = new Tutorial(p);
        this.dialog = new Dialog(p);
    }

    update(sprite: Sprite): void {
        if (this.isTutorialActive) {
            this.tutorial.update(sprite);
            if (this.tutorial.isComplete()) {
                this.isTutorialActive = false;
                this.dialog.start();
            }
        } else {
            this.dialog.handleInput();
            this.dialog.update();
        }
    }

    draw(): void {
        if (this.isTutorialActive) {
            this.tutorial.draw();
        } else {
            this.dialog.draw();
        }
    }
} 