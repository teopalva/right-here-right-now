/**
 * @class UIImageViewController
 * @description
 *
 * @constructor
 */
function UIImageViewController() {
    UIViewController.call(this);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _imgPath = "";
    var _image;

    //////////////////// PUBLIC METHODS ///////////////////////

    this.setImagePath = function(path) {
        _imgPath = path;

        draw();
    };

    //////////////////// PRIVATE METHODS ///////////////////////
    var draw = function() {
        var d3Svg = self.getView().getSvg();

        // Update
        _image = d3Svg.selectAll(".image").data([_imgPath]);
        _image.attr("xlink:href", _imgPath);

        // Enter
        _image.enter()
            .append("image")
            .classed("image", true)
            .attr("xlink:href", _imgPath)
            .attr("width", "100%")
            .attr("height", "100%");
    };

    var init = function() {
        // Add image css class
        self.getView().addClass("ui-image-view-controller");
        self.setImagePath("");
    } ();
}

Utils.extend(UIImageViewController, UIViewController);
