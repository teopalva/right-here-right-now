/***
 * @class CtaBusStopsLayerViewController
 * @description Layer of CTA buses stops.
 *
 * @constructor
 */
function CtaBusStopsLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _stopsColor = "#f67a43";

    //////////////////////// PUBLIC METHODS ////////////////////////

    /**
     * Draw stops when new ones are retrieved
     */
    this.stopsChanged = function() {
        draw();
    };

    /**
     * Called when the path is changed.
     */
    this.pathChanged = function() {
        model.getCtaModel().stopUpdates();
        model.getCtaModel().retrieveData();

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
        console.log("CTA Stops Dispose");

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCtaModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var draw = function() {
        var stops = model.getCtaModel().getStops();
        //console.log("Stops");
        //console.log(stops);


        stops = model.getAreaOfInterestModel().filterObjects(stops);

        var canvas = self.getView().getSvg();



        var size = {
            width: model.getVisualizationModel().CTABusStationIconSize().width,
            height: model.getVisualizationModel().CTABusStationIconSize().height
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
                .attr("xlink:href", model.getVisualizationModel().CTABusStationIconPath())
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
                });;


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
                .style("fill", model.getVisualizationModel().CTABusStationColor())
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
            type: PopupsType.BUS_STOPS,
            info: d
        });
    };

    var init = function() {
        self.getView().addClass("cta-stops-layer-view-controller");

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomUpdated, Notifications.mapController.ZOOM_CHANGED);

        // Start all the queries
        model.getCtaModel().retrieveData();

    } ();

}

Utils.extend(CtaBusStopsLayerViewController, MapLayerController);
