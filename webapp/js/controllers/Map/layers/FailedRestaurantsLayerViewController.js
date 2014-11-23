/**
 * @class FailedRestaurantsLayerViewController
 * @description
 *
 * @constructor
 */
function FailedRestaurantsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _cachedData = [];

    ////////////////////////// PUBLIC METHODS /////////////////////////
    this.drawCachedPoints = function () {
        draw(_cachedData);
    };

    this.drawNewPoints = function () {
        _cachedData = model.getRestaurantsModel().getRestaurants(InspectionResult.FAILED);
        _cachedData = model.getAreaOfInterestModel().filterObjects(_cachedData);
        draw(_cachedData);
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function () {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        notificationCenter.unsuscribeFromAll(self);
        model.getPopupModel().removeAll(Layers.FAILED_RESTAURANTS);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function (restaurants) {

        var canvas = self.getView().getSvg();

        var size = {
            width: model.getVisualizationModel().failedRestaurantsMarkerIconSize().width,
            height: model.getVisualizationModel().failedRestaurantsMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if (model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(restaurants);

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
                .attr("xlink:href", model.getVisualizationModel().failedRestaurantsMarkerIconPath())
                .attr("x", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x - (size.width / 2);
                })
                .attr("y", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y - (size.height /2);
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function (d) {
                    addToPopup(d);
                });
            ;


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(restaurants);
            // Update
            markers
                .attr("cx", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                });

            // Enter
            markers.enter()
                .append("circle")
                .classed("marker", true)
                .classed("point", true)
                .style("fill", model.getVisualizationModel().failedRestaurantsMarkerColor())
                .attr("cx", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function (d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius())
                .attr("stroke", model.getVisualizationModel().markerStrokeColor())
                .attr("stroke-width", model.getVisualizationModel().markerStrokeWidth())
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function (d) {
                    addToPopup(d);
                });
            ;

            // Exit
            markers.exit().remove();
        }

    };

    var addToPopup = function (d) {
        model.getPopupModel().addPopup({
            type: PopupsType.RESTAURANTS,
            layer: Layers.FAILED_RESTAURANTS,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            name: d.name.substring(0, 20),
            address: d.location.display_address[0],
            city: d.location.display_address[1] +", " + d.location.display_address[2],
            inspection: d.inspectionResult + " on " + d.inspectionDate,
            reviews: d.review_count,
            image: d.image_url,
            rating: d.rating,
            phone: d.display_phone,
            category: d.categories
        });
    };


    var init = function () {
        self.getView().addClass("failedRestaurants-layer-view-controller");


        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.failedRestaurants.DATA_CHANGED);
        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.drawCachedPoints, Notifications.mapController.ZOOM_CHANGED);

        model.getRestaurantsModel().startUpdates();
    }();
}

Utils.extend(FailedRestaurantsLayerViewController, MapLayerController);