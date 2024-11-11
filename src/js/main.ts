import P5 from 'p5';
import { Evergreen } from './evergreen';
import { Box } from './box';
import { Plant } from './plant';
import { Dialog } from './dialog';
import { Tutorial } from './tutorial';
import { MoveSkit } from './moveskit';
import { Wall } from './wall';
import { CargoBay } from './cargobay';
import Sprite from './sprite';

const sketch = (p: P5) => {
    let sprite: Sprite;
    let evergreen: Evergreen;
    let dialog: Dialog;
    let moveskit: MoveSkit;
    let tutorial: Tutorial;
    let isTutorialActive = true;
    let customFont: P5.Font;

    p.preload = () => {
        Sprite.loadImages(p);
        Wall.loadImages(p);
        Box.loadImages(p);
        Plant.loadImages(p);
        MoveSkit.loadImages(p);
        CargoBay.loadImages(p);

        customFont = p.loadFont('/sobu/pay2win.ttf');
    };

    p.setup = () => {
        p.textFont(customFont);
        p.createCanvas(p.windowWidth, p.windowHeight);

        sprite = new Sprite(p);
        evergreen = new Evergreen(p);
        dialog = new Dialog(p);
        tutorial = new Tutorial(p);
        moveskit = new MoveSkit(p);

        let obstacles = [...evergreen.walls, ...evergreen.boxes, ...evergreen.plants];
        let liftables = [...evergreen.boxes, ...evergreen.plants];

        sprite.setObstacles(obstacles);
        sprite.setLiftableObjects(liftables);

        evergreen.boxes.forEach((box) => box.setObstacles(obstacles));
        evergreen.plants.forEach((plant) => plant.setObstacles(obstacles));
    };

    p.draw = () => {
        if (p.windowWidth < 600 || p.windowHeight < 700) {
            smallDeviceMessage();
            return;
        }

        // moveskit.draw();
        // return;

        p.background(255);

        evergreen.drawCargobay();

        sprite.handleInput();
        sprite.draw();

        evergreen.boxes.forEach((box) => box.update());
        evergreen.plants.forEach((plant) => plant.update());
        evergreen.draw();

        if (isTutorialActive) {
            tutorial.update(sprite);
            tutorial.draw();

            if (tutorial.isComplete()) {
                isTutorialActive = false;
                dialog.start();
            }
        } else {
            dialog.handleInput();
            dialog.update();
            dialog.draw();
        }
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
};

new P5(sketch, document.getElementById('sketch-container') || undefined);