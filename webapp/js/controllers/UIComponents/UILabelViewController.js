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

    //////////////////// PUBLIC METHODS ///////////////////////

    /**
     *
     * @param text
     */
    this.setText = function(text) {
        var d3Svg = self.getView().getSvg();

        // Update
        var textEl = d3Svg.selectAll(".text").data([text]);
        textEl.text(text);

        // Enter
        textEl.enter()
            .append("text")
            .classed("text", true)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("dy", "0.4em")
            .attr("text-anchor", "middle")
            .text(text);
    };

    /**
     * Set UILabel text color
     * @param color
     */
    this.setTextColor = function(color) {
        var d3Svg = self.getView().getSvg();
        var textEl = d3Svg.select(".text");
        textEl.style("fill", color);
    };

    /**
     * Set UILabel font size
     * @param fontSize
     */
    this.setTextSize = function(fontSize) {
        var d3Svg = self.getView().getSvg();
        var textEl = d3Svg.select(".text");
        textEl.style("font-size", fontSize);
    };

    //////////////////// PRIVATE METHODS ///////////////////////
    var init = function() {
        // Add button css class
        self.getView().addClass("ui-label-view-controller");
    } ();
}

Utils.extend(UILabelViewController, UIViewController);