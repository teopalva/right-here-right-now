/**
 * @class DirectionsLayerViewController
 * @description
 *
 * @constructor
 */
function DirectionsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * This methods handles DIRECTIONS_UPDATED notification
     */
    this.directionsUpdated = function() {
        console.time("Directions updated");
        draw();
        console.timeEnd("Directions updated");
    };


    this.zoomChanged = function() {
        draw();
    };



    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var draw = function() {
        var directions = model.getAreaOfInterestModel().getDirections();
        var canvas = self.getView().getSvg();

        if(directions == null || directions.length == 0) {
            canvas.select(".directions").remove();
        } else {
            var lineFunction = d3.svg.line()
                .x(function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .y(function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .interpolate("linear");

            var directionsLine = canvas.select(".directions");

            if(directionsLine.empty()) {
                directionsLine = canvas.append("path")
                    .classed("directions", true)
                    .attr("stroke", model.getVisualizationModel().directionsStrokeColor())
                    .attr("stroke-width", model.getVisualizationModel().directionsStrokeWidth())
                    .attr("fill", "none");
            }

            directionsLine
                .attr("d", lineFunction(directions));
        }

    };


    var init = function() {
        self.getView().addClass("directions-layer-view-controller");


        notificationCenter.subscribe(self, self.directionsUpdated, Notifications.areaOfInterest.DIRECTIONS_UPDATED);
        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
    } ();
}

Utils.extend(DirectionsLayerViewController, MapLayerController);