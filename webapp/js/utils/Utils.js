/**
 *
 * @type {Utils|*|{}}
 */
var Utils = Utils || {} ;
Utils.extend = function (superclass, base) {
    // Avoid instantiating the base class just to setup inheritance
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // for a polyfill
    // Also, do a recursive merge of two prototypes, so we don't overwrite
    // the existing prototype, but still maintain the inheritance chain
    // Thanks to @ccnokes
    var origProto = superclass.prototype;
    superclass.prototype = Object.create(base.prototype);
    for (var key in origProto)  {
        superclass.prototype[key] = origProto[key];
    }
    // Remember the constructor property was set wrong, let's fix it
    superclass.prototype.constructor = superclass;
    // In ECMAScript5+ (all modern browsers), you can make the constructor property
    // non-enumerable if you define it like superclass instead
    Object.defineProperty(superclass.prototype, 'constructor', {
        enumerable: false,
        value: superclass
    });
};

/**
 * Hash a sring
 * @returns {number}
 */
String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};