/**
 * @class UILabelViewController
 * @description
 *
 * @constructor
 */
function UILabelViewController() {
    UIViewController.call(this);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _d3Text;

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     *
     * @param text
     */
    this.setText = function (text) {
        _d3Text.text(text);
    };

    this.getText = function () {
        return _d3Text;
    };

    this.setTextAlignment = function (alignment) {
        switch (alignment) {
        case TextAlignment.LEFT:
            _d3Text
                .attr("x", "0")
                .attr("y", "50%")
                .attr("dy", "0.4em")
                .attr("text-anchor", "start");
            break;
        case TextAlignment.MIDDLE:
            _d3Text
                .attr("x", "50%")
                .attr("y", "50%")
                .attr("dy", "0.4em")
                .attr("text-anchor", "middle");
            break;
        case TextAlignment.RIGHT:
            _d3Text
                .attr("x", "100%")
                .attr("y", "50%")
                .attr("dy", "0.4em")
                .attr("text-anchor", "end");
            break;
        }
    };

    /**
     * Set UILabel text color
     * @param color
     */
    this.setTextColor = function (color) {
        /*
         var d3Svg = self.getView().getSvg();
         var textEl = d3Svg.select(".text");
         textEl.style("fill", color);
         */
        _d3Text.style("fill", color);
    };

    /**
     * Set UILabel font size
     * @param fontSize
     */
    this.setTextSize = function (fontSize) {
        /*
         var d3Svg = self.getView().getSvg();
         var textEl = d3Svg.select(".text");
         textEl.style("font-size", fontSize);*/
        _d3Text.style("font-size", fontSize);
    };

    /**
     *
     * @param weight
     */
    this.setFontWeight = function(weight) {
        _d3Text.style("font-weight", weight);
    };

    //////////////////// PRIVATE METHODS ///////////////////////
    var init = function () {
        // Add button css class
        self.getView().addClass("ui-label-view-controller");

        _d3Text = self.getView().getSvg().append("text");
        _d3Text.classed("text", true);

        self.setTextAlignment(TextAlignment.MIDDLE);
    }();
}

Utils.extend(UILabelViewController, UIViewController);


var TextAlignment = {
    LEFT: "left",
    MIDDLE: "middle",
    RIGHT: "right"
};