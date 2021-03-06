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

    this.drawNewPoints = function(){
        var points = model.getCrimesModel().getCrimesInSelectedArea(CrimeCategory.QUALITY_OF_LIFE);
        draw(points);
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getPopupModel().removeAll(Layers.QUALITY_OF_LIFE_CRIMES);
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////
    var draw = function(crimes) {
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
                    return point.y - (size.height /2);
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
                    return point.y - (size.height /2);
                })
                .attr("width", size.width)
                .attr("height", size.height)
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;;


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
                .attr("r", model.getVisualizationModel().markerRadius())
                .attr("stroke",model.getVisualizationModel().markerStrokeColor())
                .attr("stroke-width",model.getVisualizationModel().markerStrokeWidth())
                .style("pointer-events", "visiblePainted")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    addToPopup(d);
                });;;

            // Exit
            markers.exit().remove();
        }

    };

    var addToPopup = function(d){
        model.getPopupModel().addPopup({
            type: PopupsType.CRIME,
            layer: Layers.QUALITY_OF_LIFE_CRIMES,
            position: {
                latitude: d.latitude,
                longitude: d.longitude
            },
            date: d.date,
            category: d.category,
            arrest: d.arrest,
            primaryType: d["primary_type"],
            id: d.id,
            description: d.description,
            location_description: d.location_description,
            block: d.block,
            case_number: d.case_number
        });
    };


    var init = function() {
        self.getView().addClass("qualityOfLifeCrimes-layer-view-controller");

        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.crimes.SELECTION_UPDATED);
        notificationCenter.subscribe(self, self.drawNewPoints, Notifications.mapController.ZOOM_CHANGED);

        self.drawNewPoints();
    } ();
}

Utils.extend(QualityOfLifeCrimesLayerViewController, MapLayerController);
