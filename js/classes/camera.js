/** 
 * The Camera is going to be updated according to the wizard's position, doing its best to keep
 * the wizard in the center of the camera while respecting the boundaries of the map.
 * The Camera itself is not an entity, but it IS going to be updated after the rest of them.
 * @author Devin Peevy 
 */
class Camera {
    constructor () {
        this.pos = new Vector(0, 0);
    };

    /** The width (in pixels) of the Camera's visible domain. */
    static get WIDTH() {
        return 1920;
    };

    /** The height (in pixels) of the Camera's visible domain. */
    static get HEIGHT() {
        return 1080;
    };

    /**
     * This is going to update the x and y values according to Chad's position.
     */
    update() {
        // We want the camera to not go off the screen, but focus on chad in the direct center where possible.
        // Therefore:
        const median = (x, y, z) => {
            // TODO: not important but there's definitely a better way to do this.
            if ((x >= y && x <= z) || (x <= y && x >= z)) {
                return x;
            }
            if ((y >= x && y <= z) || (y <= x && y >= z)) {
                return y;
            }
            return z;
        };
        const x = median(DIMENSION.MIN_X, DIMENSION.MAX_X - Camera.WIDTH, CHAD.pos.x - Camera.WIDTH / 2);
        const y = median(DIMENSION.MIN_Y, DIMENSION.MAX_Y - Camera.HEIGHT, CHAD.pos.y - Camera.HEIGHT / 2);
        this.pos = new Vector(x, y);
    };
};