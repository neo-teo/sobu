import type p5 from "p5";

export class Dialog {
    private readonly script: string[] = [
        "287 Evergreen Ave, Bushwick NY\n\n\nJuly 1st 2024",
        "It's tough looking at the things you saw potential in and kept",
        "knowing you won't, or shouldn't bring with you on your new chapter.",
        "Moving isn't all bad though.",
        "Like when it poured on Wriston and we moved the 100$ fake leather futon from amazon",
        "or when we moved out of 102 Governor with our last coffee from the shop with munetta,",
        "or when we moved to Sobu and had our first Dicayagua trip.",
        "On to the next.",
    ];

    private p: p5;

    private currentScriptIndex: number = 0;
    private isWaitingForNext: boolean = false;

    private wasSpacePressed: boolean = false;

    private currentText: string = '';
    private targetText: string = '';
    private currentIndex: number = 0;
    private letterDelay: number = 1; // Much faster text speed (was 5)
    private lastLetterTime: number = 0;

    constructor(p: p5) {
        this.p = p;
    }

    public start(): void {
        this.currentScriptIndex = 0;
        this.setText(this.script[0]);
    }

    setText(text: string): void {
        this.targetText = text;
        this.currentText = '';
        this.currentIndex = 0;
        this.isWaitingForNext = false;
    }

    update(): void {
        if (this.isDone) return;
        const now = this.p.millis();

        if (this.currentIndex < this.targetText.length &&
            now - this.lastLetterTime > this.letterDelay) {
            this.currentText += this.targetText[this.currentIndex];
            this.currentIndex++;
            this.lastLetterTime = now;
        } else if (this.currentIndex >= this.targetText.length && !this.isWaitingForNext) {
            this.isWaitingForNext = true;
        }
    }

    isDone = false;

    handleInput(): void {
        if (this.p.keyIsPressed && this.p.keyCode === 32) {
            if (this.isWaitingForNext && !this.wasSpacePressed) {
                this.currentScriptIndex++;
                this.setText(this.script[this.currentScriptIndex]);
            }
            this.wasSpacePressed = true;
        } else {
            this.wasSpacePressed = false;
        }

        // if the last dialog is done, set the moveskit weArrived to true
        if (this.currentScriptIndex > this.script.length - 1) {
            this.isDone = true;
        }
    }

    draw(): void {
        if (this.isDone) return;

        const padding = 20;
        const paddingY = padding / 1.25;
        const boxWidth = 450;
        const boxHeight = 100;
        const lineHeight = 24; // Spacing between lines
        const maxWidth = boxWidth - (padding * 2);

        let dialogX = this.p.width / 2 - boxWidth / 2;
        let dialogY = this.p.height - boxHeight * 1.5

        this.p.push();
        this.p.fill(255, 255, 255, 150);
        this.p.strokeWeight(3);
        this.p.rect(dialogX, this.p.height - boxHeight * 1.5, boxWidth, boxHeight);
        this.p.pop();

        this.p.fill(0);
        this.p.textSize(13);

        const words = this.currentText.split(' ');
        let currentLine = '';
        let y = dialogY + paddingY;

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = this.p.textWidth(testLine);

            if (testWidth > maxWidth) {
                this.p.text(currentLine, dialogX + padding, y + paddingY);
                currentLine = word;
                y += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        // Draw the last line
        if (currentLine) {
            this.p.text(currentLine, dialogX + padding, y + paddingY);
        }

        if (this.isWaitingForNext) {
            this.p.textSize(10);
            this.p.text("→ space", dialogX + boxWidth - padding * 5, dialogY + boxHeight - paddingY);
        }
    }
}