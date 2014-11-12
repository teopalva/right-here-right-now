/**
 * @class MapLayerController
 * @description All view controllers that draws on the map should inherit this class
 *
 * @constructor
 */
function MapLayerController() {
    UIViewController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * Project the coordinate to a point coherent to the layer
     * @param lat
     * @param lng
     * @returns {Object} x:.., y:..
     */
    this.project = function(lat, lng) {
        //return model.getMapModel().projectAtDefaultZoom(lat,lng);
        return model.getMapModel().projectAtCurrentZoom(lat,lng);
    };

    /**
     *
     * @param x
     * @param y
     */
    this.unproject = function(x, y) {
        //return model.getMapModel().unprojectAtDefaultZoom(x, y);
        return model.getMapModel().unprojectAtCurrentZoom(x, y);
    };

    /**
     * Wrapper for the standard d3 projection
     */
    this.d3projection = function(latLng) {
        var point = self.project(latLng[1], latLng[0]);
        return [point.x, point.y];
    };

    this.zoomChanged = function() {
        var topLeftCoord = model.getMapModel().getTopLeftCoordOfInterest();
        var bottomRightCoord = model.getMapModel().getBottomRightCoordOfInterest();
        //var topLeft = model.getMapModel().projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        //var bottomRight =  model.getMapModel().projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var topLeft = model.getMapModel().projectAtCurrentZoom(topLeftCoord.lat,topLeftCoord.lng);
        var bottomRight =  model.getMapModel().projectAtCurrentZoom(bottomRightCoord.lat,bottomRightCoord.lng);

        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        self.getView().setFrame(0,0,bottomRight.x,bottomRight.y);
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        var topLeftCoord = model.getMapModel().getTopLeftCoordOfInterest();
        var bottomRightCoord = model.getMapModel().getBottomRightCoordOfInterest();
        //var topLeft = model.getMapModel().projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        //var bottomRight =  model.getMapModel().projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var topLeft = model.getMapModel().projectAtCurrentZoom(topLeftCoord.lat,topLeftCoord.lng);
        var bottomRight =  model.getMapModel().projectAtCurrentZoom(bottomRightCoord.lat,bottomRightCoord.lng);

        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        self.getView().setFrame(0,0,bottomRight.x,bottomRight.y);

        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
    } ();
}

Utils.extend(MapLayerController, UIViewController);