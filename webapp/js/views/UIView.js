/**
 * @class UIView
 * @description Implements an abstraction of an underline svg element, with methods to manipulate dimensions
 * and styles.
 *
 * @constructor
 */
function UIView() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    var _svg;
    var _eventsLayer;





    //////////////////////// PUBLIC METHODS ////////////////////////
    /**
     * Append the current view to the given d3Element (parent view)
     * @param d3Element
     */
    this.appendTo = function(d3Element) {
        $(d3Element.node()).append(function(){return _svg.node()});
    };

    /**
     * Add a subview to the currentView
     * @param subview (UIView)
     */
    this.add = function(subview) {
        _svg.node().appendChild(subview.getSvg().node());
    };

    /**
     * Remove subview
     * @param subview
     */
    this.remove = function(subview) {
        try {
            _svg.node().removeChild(subview.getSvg().node());
        } catch (error) {
            // console.log("No such a child");
        }
    };

    /**
     * Return the underline svg d3 selection
     * @returns {svg}
     */
    this.getSvg = function() {
        return _svg;
    };

    /**
     * Set the preserveAspectRatio attribute of the svg
     * @param options {String}
     */
    this.setAspectRatioOptions = function(options) {
        _svg.attr("preserveAspectRatio", options);
    };

    /**
     * Add a CSS class to the view
     * @param className
     */
    this.addClass = function(className) {
        _svg.classed(className, true);
    };

    /**
     * Return true if the view has className class
     * @param className
     * @returns {boolean}
     */
    this.hasClass = function(className) {
        return _svg.classed(className);
    };

    /**
     * Remove a CSS class from the view
     * @param className
     */
    this.removeClass = function(className) {
        _svg.classed(className, false);
    };

    /**
     * Return a viewBox object
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    this.getViewBox = function() {
        return {
            x: self.getViewBoxX(),
            y: self.getViewBoxY(),
            width: self.getViewBoxWidth(),
            height: self.getViewBoxHeight()
        };
    };

    /**
     * Returns viewBox x position
     * @returns {number}
     */
    this.getViewBoxX = function() {
        var viewBox = _svg.attr("viewBox");
        return viewBox != null ? viewBox.split(/\s+|,/)[0] : null;
    };

    /**
     * Returns viewBox y position
     * @returns {number}
     */
    this.getViewBoxY = function() {
        var viewBox = _svg.attr("viewBox");
        return viewBox != null ? viewBox.split(/\s+|,/)[1] : null;
    };

    /**
     * Return viewBox height
     * @returns {number}
     */
    this.getViewBoxHeight = function() {
        var viewBox = _svg.attr("viewBox");
        return viewBox != null ? viewBox.split(/\s+|,/)[3] : null;
    };

    /**
     * Return viewBox width
     * @returns {number}
     */
    this.getViewBoxWidth = function() {
        var viewBox = _svg.attr("viewBox");
        return viewBox != null ? viewBox.split(/\s+|,/)[2] : null;
    };

    /**
     * Return a frame object
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    this.getFrame = function() {
        return {
            x: self.getFrameX(),
            y: self.getFrameY(),
            width: self.getFrameWidth(),
            height: self.getFrameHeight()
        };
    };

    /**
     * Return the x frame position (position of the svg within its parent)
     * @returns {number}
     */
    this.getFrameX = function() {
        var x = _svg.attr("x");
        x = x != null ? x : 0;
        return x;
    };

    /**
     * Return the x frame position (position of the svg within its parent)
     * @returns {number}
     */
    this.getFrameY = function() {
        var y = _svg.attr("y");
        y = y != null ? y : 0;
        return y;
    };

    /**
     * Return frame width (which is the svg element width)
     * @returns {number}
     */
    this.getFrameWidth = function() {
        var width = _svg.attr("width");
        width = width != null ? width : 0;
        return width;
    };

    /**
     * Return frame height (which is the svg element height)
     * @returns {number}
     */
    this.getFrameHeight = function() {
        var height = _svg.attr("height");
        height = height != null ? height : 0;
        return height;
    };

    /**
     * Set the view viewBox
     * @param x
     * @param y
     * @param width
     * @param height
     */
    this.setViewBox = function(x, y, width, height) {
        _svg.attr("viewBox", x + " " + y + " " + width + " " + height);
    };

    /**
     * Set the view position and size in parent coordinates
     * @param x
     * @param y
     * @param width
     * @param height
     */
    this.setFrame = function(x, y, width, height) {
        _svg.attr("x", x);
        _svg.attr("y", y);
        _svg.attr("width", width);
        _svg.attr("height", height);
    };

    /**
     * Set frame position for the UIView
     * @param x
     * @param y
     */
    this.setFramePosition = function(x, y) {
        _svg.attr("x", x);
        _svg.attr("y", y);
    };

    /**
     * Set the frame size for the UIView
     * @param width
     * @param height
     */
    this.setFrameSize = function(width, height) {
        _svg.attr("width", width);
        _svg.attr("height", height);
    };

    /**
     *
     */
    this.bringToFront = function() {
        self.getSvg().each(function(){
            this.parentNode.appendChild(this);
        });
    };

    /**
     *
     */
    this.hide = function() {
        self.getSvg().style("opacity", 0);
    };

    /**
     *
     */
    this.show = function() {
        self.getSvg().style("opacity", 1);
    };


    // Event handling
    /**
     * Shorthand to set a call back function to the view click event
     * @param callBack
     */
    this.onClick = function(callBack) {
        this.on("click", callBack);
    };

    /**
     * Attach events' callback to the view
     * @param event
     * @param callBack
     * @param params
     */
    this.on = function(event, callBack, /**params=0*/params) {
        _eventsLayer.on(event, function(){
            d3.event.stopPropagation();
            callBack(params);});
        _svg.style("pointer-events", "visiblePainted");
    };

    /**
     * Set the UIView background color
     * @param color
     */
    this.setBackgroundColor = function(color) {
        _eventsLayer.style("fill", color);
    };



    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        _svg= d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        _svg.classed("ui-view", true);
        _svg.style("pointer-events", "none");

        _svg
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1);

        // Adding background
        _eventsLayer = _svg.append("rect")
            .classed("background", true)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%");

        self.setAspectRatioOptions("xMinYMin meet");
    } ();
}