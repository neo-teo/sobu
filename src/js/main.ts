import P5 from 'p5';
import { Evergreen } from './evergreen';
import { Box } from './box';
import { Plant } from './plant';
import { DialogManager } from './dialogmanager';
import { MoveSkit } from './moveskit';
import { Wall } from './wall';
import { CargoBay } from './cargobay';
import Sprite from './sprite';
import { Chest } from './chest';

const sketch = (p: P5) => {
    let sprite: Sprite;
    let evergreen: Evergreen;
    let dialogManager: DialogManager;
    let moveskit: MoveSkit;
    let customFont: P5.Font;

    p.preload = () => {
        Sprite.loadImages(p);
        Wall.loadImages(p);
        Box.loadImages(p);
        Plant.loadImages(p);
        MoveSkit.loadImages(p);
        CargoBay.loadImages(p);
        Chest.loadImage(p)

        customFont = p.loadFont('/sobu/pay2win.ttf');
    };

    p.setup = () => {
        p.textFont(customFont);
        p.createCanvas(p.windowWidth, p.windowHeight);

        sprite = new Sprite(p);
        evergreen = new Evergreen(p, sprite);
        dialogManager = new DialogManager(p);
        moveskit = new MoveSkit(p);

        evergreen.setupObstacles();
    };

    p.draw = () => {
        if (p.windowWidth < 600 || p.windowHeight < 700) {
            smallDeviceMessage();
            return;
        }

        p.background(255);

        if (evergreen.weMovedOut()) {
            moveskit.draw();
            return;
        }

        sprite.handleInput();

        evergreen.update();

        evergreen.drawCargobay();
        evergreen.draw();

        dialogManager.update(sprite);
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

new P5(sketch, document.getElementById('sketch-container') || undefined);