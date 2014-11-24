/**
 * @class TuristAttractionsLayerViewController
 * @description
 *
 * @constructor
 */
function TuristAttractionsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    this.draw = function () {
        console.log("CALLED");
        var turistAttractions = model.getTuristAttractionsModel().getTuristAttractions();

        var canvas = self.getView().getSvg();

        var size = {
            width: model.getVisualizationModel().turistAttractionsMarkerIconSize().width,
            height: model.getVisualizationModel().turistAttractionsMarkerIconSize().height
        };
        var markers;

        canvas.selectAll(".marker.point").remove();
        markers = canvas.selectAll(".marker.pin").data(turistAttractions);

        // Update
        markers
            .attr("x", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x - (size.width / 2);
            })
            .attr("y", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y - (size.height / 2);
            });

        // Enter
        markers.enter()
            .append("image")
            .classed("marker", true)
            .classed("pin", true)
            .attr("xlink:href", function (d) {
                return d.url;
            })
            .attr("x", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.x - (size.width / 2);
            })
            .attr("y", function (d) {
                var point = self.project(d.latitude, d.longitude);
                return point.y - (size.height / 2);
            })
            .attr("width", size.width)
            .attr("height", size.height)
            .style("pointer-events", "visiblePainted")
            .style("cursor", "pointer")
            .on("click", function(d) {
                addToPopup(d);
                model.getAreaOfInterestModel().addPoint(d.latitude, d.longitude);
            });

        // Exit
        markers.exit().remove();
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.PLACES_OF_INTEREST,
            layer: Layers.TURIST_ATTRACTIONS,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            name: d.name,
            address: d.address,
            url: d.url,
            image: d.image,
            wiki: d.wiki,
            description: d.description
        });
    };

    var init = function () {
        self.getView().addClass("turistAttractions-layer-view-controller");
        notificationCenter.subscribe(self, self.draw, Notifications.turistAttractions.DATA_CHANGED);
        notificationCenter.subscribe(self, self.draw, Notifications.mapController.ZOOM_CHANGED);

        model.getTuristAttractionsModel().startUpdates();
    }();
}

Utils.extend(TuristAttractionsLayerViewController, MapLayerController);