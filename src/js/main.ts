import p5 from 'p5';
import { Evergreen } from './evergreen';
import { Box } from './box';
import { Plant } from './plant';
import { DialogManager } from './dialogmanager';
import { MoveSkit } from './moveskit';
import { Rivington } from './rivington';
import { Wall } from './wall';
import { CargoBay } from './cargobay';
import Sprite from './sprite';
import { Chest } from './chest';
// import { SoundManager } from './soundmanager';

const sketch = (p: p5) => {
    let evergreen: Evergreen;
    let dialogManager: DialogManager;
    let moveskit: MoveSkit;
    let rivington: Rivington;
    let customFont: p5.Font;

    p.preload = () => {
        Sprite.loadImages(p);
        Wall.loadImages(p);
        Box.loadImages(p);
        Plant.loadImages(p);
        MoveSkit.loadImages(p);
        CargoBay.loadImages(p);
        Chest.loadImage(p);

        // SoundManager.loadSounds(p);

        customFont = p.loadFont('/pay2win.ttf');
    };

    p.setup = () => {
        p.textFont(customFont);
        p.createCanvas(p.windowWidth, p.windowHeight);

        evergreen = new Evergreen(p);
        dialogManager = new DialogManager(p);
        moveskit = new MoveSkit(p);
        rivington = new Rivington(p);

        evergreen.setupObstacles();
    };

    p.draw = () => {
        if (p.windowWidth < 600 || p.windowHeight < 700) {
            smallDeviceMessage();
            return;
        }

        p.background(255);

        // evergreen.weMovedOut()
        if (evergreen.weMovedOut()) {
            const movedOutWith = evergreen.movedOutWith();

            // moveskit.weArrived
            if (moveskit.weArrived) {
                rivington.draw(movedOutWith);
                return;
            }

            moveskit.setLiftables(movedOutWith);
            moveskit.draw();
            return;
        }

        evergreen.sprite.handleInput();

        evergreen.update();

        evergreen.drawCargobay();
        evergreen.draw();

        dialogManager.update(evergreen.sprite);
        dialogManager.draw();
    };

    function smallDeviceMessage(): void {
        p.background(0);
        p.push();
        p.textAlign('center');
        p.textSize(15);
        p.fill('white');
        p.text('Sobu is meant to be \nplayed on large devices.', p.width / 2, p.height / 2);
        p.pop();
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        evergreen.resize();
    };
};

new p5(sketch, document.getElementById('sketch-container') || undefined);