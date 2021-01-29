class BoundingBox {

    SIDE = {
        RIGHT: 0,
        LEFT: 1,
        TOP: 2,
        BOTTOM: 3
    };
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    collide(oth) {

        /* if ((this.left < oth.right) || (this.right > oth.left) || (this.top < oth.bottom) || (this.bottom > oth.top)) return true;
        return false; */
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
            return true;
        } 
        return false;
    };
};