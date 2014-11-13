/**
 * @class UserPathLayerViewController
 * @description
 *
 * @constructor
 */
function UserPathLayerViewController() {
    MapLayerController.call(this);


    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    // Mouse event
    var _clickFlag = false;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * This methods handles PATH_UPDATED notification
     */
    this.pathChanged = function() {
        drawBounds();
    };

    /**
     * This methods handles POINT_ADDED_TO_PATH notification
     */
    this.pointsUpdated = function() {
        drawCornerPoints();
    };

    this.zoomChanged = function() {
        draw();
    };

    var drag;
    /**
     * Called after the view is added to the a parent view
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {
        self.getView().getSvg().on( "mousedown",function() {
            _clickFlag = true;
        });

        self.getView().getSvg().on( "mousemove",function() {
            _clickFlag = false;
        });

        self.getView().getSvg().on( "mouseup",function() {
            if(_clickFlag == true) {
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];

                var coord = self.unproject(x, y);

                model.getAreaOfInterestModel().addPoint(coord.lat, coord.lng);
            }
        });


        self.getView().getSvg()
            .style("pointer-events", "visiblePainted");

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var draw = function() {
        drawCornerPoints();
        drawBounds();
    };

    var drawCornerPoints = function() {
        var canvas = self.getView().getSvg();
        var path = model.getAreaOfInterestModel().getPath();

        var points = canvas.selectAll(".path-points").data(path);

        points
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .style("fill", model.getVisualizationModel().selectionCornerFillColor())
            .style("stroke", model.getVisualizationModel().selectionCornerStrokeColor())
            .style("stroke-width", model.getVisualizationModel().selectionCornerStrokeWidth());

        // Enter
        points.enter().insert("circle", ":first-child")
            .classed("path-points", true)
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 10)
            .style("fill", model.getVisualizationModel().selectionCornerFillColor())
            .style("stroke", model.getVisualizationModel().selectionCornerStrokeColor())
            .style("stroke-width", model.getVisualizationModel().selectionCornerStrokeWidth());

        // Exit
        points.exit().remove();
    };

    // Draw path points
    var drawPathPoints = function() {
        var canvas = self.getView().getSvg();
        var path = model.getAreaOfInterestModel().getPath();

        var points = canvas.selectAll(".path-points").data(path);

        points
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .style("fill",function(d, i) {
                if(i == 0) {
                    return model.getVisualizationModel().pathStartPointColor();
                } else if(i == (path.length -1)) {
                    return model.getVisualizationModel().pathEndPointColor();
                } else {
                    return model.getVisualizationModel().pathWaypointColor();
                }
            });

        // Enter
        points.enter().append("circle")
            .classed("path-points", true)
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 10)
            .style("fill",function(d, i) {
                if(i == 0) {
                    return model.getVisualizationModel().pathStartPointColor();
                } else if(i == (path.length -1)) {
                    return model.getVisualizationModel().pathEndPointColor();
                } else {
                    return model.getVisualizationModel().pathWaypointColor();
                }
            })
            .style("stroke","white")
            .style("stroke-width","1px");

        // Exit
        points.exit().remove();
    };

    // Draw bounds of the region of interest
    var drawBounds = function() {
        var canvas = self.getView().getSvg();

        console.log("path updated");

        // Draw boundary
        var boundaries = model.getAreaOfInterestModel().getAreaOfInterest();

        if(boundaries != null) {
            var boundPath = d3.geo.path();
            boundPath.projection(self.d3projection);

            self.getView().getSvg().selectAll("path")
                .data(boundaries.features)
                .attr("d", boundPath)
                .enter().append("path")
                .attr("d", boundPath)
                .style("fill", model.getVisualizationModel().areaOfInterestFillColor())
                .style("stroke", model.getVisualizationModel().areaOfInterestStrokeColor())
                .style("stroke-width", model.getVisualizationModel().areaOfInterestStrokeWidth());

        } else {
            self.getView().getSvg().selectAll("path").remove();
        }
    };

    var init = function() {
        self.getView().addClass("user-path-layer-view-controller");

        notificationCenter.subscribe(self, self.pointsUpdated, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.pointsUpdated, Notifications.areaOfInterest.POINTS_UPDATED);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
        self.pathChanged();
    } ();
}

Utils.extend(UserPathLayerViewController, MapLayerController);