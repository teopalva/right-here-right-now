/***
 * @class CtaTrainLayerViewController
 * @description Layer of CTA trains.
 *
 * @constructor
 */
function CtaTrainLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;

    //////////////////////// PUBLIC METHODS ////////////////////////

    /**
     * Draw stops when new ones are retrieved
     */
    this.stopsChanged = function() {
        draw();
    };

    /**
     *
     */
    this.pathChanged = function() {
        //model.getCtaTrainModel().stopUpdates();
        //model.getCtaTrainModel().retrieveStations();
        //
        //self.stopsChanged();
        draw();
    };

    this.zoomUpdated = function() {
        draw();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        console.log("CTA Train Dispose");

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        //model.getCtaTrainModel().stopUpdates();
        model.getPopupModel().removeAll(Layers.CTA_TRAINS);
        notificationCenter.unsuscribeFromAll(self);
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var draw = function() {
        var stops = model.getCtaTrainModel().getStations();
        console.log("Stations");
        console.log(stops);


        stops = model.getAreaOfInterestModel().filterObjects(stops);

        var canvas = self.getView().getSvg();



        var size = {
            width: model.getVisualizationModel().CTATrainStationIconSize().width,
            height: model.getVisualizationModel().CTATrainStationIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(stops);

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
                .attr("xlink:href", model.getVisualizationModel().CTATrainStationIconPath())
                .attr("x", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x - (size.width / 2);
                })
                .attr("y", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y - size.height;
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(stops);
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
                .style("fill", model.getVisualizationModel().CTATrainStationColor())
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

            // Exit
            markers.exit().remove();
        }
    };


    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.TRAIN_STATIONS,
            layer: Layers.CTA_TRAINS,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            info: d
        });
    };

    var init = function() {
        self.getView().addClass("cta-train-layer-view-controller");

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.TRAIN_STATIONS);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomUpdated, Notifications.mapController.ZOOM_CHANGED);

        // Start all the queries
        model.getCtaTrainModel().retrieveStations();

    } ();

}

Utils.extend(CtaTrainLayerViewController, MapLayerController);
