/**
 * @class UITripInfoViewController
 * @description ..
 *
 * @constructor
 */
function UIModeViewController() {

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
        self.getView().addClass("ui-mode-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

    }();
}

Utils.extend(UIModeViewController, UIViewController);

