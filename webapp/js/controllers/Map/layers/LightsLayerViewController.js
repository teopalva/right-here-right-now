/**
 * @class LightsLayerViewController
 * @description
 *
 * @constructor
 */
function LightsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the lights on the screen
     */
    this.lightsUpdated = function () {
        draw();
    };

    /**
     * Handler method for ZOOM_CHANGED notification
     */
    this.zoomChanged = function() {
        draw();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getLightsModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function() {
        var lights = model.getLightsModel().getLights();
        lights = model.getAreaOfInterestModel().filterObjects(lights);

        var canvas = self.getView().getSvg();



        var size = {
            width: model.getVisualizationModel().streetLightsMarkerIconSize().width,
            height: model.getVisualizationModel().streetLightsMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(lights);

            // Update
            markers
                .attr("x", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x - (size.width / 2);
                })
                .attr("y", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y - size.height;
                });


            // Enter

            markers.enter()
                .append("image")
                .classed("marker", true)
                .classed("pin", true)
                .attr("xlink:href", model.getVisualizationModel().streetLightsMarkerIconPath())
                .attr("x", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x - (size.width / 2);
                })
                .attr("y", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y - size.height;
                })
                .attr("width", size.width)
                .attr("height", size.height);


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(lights);
            // Update
            markers
                .attr("cx", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                });

            // Enter
            markers.enter()
                .append("circle")
                .classed("marker", true)
                .classed("point", true)
                .style("fill", model.getVisualizationModel().streetLightsMarkerColor())
                .attr("cx", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius());

            // Exit
            markers.exit().remove();
        }

    };

    var init = function () {
        self.getView().addClass("lights-layer-view-controller");


        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.lights.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.mapController.ZOOM_CHANGED);

        model.getLightsModel().startUpdates();
    }();
}

Utils.extend(LightsLayerViewController, MapLayerController);