class HitBox{

    constructor(entity, width, height, ignore = false, offsetx = 0, offsety = 0) {
        Object.assign(this, { entity, width, height, ignore, offsetx, offsety });

        this.x = this.entity.positionx + this.offsetx;
        this.y = this.entity.positiony + this.ffsety;

        this.left = this.x;
        this.top = this.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    collide(other) {

        var intersects = false;

        //horizontal test
        this.left = this.x + this.entity.velocity.x;
        this.top = this.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        if (this.intersects(other)) {
            if (!this.ignore && !other.ignore) {
                this.entity.velocity.x = 0;
            }
            intersects = true;
        }

        //vertical test
        this.left = this.x;
        this.top = this.y + this.entity.velocity.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;   
        if (this.intersects(other)) {
            if (!this.ignore && !other.ignore) {
                this.entity.velocity.y = 0;
            }
            
            intersects = true;
        }

        return intersects;

    }

    playerBooleanCollide(oth) {
        var offset = 2;
        let var1 = ("this.top: " + (Math.floor(this.top) - offset) + "<" + " oth.bottom: " + (Math.ceil(oth.bottom) + offset));
        let var2 = ("this.bottom: " + (Math.ceil(this.bottom) + offset) + ">" + " oth.top: " + (Math.floor(oth.top) - offset));
        if ((Math.ceil(this.right) + offset) >= (Math.floor(oth.left) - offset) && (Math.floor(this.left) - offset) <= (Math.ceil(oth.right) + offset)
         && (Math.floor(this.top) - offset) < (Math.ceil(oth.bottom) + offset) && (Math.ceil(this.bottom) + offset) > (Math.floor(oth.top) - offset)) return true;
        return false;
            
    }

    intersects(other) {
        //not (not intersecting)
        return !(this.right <= other.left || this.left >= other.right ||
            this.bottom <= other.top || this.top >= other.bottom);
    }

    update() {
        this.x = this.entity.positionx + this.offsetx;
        this.y = this.entity.positiony + this.offsety;

        this.left = this.x;
        this.top = this.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }       

    draw(ctx) {
        ctx.strokeStyle = this.ignore ? 'Orange' : 'Red';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
};