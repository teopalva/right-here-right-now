/**
 * @class PlacesOfInterestLayerViewController
 * @description
 *
 * @constructor
 */
function PlacesOfInterestLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    this.draw = function() {

        var placesOfInterest = model.getPlacesOfInterestModel().getPlacesOfInterest();

        var canvas = self.getView().getSvg();

        var size = {
            width: model.getVisualizationModel().placesOfInterestMarkerIconSize().width,
            height: model.getVisualizationModel().placesOfInterestMarkerIconSize().height
        };
        var markers;

            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(placesOfInterest);

        // Update
        markers
            .attr("x", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x - (size.width / 2);
            })
            .attr("y", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y - (size.height /2);
            });

        // Enter
        markers.enter()
            .append("image")
            .classed("marker", true)
            .classed("pin", true)
            .attr("xlink:href", model.getVisualizationModel().placesOfInterestMarkerIconPath())
            .attr("x", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x - (size.width / 2);
            })
            .attr("y", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y - (size.height /2);
            })
            .attr("width", size.width)
            .attr("height", size.height);
        ;

        // Exit
        markers.exit().remove();
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("placesOfInterest-layer-view-controller");
        self.draw();
        notificationCenter.subscribe(self, self.draw, Notifications.mapController.ZOOM_CHANGED);
    }();
}

Utils.extend(PlacesOfInterestLayerViewController, MapLayerController);
