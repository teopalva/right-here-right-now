/**
 * QualityOfLifeCrimesLayerViewController
 * @description Layer for crime data.
 * @constructor
 */
function QualityOfLifeCrimesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the qualityOfLifeCrimes on the screen
     */
    this.crimesUpdated = function () {
        draw();
    };


    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function() {
        var crimes = model.getCrimesModel().getCrimes(CrimeCategory.QUALITY_OF_LIFE);
        crimes = model.getAreaOfInterestModel().filterObjects(crimes);

        var canvas = self.getView().getSvg();


        var size = {
            width: model.getVisualizationModel().qualityOfLifeCrimesMarkerIconSize().width,
            height: model.getVisualizationModel().qualityOfLifeCrimesMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(crimes);

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
                .attr("xlink:href", model.getVisualizationModel().qualityOfLifeCrimesMarkerIconPath())
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
            markers = canvas.selectAll(".marker.point").data(crimes);
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
                .style("fill", model.getVisualizationModel().qualityOfLifeCrimesMarkerColor())
                .attr("cx", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius());

            // Exit
            markers.exit().remove();
        }

    };


    var init = function() {
        self.getView().addClass("qualityOfLifeCrimes-layer-view-controller");

        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.qualityOfLifeCrimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.mapController.ZOOM_CHANGED);

        model.getCrimesModel().startUpdates();
    } ();
}

Utils.extend(QualityOfLifeCrimesLayerViewController, MapLayerController);
