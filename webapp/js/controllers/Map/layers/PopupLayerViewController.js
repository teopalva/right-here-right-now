/**
 * @class PopupLayerViewController
 * @description
 *
 * @constructor
 */
function PopupLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _factory;


    ////////////////////////// PUBLIC METHODS /////////////////////////
    this.closePopup = function(popup) {
        model.getPopupModel().removePopup(popup.getDictionary());
    };

    this.updatePopups = function() {
        // Retrieve from model
        var popups = model.getPopupModel().getPopups();

        self.removeAllChildren();

        popups.forEach(function(dictionary) {
            var popup = _factory.getPopup(dictionary);
            popup.setDelegate(self);
            self.add(popup);
        });
    };

    /**
     * Handler method for ZOOM_CHANGED notification
     */
    this.zoomChanged = function() {

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
    
    var init = function () {
        self.getView().addClass("popup-layer-view-controller");

        _factory = new PopupFactory();

        notificationCenter.subscribe(self, self.updatePopups, Notifications.popups.POPUPS_CHANGED);
        notificationCenter.subscribe(self, self.updatePopups, Notifications.mapController.ZOOM_CHANGED);
    }();
}

Utils.extend(PopupLayerViewController, MapLayerController);