/**
 * @class UINotificationCenterViewController
 * @description ..
 *
 * @constructor
 */
function UINotificationCenterViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();
        
        
        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-trip-info-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        
        // Setup UI
      

    }();
}

Utils.extend(UITripInfoViewController, UIViewController);
