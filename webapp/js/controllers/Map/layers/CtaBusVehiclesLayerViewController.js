/***
 * @class CtaBusVehiclesLayerViewController
 * @description Layer of CTA buses lines and stops.
 *
 * @constructor
 */
function CtaBusVehiclesLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // TODO: use queue.js
    var _counter = 0;

    // To draw the icons on the map
    var _markersViewController;

    //////////////////////// PUBLIC METHODS ////////////////////////
    //this.timeChanged = function() {
    //    var time = model.getCtaModel().getCtaTime();
    //    console.log(time);
    //};

    this.vehiclesChanged = function() {
        // Just for debug purposes or when key expires.
        var fakeVehicles = model.getCtaModel().getFakeVehicles();

        console.log(_counter);

        // Draw only when all the queries ended.
        if(++_counter === model.getCtaModel().getRoutes().length || fakeVehicles) {
            draw();

            _counter = 0;
        }
    };


    this.pathChanged = function() {
        model.getCtaModel().stopUpdates();
        _counter = 0;
        //draw();
        self.vehiclesChanged();
    };

    this.zoomUpdated = function() {
        draw();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        console.log("CTA Bus Dispose");

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCtaModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };
    //////////////////////// PRIVATE METHODS ////////////////////////
    var draw = function() {
        var vehicles = model.getCtaModel().getVehicles();
        vehicles = model.getAreaOfInterestModel().filterObjects(vehicles);
        console.log("Vehicles");
        console.log(vehicles);
        //
        //var data = vehicles;
        //if (model.getAreaOfInterestModel().getAreaOfInterest()) {
        //    // filter objects
        //    data = model.getAreaOfInterestModel().filterObjects(vehicles);
        //}

        var canvas = self.getView().getSvg();
        //var points = canvas.selectAll("circle").data(data);
        //_markersViewController.draw(self, points, _vehiclesColor);

        var size = {
            width: model.getVisualizationModel().CTAMarkerIconSize().width,
            height: model.getVisualizationModel().CTAMarkerIconSize().height
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
                .attr("xlink:href", model.getVisualizationModel().CTAMarkerIconPath())
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
                .style("fill", model.getVisualizationModel().CTAMarkerColor())
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

    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VEHICLES);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomUpdated, Notifications.mapController.ZOOM_CHANGED);


    } ();

}

Utils.extend(CtaBusVehiclesLayerViewController, MapLayerController);
