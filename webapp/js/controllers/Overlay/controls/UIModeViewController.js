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
        
        // NEW TRIP
        _newTripButton.getView().setFrame(31.5, 65, 253.5, 76);
        _newTripButton.getView().setViewBox(0, 0, 253.5, 76);
        _newTripButton.setImage("/webapp/assets/icon/newTripButton.svg");
        _newTripButton.setTitle("NEW TRIP");
        // TODO add all behaviors on new trip click
        _newTripButton.onClick(function(){
            model.getAreaOfInterestModel().clearPath();
        });
        self.add(_newTripButton);
        
        // RECTANGULAR SELECTION
        _rectModeButton.getView().setFrame(31.5, 169, 113, 113);
        _rectModeButton.getView().setViewBox(0, 0, 113, 113);
        _rectModeButton.setImage("/webapp/assets/icon/rectMode_deselected.svg");
        self.add(_rectModeButton);
        
        // CUSTOM PATH
        _pathModeButton.getView().setFrame(172.5, 169, 113, 113);
        _pathModeButton.getView().setViewBox(0, 0, 113, 113);
        _pathModeButton.setImage("/webapp/assets/icon/pathMode_deselected.svg");
        self.add(_pathModeButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-mode-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        
         // Setup UI
        _newTripButton = new UIButtonViewController;
        _rectModeButton = new UIButtonViewController;
        _pathModeButton = new UIButtonViewController;

    }();
}

Utils.extend(UIModeViewController, UIViewController);

