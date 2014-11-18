/**
 * @class RestaurantsLayerViewController
 * @description
 *
 * @constructor
 */
function RestaurantsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the restaurants on the screen
     */
    this.restaurantsUpdated = function () {
        draw();
    };

    /**
     * Handler method for ZOOM_CHANGED notification
     */
    this.zoomChanged = function() {
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
        var restaurants = model.getRestaurantsModel().getRestaurants();
        restaurants = model.getAreaOfInterestModel().filterObjects(restaurants);

        var canvas = self.getView().getSvg();



        var size = {
            width: model.getVisualizationModel().restaurantsMarkerIconSize().width,
            height: model.getVisualizationModel().restaurantsMarkerIconSize().height
        };
        var markers;

        // Draw marker type based on zoom level
        if(model.getMapModel().getZoomLevel() >= model.getVisualizationModel().detailedMarkerZoomLevel()) {
            canvas.selectAll(".marker.point").remove();
            markers = canvas.selectAll(".marker.pin").data(restaurants);

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
                .attr("xlink:href", model.getVisualizationModel().restaurantsMarkerIconPath())
                .attr("x", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x - (size.width / 2);
                })
                .attr("y", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y - size.height;
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;


            // Exit
            markers.exit().remove();

        } else {
            canvas.selectAll(".marker.pin").remove();
            markers = canvas.selectAll(".marker.point").data(restaurants);
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
                .style("fill", model.getVisualizationModel().restaurantsMarkerColor())
                .attr("cx", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.x;
                })
                .attr("cy", function(d) {
                    var point = self.project(d.latitude, d.longitude);
                    return point.y;
                })
                .attr("r", model.getVisualizationModel().markerRadius())
                .attr("stroke",model.getVisualizationModel().markerStrokeColor())
                .attr("stroke-width",model.getVisualizationModel().markerStrokeWidth())
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;

            // Exit
            markers.exit().remove();
        }

    };

    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.RESTAURANTS,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            id: d.id,
            dba_name: d.dba_name,
            license: d.license,
            facility_type: d.facility_type,
            risk: d.risk,
            address: d.address,
            inspection_date: d.inspection_date,
            inspection_type: d.inspection_type,
            results: d.results
        });
    };


    var init = function () {
        self.getView().addClass("restaurants-layer-view-controller");


        notificationCenter.subscribe(self, self.restaurantsUpdated, Notifications.restaurants.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.restaurantsUpdated, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.restaurantsUpdated, Notifications.mapController.ZOOM_CHANGED);

        model.getRestaurantsModel().startUpdates();
    }();
}

Utils.extend(RestaurantsLayerViewController, MapLayerController);