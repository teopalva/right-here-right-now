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

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * This methods handles POINT_ADDED_TO_PATH, PATH_CLEANED notifications
     */
    this.pathChanged = function() {
        var path = model.getAreaOfInterestModel().getPath();

        var canvas = self.getView().getSvg();

        var points = canvas.selectAll("circle").data(path);

        points
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 10);

        points.enter().append("circle")
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 10);

        points.exit().remove();
    };

    /**
     * Called after the view is added to the a parent view
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {

        self.getView().getSvg()
            .style("pointer-events", "visiblePainted")
            .on("click", function() {
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];
                console.log("x= " + x + "  y= " + y);

                var coord = self.unproject(x, y);

                model.getAreaOfInterestModel().addPoint(coord.lat, coord.lng);
                /*
                var point = self.project(coord.lat, coord.lng);
                self.getView().getSvg()
                    .append("circle")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .attr("r", 10);*/
            });

        // Call super
        super_viewDidAppear.call(self);
    };

    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        self.getView().addClass("user-path-layer-view-controller");

        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_CLEANED);
    } ();
}

Utils.extend(UserPathLayerViewController, MapLayerController);