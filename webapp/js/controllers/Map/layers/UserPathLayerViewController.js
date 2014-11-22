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
     * This methods handles POINT_ADDED_TO_PATH notification
     */
    this.pointsUpdated = function() {
        console.time("points updated");
        draw();
        console.timeEnd("points updated");
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


    var init = function() {
        self.getView().addClass("user-path-layer-view-controller");

        notificationCenter.subscribe(self, self.pointsUpdated, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.pointsUpdated, Notifications.areaOfInterest.POINTS_UPDATED);
        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
    } ();
}

Utils.extend(UserPathLayerViewController, MapLayerController);