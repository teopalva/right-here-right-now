/**
 * @class AreaOfInterestViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function AreaOfInterestViewController(parentController) {
    MapLayerController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.showAreaOfInterest = function () {
        draw();
        self.getView().show();
    };

    this.hideAreaOfInterest = function () {
        self.getView().hide();
    };

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var draw = function () {
        //var feature = model.getAreaOfInterestModel().getCAs();
        var feature = model.getAreaOfInterestModel().getSelectedFeature();
        var datum = [];
        datum.push(feature);
        var projection = self.d3projection;

        // Create a path generator
        var path = d3.geo.path()
            .projection(projection);
        
        // Paths
        self.getView().getSvg().append("g").selectAll("path")
            .data(datum)
            .enter()
            .append("path")
            .attr("d", path)
            .classed("area-of-interest", true)
            .style("fill", "rgba(0,0,0,0)")
            .style("stroke", "rgba(35, 84, 204, 1.0)")
            .style("stroke-width", "0.5")

    };

    var init = function () {
        self.getView().addClass("selected-area-layer-view-controller");

        notificationCenter.subscribe(self, self.showAreaOfInterest, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.hideAreaOfInterest, Notifications.areaOfInterest.PATH_CLEANED);

    }();

}

Utils.extend(AreaOfInterestViewController, MapLayerController);