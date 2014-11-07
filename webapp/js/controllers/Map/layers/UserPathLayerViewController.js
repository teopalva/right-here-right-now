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

        /*
        var points = canvas.selectAll("circle").data(path);

        if(path.length > 0) {
            _markersViewController.draw(self,[points[0]],model.getColorModel().pathStartPointColor());
            if(path.length > 1) {
                _markersViewController.draw(self, [points[points.length -1]],model.getColorModel().pathEndPointColor());
                if(path.length > 2) {
                    _markersViewController.draw(self,points.slice(1, points.length -1),model.getColorModel().pathWaypointColor());
                }
            }
        }*/

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
                .style("fill", model.getColorModel().areaOfInterestFillColor())
                .style("stroke", model.getColorModel().areaOfInterestStrokeColor())
                .style("stroke-width", 0.3);

        } else {
            self.getView().getSvg().selectAll("path").remove();
        }

        // Draw points
        var points = canvas.selectAll(".points").data(path);

        points
            .attr("cx", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 1)
            .style("fill",function(d, i) {
                if(i == 0) {
                    return model.getColorModel().pathStartPointColor();
                } else if(i == (path.length -1)) {
                    return model.getColorModel().pathEndPointColor();
                } else {
                    return model.getColorModel().pathWaypointColor();
                }
            })
            .style("stroke","white")
            .style("stroke-width","0.2px");

        // Enter
        points.enter().append("circle")
            .classed("points", true)
            .attr("cx", function(d,i) {
                //_lastUpdate[i] = d ;
                var point = self.project(d.latitude, d.longitude);
                return point.x;
            })
            .attr("cy", function(d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y;
            })
            .attr("r", 1)
            .style("fill",function(d, i) {
                if(i == 0) {
                    return model.getColorModel().pathStartPointColor();
                } else if(i == (path.length -1)) {
                    return model.getColorModel().pathEndPointColor();
                } else {
                    return model.getColorModel().pathWaypointColor();
                }
            })
            .style("stroke","white")
            .style("stroke-width","0.2px");

        // Exit
        points.exit().remove();


        // Draw directions
        //drawDirections();
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
    var drawDirections = function() {
        var directions = model.getAreaOfInterestModel().getDirections();

        if(directions != null) {
            var boundPath = d3.geo.path();
            boundPath.projection(self.d3projection);

            self.getView().getSvg().selectAll(".route")
                .data(directions.features)
                .attr("d", boundPath)
                .enter().append("path").classed("route", true)
                .attr("d", boundPath)
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 0.3);

        } else {
            self.getView().getSvg().selectAll(".route").remove();
        }
    };

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