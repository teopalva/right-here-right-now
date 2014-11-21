/***
 * @class CtaBusRoutesLayerViewController
 * @description Layer of CTA buses stops.
 *
 * @constructor
 */
function CtaBusRoutesLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;

    //////////////////////// PUBLIC METHODS ////////////////////////

    this.enabledRoutesChanged = function() {
        model.getCtaModel().updateRoutesPaths();

        drawRoutes();
    };

    /**
     * Draw stops when new ones are retrieved
     */
    this.routesPathsChanged = function() {
        drawRoutes();
    };

    /**
     *
     */
    this.pathChanged = function() {
        //model.getCtaModel().stopUpdates();
        //console.log("update routes...")
        //model.getCtaModel().updateRoutesPaths();
        model.getCtaModel().updateRoutesPaths();

        drawRoutes();
    };

    this.zoomUpdated = function() {
        drawRoutes();
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
    /***
     * Get all the routes and draw them
     */
    var drawRoutes = function() {
        var routes = model.getCtaModel().getRoutesPaths();

        var busLines = [];

        for(var i in routes) {
            busLines.push(routes[i].points);

        }

        var canvas = self.getView().getSvg();

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

        var directions = canvas.selectAll(".busLine").data(busLines);

        // Update
        directions
            .attr("d", function(busLine) {
                return lineFunction(busLine);
            });

        // Enter
        directions.enter()
            .append("path")
            .classed("busLine", true)
            .attr("stroke", function(d) {
                return model.getVisualizationModel().directionsStrokeColor()
            })
            .attr("stroke-width", model.getVisualizationModel().directionsStrokeWidth())
            .attr("fill", "none")
            .attr("d", function(busLine) {
                return lineFunction(busLine);
            });

        // Exit
        directions.exit().remove();

    };

    var draw = function(routePath) {

        var canvas = self.getView().getSvg();

        // TODO: has to be done?
        //if(routePath == null || routePath.length == 0) {
        //    canvas.select(".directions").remove();
        //}
        //else {
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
            .attr("d", lineFunction(routePath));
        //}

    };


    var init = function() {
        self.getView().addClass("cta-paths-layer-view-controller");

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.routesPathsChanged, Notifications.cta.ROUTES_PATHS);
        notificationCenter.subscribe(self, self.enabledRoutesChanged, Notifications.cta.STOPS);

        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomUpdated, Notifications.mapController.ZOOM_CHANGED);

    } ();

}

Utils.extend(CtaBusRoutesLayerViewController, MapLayerController);
