/** Creates an alias for requestAnimationFrame for backwards compatibility. */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/* This fixes the bug where the window scrolls down when you press space. */
window.onkeydown = (e) => {
    return e.code !== "Space";
};

/** An object containing all the relevant colors we are using in this project. */
const COLORS = {
    SEA_FOAM_GREEN: "#a0d6b4",
    SKY_BLUE: "#5da6b3"
};

/** This is going to be set for each zone. A rectangle drawn over the whole canvas, first thing. */
let BG_COLOR = null;

// Physics utlities

/**
 * Physics constants
 * 
 * --Units--
 * Position: pixels
 * Velocity: pixels/second
 * Acceleration: pixels/second^2
 */
const PHYSICS = {
    GRAVITY_ACC : 900,
    TERMINAL_VELOCITY : 200 // currently only being applied to projectiles
};

const FONT = {
    VT323_HEADER: "50px vt323",
    VT323_NORMAL: "34px vt323"
};

/**
 * The game's sound effects.
 */
const SFX = {
    JUMP1: {path: "./sfx/jump1.mp3", volume: 0.2},
    JUMP2: {path: "./sfx/jump2.mp3", volume: 0.2},
    SLINGSHOT_LAUNCH1: {path: "./sfx/launch1.mp3", volume: 0.5},
    SLINGSHOT_LAUNCH2: {path: "./sfx/launch2.mp3", volume: 0.6},
    SLINGSHOT_LAUNCH3: {path: "./sfx/launch3.mp3", volume: 0.5},
    SLINGSHOT_LAUNCH4: {path: "./sfx/launch4.mp3", volume: 0.5},
    SLINGSHOT_STRETCH: {path: "./sfx/slingshot_stretch.mp3", volume: 0.4},
    SONIC_DASH: {path: "./sfx/sonic_dash.mp3", volume: 0.2}
}

/**
 * The game's music.
 */
const MUSIC = {
    STARTING_OFF: {path: "./music/starting_off.mp3", volume: 0.1},
    PEACEFUL_CHIPTUNE: {path: "./music/peaceful_chiptune.mp3", volume: 0.1},
}

/**
 * Check if the provided entity is colliding with any blocks and correct its position if so.
 * 
 * @param {Entity} entity the entity for which to check block collision
 * @returns {Object} an object indicating which side(s) of a block the entity collided with
 */
const checkBlockCollisions = (entity) => {
    const collisions = {};
    // Have we collided with anything?
    GAME.entities.midground.forEach((otherEntity) => {
        // Does otherEntity even have a BB?
        if (otherEntity != entity && otherEntity.boundingBox) {
            
            // Are they even colliding?
            if (entity.boundingBox.collide(otherEntity.boundingBox)) {
                if (otherEntity instanceof Block) {

                    // Is there overlap with the block on the x or y-axes?
                    const isOverlapX = entity.lastBoundingBox.left < otherEntity.boundingBox.right
                        && entity.lastBoundingBox.right > otherEntity.boundingBox.left;
                    const isOverlapY = entity.lastBoundingBox.bottom > otherEntity.boundingBox.top
                        && entity.lastBoundingBox.top < otherEntity.boundingBox.bottom;

                    if (isOverlapX
                        && entity.lastBoundingBox.bottom <= otherEntity.boundingBox.top
                        && entity.boundingBox.bottom > otherEntity.boundingBox.top) {
                        // We are colliding with the top.
                        
                        collisions.top = true;

                        // NOTE: entity.constructor returns an instance's class. There may be a better way to do this.
                        entity.pos = new Vector(entity.pos.x, otherEntity.boundingBox.top - entity.constructor.SCALED_SIZE.y);
                        entity.yVelocity = 0;
                    } else if (isOverlapY
                        && entity.lastBoundingBox.right <= otherEntity.boundingBox.left
                        && entity.boundingBox.right > otherEntity.boundingBox.left) {
                        // We are colliding with the left side.

                        collisions.left = true;

                        entity.pos = new Vector(otherEntity.boundingBox.left - entity.constructor.SCALED_SIZE.x, entity.pos.y);
                    } else if (isOverlapY
                        && entity.lastBoundingBox.left >= otherEntity.boundingBox.right
                        && entity.boundingBox.left < otherEntity.boundingBox.right) {
                        // We are colliding with the right side.

                        collisions.right = true;

                        entity.pos = new Vector(otherEntity.boundingBox.right, entity.pos.y);
                    } else if (isOverlapX
                        && entity.lastBoundingBox.top >= otherEntity.boundingBox.bottom
                        && entity.boundingBox.top < otherEntity.boundingBox.bottom) {
                        // We are colliding with the bottom.

                        collisions.bottom = true;

                        entity.pos = new Vector(entity.pos.x, otherEntity.boundingBox.bottom);
                    }
                }
            }
            // There's no collision - don't do anything!
        }
        // There's no bounding box, so who gives a shrek?
    });

    // Now that your position is actually figured out, draw your correct bounding box.
    entity.boundingBox = new BoundingBox(entity.pos, entity.constructor.SCALED_SIZE);

    return collisions;
};

// The following is necessary because we must change the listeners for different modes (right now, gameplay and dialog).
/** Contains all functions called as event handlers. */
const EVENT_HANDLERS = {
    gameplayMouseDown: (e) => {
        GAME.user.firing = false;
        GAME.user.aiming = true;
    },
    gameplayMouseUp: (e) => {
        GAME.user.aiming = false;
        GAME.user.firing = true;
    },
    gameplayMouseMove: (e) => {
        const rect = CANVAS.getBoundingClientRect();
        const scaleX = CANVAS.width / rect.width;
        const scaleY = CANVAS.height / rect.height;
        GAME.mousePos = new Vector((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    },
    gameplayKeyDown: (e) => {
        switch (e.code) {
            case "KeyA":
                GAME.user.movingLeft = true;
                break;
            case "KeyD":
                GAME.user.movingRight = true;
                break;
            case "KeyS":
                GAME.user.movingDown = true;
                break;
            case "KeyW":
                GAME.user.movingUp = true;
                GAME.user.interacting = true;
                break;
            case "Space":
                GAME.user.jumping = true;
                break;
            case "ShiftLeft":
                GAME.user.sprinting = true;
                break;
            case "KeyX":
                GAME.user.dashing = true;
                break;
            case "KeyQ":
                GAME.user.jabbing = true;
                break;
        }
    },
    gameplayKeyUp: (e) => {
        switch (e.code) {
            case "KeyA":
                GAME.user.movingLeft = false;
                break;
            case "KeyD":
                GAME.user.movingRight = false;
                break;
            case "KeyS":
                GAME.user.movingDown = false;
                break;
            case "KeyW":
                GAME.user.movingUp = false;
                GAME.user.interacting = false;
                break;
            case "Space":
                GAME.user.jumping = false;
                break;
            case "ShiftLeft":
                GAME.user.sprinting = false;
                break;
            case "KeyX":
                GAME.user.dashing = false;
                break;
            case "KeyQ":
                GAME.user.jabbing = false;
                break;
        }
    },
    dialogKeyPress: (e) => {
        switch (e.code) {
            case "KeyS":
                GAME.user.choiceDown = true;
                break;
            case "KeyW":
                GAME.user.choiceUp = true;
                break;
        }
    },
    // KeyPress does not wanna work for spacebar. Oh well.
    dialogKeyDown: (e) => {
        switch (e.code) {
            case "Space":
                GAME.user.continuingConversation = true;
        }
    },
    dialogKeyUp: (e) => {
        switch (e.code) {
            case "Space":
                GAME.user.continuingConversation = false;
        }
    }
};