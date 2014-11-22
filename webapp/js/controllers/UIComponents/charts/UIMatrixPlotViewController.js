/**
 * @class UIMatrixPlotViewController
 * @description
 *
 * @constructor
 */
function UIMatrixPlotViewController() {
    UIViewController.call(this);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Holds data in d3 format
    var _colorMatrix = [];

    var _dimension = 10;


    var _delegate = null;



    /////////////////////// PUBLIC ATTRIBUTES ///////////////////////
    /**
     * Returns object delegate
     * @param delegate
     */
    this.setDelegate = function(delegate) {
        _delegate = delegate;
    };

    this.setDimension = function(dimension) {
        _dimension = dimension;
    };

    /**
     * Set the color matrix of the plot
     * @param colorMatrix
     */
    this.setColorMatrix = function(colorMatrix) {
        _colorMatrix = colorMatrix;
        draw();
    };

    /**
     * @protocol UIView
     */
    this.viewBoxDidChange = function() {
        draw();
    };

    /**
     * @protocol UIView
     */
    this.frameDidChange = function() {
        draw();
    };

    /////////////////////// PRIVATE METHODS ///////////////////////
    var draw = function() {
        var box = self.getView().getFrame();
        var canvas = self.getView().getSvg();

        var size = {
            width: box.width,
            height: box.height
        };

        var squareSize = {
            height: size.height / _dimension,
            width: size.width / _dimension
        };

        var squares = canvas.selectAll(".square rect").data(_colorMatrix);

        squares
            .style("fill", function(d) {
                return d;
            });

        // Enter
        squares
            .enter()
            .append("g")
            .classed("square", true)
            .attr("transform", function(d, i) {
                var row = Math.floor(i / _dimension);
                var col = Math.floor(i % _dimension);
                var x = squareSize.width * col;
                var y = squareSize.height * row;
                return "translate(" + x + ", " + y + ")";
            })
            .append("rect")
            .style("fill", function(d) {
                return d;
            })
            //.style("stroke", "#000")
            //.style("stroke-width", "0.1")
            .attr("width", squareSize.width)
            .attr("height", squareSize.height);

        // exit
        squares.exit().remove();
    };

    // Init
    var init = function() {
        self.getView().addClass("ui-matrix-plot-view-controller");

        self.getView().setDelegate(self);
    } ();
}

Utils.extend(UIMatrixPlotViewController, UIViewController);