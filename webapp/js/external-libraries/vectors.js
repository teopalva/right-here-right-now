/*
 Common vector operations
 Author: Tudor Nita | cgrats.com
 Version: 0.51

 */

function vec2(x_,y_){
    return new Vec2(x_,y_);
}

function Vec2(x_,y_)
{
    this.x = x_;
    this.y = y_;

    /* vector * scalar */
    this.mulS = function (value){ return new Vec2(this.x*value, this.y*value); }
    /* vector * vector */
    this.mulV = function(vec_) { return new Vec2(this.x * vec_.x, this.y * vec_.y); }
    /* vector / scalar */
    this.divS = function(value) { return new Vec2(this.x/value,this.y/value); }
    /* vector + scalar */
    this.addS = function(value) { return new Vec2(this.x+value,this.y+value); }
    /* vector + vector */
    this.addV = function(vec_) { return new Vec2(this.x+vec_.x,this.y+vec_.y); }
    /* vector - scalar */
    this.subS = function(value) { return new Vec2(this.x-value, this.y-value); }
    /* vector - vector */
    this.subV = function(vec_) { return new Vec2(this.x-vec_.x,this.y-vec_.y); }
    /* vector absolute */
    this.abs = function() { return new Vec2(Math.abs(this.x),Math.abs(this.y)); }
    /* dot product */
    this.dot = function(vec_) { return (this.x*vec_.x+this.y*vec_.y); }

    this.clone = function() {return new Vec2(this.x, this.y);}

    this.perpendicular = function() {return new Vec2(this.y, -this.x);}

    this.cross = function(vec_) { return (this.x*vec_.y-this.y*vec_.x); }

    /* vector length */
    this.length = function() { return Math.sqrt(this.dot(this)); }
    /* vector length, squared */
    this.lengthSqr = function() { return this.dot(this); }
    /*
     vector linear interpolation
     interpolate between two vectors.
     value should be in 0.0f - 1.0f space
     */
    this.lerp = function(vec_, value) {
        return new Vec2(
            this.x+(vec_.x-this.x)*value,
            this.y+(vec_.y-this.y)*value
        );
    }
    /* normalize THIS vector */
    this.normalize = function() {
        var vlen = this.length();
        this.x = this.x/ vlen;
        this.y = this.y/ vlen;
        return this;
    }

    this.invert = function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    this.rot = function(angle) {
        var x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        var y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = x;
        this.y = y;
        return this;
    }

    this.getAngle = function() {
        return Math.atan2(this.y, this.x);
    }

    this.angleBetween = function(v) {
        var dot = this.dot(v);
        var det = this.x * v.y - this.y * v.x;
        var angle = Math.atan2(det, dot);
        if(angle > 0)
            return angle;
        else return 2*Math.PI + angle;
    }

    this.toArray = function() {
        return [this.x,this.y];
    }

    /**
     * the two vectors bust be normalized
     * return the bisect vector
     */
    this.bisect = function(v) {
        var sum = this.addV(v);
        var ret = null;
        if(sum.x == 0 && sum.y == 0){
            ret =  this.perpendicular().invert();
        } else {
            ret = sum.normalize();
        }

        if(this.x * v.y - v.x * this.y < 0){
            ret.invert();
        }

        return ret;

        /* NOT EFFICIENT CODE
         var angle = this.angleBetween(v);
         return this.clone().rot(angle/2);
         */
    }



}