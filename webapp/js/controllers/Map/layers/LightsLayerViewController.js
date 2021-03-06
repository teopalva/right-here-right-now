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

    this.drawNewPoints = function(){
        var points = model.getLightsModel().getLightsWithinArea();
        draw(points);
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
        model.getPopupModel().removeAll(Layers.LIGHTS);
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function(lights) {

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
                    return point.y - (size.height /2);
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
            type: PopupsType.LIGHTS,
            layer: Layers.LIGHTS,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            creation_date: d.creation_date,
            street_address: d.street_address,
            id : d.id,
            number_out : d.number_out
        });
    };

    var init = function () {
        self.getView().addClass("lights-layer-view-controller");

        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.lights.SELECTION_UPDATED);
        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.mapController.ZOOM_CHANGED);

        model.getLightsModel().startUpdates();
    }();
}

Utils.extend(LightsLayerViewController, MapLayerController);