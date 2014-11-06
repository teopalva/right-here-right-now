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

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "black";

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

        _markersViewController.draw(self,points,_markersColor);

        // TODO debug
        var boundaries = model.getAreaOfInterestModel().getAreaOfInterest();

        if(boundaries != null) {
            var boundPath = d3.geo.path();
            boundPath.projection(self.d3projection);



            self.getView().getSvg().selectAll("path")
                .data(boundaries.features)
                .attr("d", boundPath)
                .enter().append("path")
                .attr("d", boundPath)
                .style("fill", "rgba(222,235,247, 0.5)")
                .style("stroke", "rgba(222,235,247, 1.0)")
                .style("stroke-width", 0.3);

        }
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
        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_CLEANED);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);
        self.pathChanged();

    } ();
}

Utils.extend(UserPathLayerViewController, MapLayerController);