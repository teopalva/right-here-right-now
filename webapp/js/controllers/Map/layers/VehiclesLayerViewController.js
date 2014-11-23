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

    var _cachedData = [];

    ////////////////////////// PUBLIC METHODS /////////////////////////
    this.drawCachedPoints = function(){
        draw(_cachedData);
    };

    this.drawNewPoints = function(){
        _cachedData = model.getVehiclesModel().getVehicles();
        _cachedData = model.getAreaOfInterestModel().filterObjects(_cachedData);
        draw(_cachedData);
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
        model.getPopupModel().removeAll(Layers.VEHICLES);
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function(vehicles) {

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
                    return point.y - (size.height /2);
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
                    return point.y - (size.height /2);
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;


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
                .attr("stroke-width",model.getVisualizationModel().markerStrokeWidth())
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;

            // Exit
            markers.exit().remove();
        }

    };

    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.VEHICLES,
            layer: Layers.VEHICLES,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            vehicle_color: d.vehicle_color,
            vehicle_make_model: d.vehicle_make_model,
            street_address: d.street_address,
            creation_date: d.creation_date,
            license_plate: d.license_plate,
            most_recent_action: d.most_recent_action,
            id : d.id
        });
    };


    var init = function () {
        self.getView().addClass("vehicles-layer-view-controller");


        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.vehicles.DATA_CHANGED);
        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.drawCachedPoints, Notifications.mapController.ZOOM_CHANGED);

        model.getVehiclesModel().startUpdates();
    }();
}

Utils.extend(VehiclesLayerViewController, MapLayerController);