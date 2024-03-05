class MamaChad {
    /**
     * @param {Vector} pos the position at which he should spawn. 
     * @param {Conversation} convo The conversation that will show if PapaChad is interacted with.
     */
    constructor(pos, convo = null) {
        /** The position of the Papa Chad (in the game world). */
        this.pos = pos;
        /** The velocity at which PapaChad is moving. */
        this.velocity = new Vector(0, 0);

        /** An associative array of the animations for this Papa Chad. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();
        /** What way is the Papa Chad looking? */
        this.facing = "right";
        /** What is the Papa Chad doing? */
        this.action = "trapped";
        /** Used to check for collisions with other applicable entities. */
        this.boundingBox = new BoundingBox(this.pos, PapaChad.SCALED_SIZE);
        /** Used to check how to deal with collisions with other applicable entities. */
        this.lastBoundingBox = this.boundingBox;
        /** The conversation which will be displayed upon interacting with Papa Chad. */
        this.conversation = convo;
    };

    /** The size, in pixels of the sprite ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(32, 64);
    }

    /** How much bigger should the sprite be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 2.8;
    };

    /** This will be the size of Papa Chad ON THE CANVAS. */
    static get SCALED_SIZE() {
        return PapaChad.SCALED_SIZE
    }

    /** The filepath to Papa Chad's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/blacksmith.png";
    };

    /** Change what Papa Chad is doing and where it is. */
    update() {
        if (this.action === 'trapped') return;
        // Set the velocity, according to gravity.
        this.velocity = {
            x: this.velocity.x,
            y: this.velocity.y += PHYSICS.GRAVITY_ACC * GAME.clockTick
        };

        this.lastBoundingBox = this.boundingBox;

        this.pos = {
            x: this.pos.x,
            y: this.pos.y + this.velocity.y * GAME.clockTick
        };

        this.boundingBox = new BoundingBox(this.pos, PapaChad.SCALED_SIZE);


        // Step 4: Have we collided with anything?
        GAME.entities.midground.forEach((entity) => {
            // Does entity even have a BB?
            if (entity.boundingBox) {
                // Are they even colliding?
                if (this.boundingBox.collide(entity.boundingBox)) {
                    if (entity instanceof Block) {

                        // Is there overlap with the block on the x or y-axes?
                        const isOverlapX = this.lastBoundingBox.left < entity.boundingBox.right
                            && this.lastBoundingBox.right > entity.boundingBox.left;
                        const isOverlapY = this.lastBoundingBox.bottom > entity.boundingBox.top
                            && this.lastBoundingBox.top < entity.boundingBox.bottom;

                        if (isOverlapX
                            && this.lastBoundingBox.bottom <= entity.boundingBox.top
                            && this.boundingBox.bottom > entity.boundingBox.top) {
                            // We are colliding with the top.

                            this.pos = new Vector(this.pos.x, entity.boundingBox.top - PapaChad.SCALED_SIZE.y);
                            this.velocity = new Vector(this.velocity.x, 0);
                        } else if (isOverlapY
                            && this.lastBoundingBox.right <= entity.boundingBox.left
                            && this.boundingBox.right > entity.boundingBox.left) {
                            // We are colliding with the left side.

                            this.pos = new Vector(entity.boundingBox.left - PapaChad.SCALED_SIZE.x, this.pos.y);
                        } else if (isOverlapY
                            && this.lastBoundingBox.left >= entity.boundingBox.right
                            && this.boundingBox.left < entity.boundingBox.right) {
                            // We are colliding with the right side.

                            this.pos = new Vector(entity.boundingBox.right, this.pos.y);
                        } else if (isOverlapX
                            && this.lastBoundingBox.top >= entity.boundingBox.bottom
                            && this.boundingBox.top < entity.boundingBox.bottom) {
                            // We are colliding with the bottom.
                            this.pos = new Vector(this.pos.x, entity.boundingBox.bottom);
                        }
                    }
                }
                // There's no collision - don't do anything!
            }
            // There's no bounding box, so who gives a shrek?
        });
        // Step 5: Now that your position is actually figured out, draw your correct bounding box.
        this.boundingBox = new BoundingBox(this.pos, PapaChad.SCALED_SIZE);
    };

    /** Draw Papa Chad on the canvas. */
    draw() {
        this.animations[this.facing][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), PapaChad.SCALE);
        if (this.conversation && this.conversation.new) {
            const indicator = new OverheadIcon(this, PapaChad.SCALED_SIZE.x, OverheadIcon.TRIANGLE, OverheadIcon.GREEN);
            indicator.draw();
        }
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["right"] = [];

        this.animations["right"]["idle"] = new Animator(
            PapaChad.SPRITESHEET,
            new Vector(0, PapaChad.SIZE.y * 2),
            PapaChad.SIZE,
            1, 1);
        this.animations["right"]["trapped"] = new Animator(
            './sprites/mama_chad_trapped.png',
            new Vector(0, 0),
            new Vector(42, 62),
            4, 1 / 3);

    };

};
