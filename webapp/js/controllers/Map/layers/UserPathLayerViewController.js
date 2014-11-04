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
     * This methods handles POINT_ADDED_TO_PATH, PATH_CLEANED notifications
     */
    this.pathChanged = function() {
        var path = model.getAreaOfInterestModel().getPath();

        var canvas = self.getView().getSvg();

        var points = canvas.selectAll("circle").data(path);

        // Update
        points
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 2);

        // Enter
        points.enter().append("circle")
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 2);

        // Exit
        points.exit().remove();
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
            /*
            .on("dragend", function() {
                console.log("drag end");
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];

                var coord = self.unproject(x, y);

                model.getAreaOfInterestModel().addPoint(coord.lat, coord.lng);
            });*/

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        self.getView().addClass("user-path-layer-view-controller");

        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_CLEANED);
        self.pathChanged();
    } ();
}

Utils.extend(UserPathLayerViewController, MapLayerController);