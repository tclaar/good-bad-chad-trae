/** A Block is the building block of our world. A block cannot be passed through by any entity. 
 * Only certain types of blocks can be broken through.
 */
class Block {
    /**
     * 
     * @param {number} blockX The x coordinate (IN THE BLOCKGRID) at which you want the block placed.
     * @param {number} blockY The x y coordinate (IN THE BLOCKGRID) at which you want the block placed.
     * @param {number} type The type of block you want. Block.GRASS, DIRT, SNOWY_ICE, ICE, SNOWY_DIRT, SNOW, LAVA_ROCK.
     * @param {boolean} needsBB Is there any reason that this Block should need a bounding box? Default: true.
     */
    constructor(blockX, blockY, type, needsBB = true) {
        /** The x position of the Block (in the game world). */
        this.x = blockX * Block.SCALED_SIZE;
        /** The y position of the Block (in the game world). */
        this.y = blockY * Block.SCALED_SIZE;
        /** The type of block. Block.GRASS, DIRT, SNOWY_ICE, ICE, SNOWY_DIRT, SNOW, LAVA_ROCK. */
        this.type = type;
        /** An associative array of the animations for this Block. Arranged [facing][action]. */
        this.animator = new Animator(
            Block.SPRITESHEET,
            0, this.type * Block.SIZE, // "type" is also the number of sprites above it on the spritesheet!
            Block.SIZE, Block.SIZE,
            1, 1);
        /** Used to check for collisions with other applicable entities. */
        this.boundingBox = needsBB ? new BoundingBox(this.x, this.y, Block.SCALED_SIZE, Block.SCALED_SIZE) : undefined;
    };

    // TYPES:

    static get GRASS() {
        return 0;
    };

    static get DIRT() {
        return 1;
    };

    static get SNOWY_ICE() {
        return 2;
    };

    static get ICE() {
        return 3;
    };

    static get SNOWY_DIRT() {
        return 4;
    };

    static get SNOW() {
        return 5;
    };

    static get LAVA_ROCK() {
        return 6;
    };

    /** How much bigger should the sprite be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 2;
    };

    static get SIZE() {
        return 32;
    };

    static get SCALED_SIZE() {
        return Block.SCALE * Block.SIZE;
    };

    /** The filepath to the spritesheet of the Block. */
    static get SPRITESHEET() {
        return "./sprites/blocks.png";
    };
    
    /** Change what the entity is doing and where it is. */
    update() {
        
    };

    /** Draw the entity on the canvas. */
    draw() {
        this.animator.drawFrame(this.x - CAMERA.x, this.y - CAMERA.y, Block.SCALE);
    };
};