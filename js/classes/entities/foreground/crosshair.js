/**
 * Crosshair entity for the game. This is going to be used to aim the projectiles.
 * @author Nathan Hinthorne
 */
class Crosshair {
    constructor() {
        this.x = GAME.mouseX;
        this.y = GAME.mouseY;
        this.isHidden = false;

        /** The starting y position of the spritesheet*/
        this.startY = 0;
    }

    update() {
        this.x = GAME.mouseX;
        this.y = GAME.mouseY;

        if (GAME.mouseDown) {
            this.startY = 16;
        } else {
            this.startY = 0;
        }
    }

    draw() {
        if (!this.isHidden) {
            document.body.style.cursor = 'none';
            CTX.drawImage(
                ASSET_MGR.getAsset(Crosshair.SPRITESHEET),
                0, this.startY,
                Crosshair.WIDTH, Crosshair.HEIGHT,
                this.x - (Crosshair.WIDTH * Crosshair.SCALE) / 2,
                this.y - (Crosshair.HEIGHT * Crosshair.SCALE) / 2,
                Crosshair.WIDTH * Crosshair.SCALE,
                Crosshair.HEIGHT * Crosshair.SCALE);
        } else {
            // document.body.style.cursor = 'default';
            // document.body.style.cursor = url("../sprites/font/vt323/VT323-Regular.ttf.png");
        }
    }

    static get SPRITESHEET() {
        return "./sprites/crosshair.png";
    }

    static get WIDTH() {
        return 16;
    }

    static get HEIGHT() {
        return 16;
    }

    static get SCALE() {
        return 3;
    }
}