/**
 * @class UITripInfoViewController
 * @description ..
 *
 * @constructor
 */
function UITripInfoViewController() {

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
        
        // TRANSPORT BUTTONS
        
        // Walk
        _walkButton.getView().setFrame(40, 22, 22, 38.5);
        _walkButton.getView().setViewBox(0, 0, 22, 38.5);
        _walkButton.setImage("/webapp/assets/icon/transport/walking.svg");
        self.add(_walkButton);

        // Bike
        _bikeButton.getView().setFrame(93, 22, 41, 38.5);
        _bikeButton.getView().setViewBox(0, 0, 41, 38.5);
        _bikeButton.setImage("/webapp/assets/icon/transport/bike.svg");
        self.add(_bikeButton);
        
        // Car
        _carButton.getView().setFrame(164, 22, 50, 42.5);
        _carButton.getView().setViewBox(0, 0, 50, 42.5);
        _carButton.setImage("/webapp/assets/icon/transport/car.svg");
        self.add(_carButton);
        
        // Bus
        _busButton.getView().setFrame(239, 22, 37.5, 38.5);
        _busButton.getView().setViewBox(0, 0, 37.5, 38.5);
        _busButton.setImage("/webapp/assets/icon/transport/bus.svg");
        self.add(_busButton);
        
        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-trip-info-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        
        // Setup UI
        _walkButton = new UIButtonViewController;
        _bikeButton = new UIButtonViewController;
        _carButton = new UIButtonViewController;
        _busButton = new UIButtonViewController;

    }();
}

Utils.extend(UITripInfoViewController, UIViewController);
