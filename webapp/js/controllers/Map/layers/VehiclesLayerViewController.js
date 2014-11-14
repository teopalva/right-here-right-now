/**
 * @class VehiclesLayerViewController
 * @description
 *
 * @constructor
 */
function VehiclesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the vehicles on the screen
     */
    this.vehiclesUpdated = function () {
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
        model.getVehiclesModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function() {
        var vehicles = model.getVehiclesModel().getVehicles();
        vehicles = model.getAreaOfInterestModel().filterObjects(vehicles);

        var canvas = self.getView().getSvg();



        var size = {
            width: model.getVisualizationModel().abandonedVehiclesMarkerIconSize().width,
            height: model.getVisualizationModel().abandonedVehiclesMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(vehicles);

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
                .attr("xlink:href", model.getVisualizationModel().abandonedVehiclesMarkerIconPath())
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
            markers = canvas.selectAll(".marker.point").data(vehicles);
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
                .style("fill", model.getVisualizationModel().abandonedVehiclesMarkerColor())
                .attr("cx", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius())
                .attr("stroke",model.getVisualizationModel().markerStrokeColor())
                .attr("stroke-width",model.getVisualizationModel().markerStrokeWidth());

            // Exit
            markers.exit().remove();
        }

    };

    var init = function () {
        self.getView().addClass("vehicles-layer-view-controller");


        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.vehicles.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.mapController.ZOOM_CHANGED);

        model.getVehiclesModel().startUpdates();
    }();
}

Utils.extend(VehiclesLayerViewController, MapLayerController);