/**
 * @class DivvyBikesLayerViewController
 * @description
 *
 * @constructor
 */
function DivvyBikesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _cachedData = [];

    ////////////////////////// PUBLIC METHODS /////////////////////////
    this.drawCachedPoints = function(){
        draw(_cachedData);
    };

    this.drawNewPoints = function(){
        _cachedData = model.getDivvyBikesModel().getDivvyBikes();
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
        model.getDivvyBikesModel().stopUpdates();
        model.getPopupModel().removeAll(Layers.DIVVY_BIKES);
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function(divvyBikes) {

        var canvas = self.getView().getSvg();

        var size = {
            width: model.getVisualizationModel().divvyMarkerIconSize().width,
            height: model.getVisualizationModel().divvyMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(divvyBikes);

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
                .attr("xlink:href", model.getVisualizationModel().divvyMarkerIconPath())
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
                });
            ;


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(divvyBikes);
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
                .style("fill", model.getVisualizationModel().divvyMarkerColor())
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
                });
            ;

            // Exit
            markers.exit().remove();
        }

    };


    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.DIVVY_BIKES,
            layer: Layers.DIVVY_BIKES,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            last_update: model.getDivvyBikesModel().getLastUpdate(),
            location: d.location,
            id : d.id,
            availableDocks: d.availableDocks,
            availableBikes: d.availableBikes,
            stationName: d.stationName,
            statusValue: d.statusValue,
            totalDocks: d.totalDocks
        });
    };

    var init = function () {
        self.getView().addClass("divvyBikes-layer-view-controller");

        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.divvyBikes.DATA_CHANGED);
        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.drawCachedPoints, Notifications.mapController.ZOOM_CHANGED);

        model.getDivvyBikesModel().startUpdates();
    }();
}

Utils.extend(DivvyBikesLayerViewController, MapLayerController);