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
        
         // RECTANGULAR SELECTION
        _rectModeButton.getView().setFrame(40, 22, 22, 38.5);
        _rectModeButton.getView().setViewBox(0, 0, 22, 38.5);
        //_rectModeButton.setImage("/icons/transport/walking.svg");
        self.add(_rectModeButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-mode-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        
         // Setup UI
        _rectModeButton = new UIButtonViewController;
        _pathModeButton = new UIButtonViewController;

    }();
}

Utils.extend(UIModeViewController, UIViewController);

