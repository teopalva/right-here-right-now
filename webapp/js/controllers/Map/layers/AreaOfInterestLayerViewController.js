/**
 * @class AreaOfInterestLayerViewController
 * @description
 *
 * @constructor
 */
function AreaOfInterestLayerViewController() {
    MapLayerController.call(this);


    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * This methods handles PATH_UPDATED notification
     */
    this.pathChanged = function() {
        console.time("draw boundaries");
        draw();
        console.timeEnd("draw boundaries");
    };

    this.zoomChanged = function() {
        draw();
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var draw = function() {
        var canvas = self.getView().getSvg();

        // Draw boundary
        var boundaries = model.getAreaOfInterestModel().getAreaOfInterest();

        if(boundaries != null) {
            var boundPath = d3.geo.path();
            boundPath.projection(self.d3projection);

            canvas.selectAll("path")
                .data(boundaries.features)
                .attr("d", boundPath)
                .enter().append("path")
                .attr("d", boundPath)
                .style("fill", model.getVisualizationModel().areaOfInterestFillColor())
                .style("stroke", model.getVisualizationModel().areaOfInterestStrokeColor())
                .style("stroke-width", model.getVisualizationModel().areaOfInterestStrokeWidth());

        } else {
            canvas.selectAll("path").remove();
        }
    };


    var init = function() {
        self.getView().addClass("area-of-interest-layer-view-controller");


        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
        self.pathChanged();
    } ();
}

Utils.extend(AreaOfInterestLayerViewController, MapLayerController);