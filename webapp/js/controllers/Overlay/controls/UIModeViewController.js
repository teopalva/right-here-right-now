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

    var _newTripButton;
    var _rectModeButton;
    var _pathModeButton;

    var _selectColor = model.getThemeModel().deselectedButtonColor;
    var _deselectColor = model.getThemeModel().toolBackgroundColor;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();

        // NEW TRIP
        _newTripButton.getView().setFrame(31, 17.5, 253.5, 75.5);
        _newTripButton.getView().setViewBox(0, 0, 253.5, 75.5);
        //_newTripButton.setImage("assets/icon/newTripButton.svg");
        _newTripButton.setTitle("NEW TRIP");
        _newTripButton.getView().setStroke("white", "1pt");
        _newTripButton.onClick(function () {
            _newTripButton.getView().highlight(_selectColor, 1000);
            model.getAreaOfInterestModel().clearPath();
        });
        self.add(_newTripButton);

        // RECTANGULAR SELECTION
        _rectModeButton.getView().setFrame(31, 108.5, 112, 113);
        _rectModeButton.getView().setViewBox(0, 0, 112, 113);
        _rectModeButton.setImage("assets/icon/rectMode_selected.svg");
        _rectModeButton.onClick(function () {
            model.getAreaOfInterestModel().setAreaOfInterestType(AreaOfInterestType.RECTANGLE);
            updateModeIcon();
        });
        self.add(_rectModeButton);

        // CUSTOM PATH
        _pathModeButton.getView().setFrame(175, 108.5, 112, 113);
        _pathModeButton.getView().setViewBox(0, 0, 112, 113);
        _pathModeButton.setImage("assets/icon/pathMode_deselected.svg");
        _pathModeButton.onClick(function () {
            model.getAreaOfInterestModel().setAreaOfInterestType(AreaOfInterestType.PATH);
            updateModeIcon();
        });
        self.add(_pathModeButton);

        // RECOMMENDER

        // Walk
        _walkButton.getView().setFrame(40, 256.5, 22, 38.5);
        _walkButton.getView().setViewBox(0, 0, 22, 38.5);
        _walkButton.setImage("assets/icon/transport/walking.svg");
        self.add(_walkButton);

        // Bike
        _bikeButton.getView().setFrame(93, 256.5, 41, 38.5);
        _bikeButton.getView().setViewBox(0, 0, 41, 38.5);
        _bikeButton.setImage("assets/icon/transport/bike.svg");
        self.add(_bikeButton);

        // Car
        _carButton.getView().setFrame(164, 256.5, 50, 42.5);
        _carButton.getView().setViewBox(0, 0, 50, 42.5);
        _carButton.setImage("assets/icon/transport/car.svg");
        self.add(_carButton);

        // Bus
        _busButton.getView().setFrame(239, 256.5, 37.5, 38.5);
        _busButton.getView().setViewBox(0, 0, 37.5, 38.5);
        _busButton.setImage("assets/icon/transport/bus.svg");
        self.add(_busButton);

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

    var updateModeIcon = function () {
        if (model.getAreaOfInterestModel().getAreaOfInterestType() === AreaOfInterestType.RECTANGLE) {
            _rectModeButton.setImage("assets/icon/rectMode_selected.svg");
            _pathModeButton.setImage("assets/icon/pathMode_deselected.svg");
        } else {
            _rectModeButton.setImage("assets/icon/rectMode_deselected.svg");
            _pathModeButton.setImage("assets/icon/pathMode_selected.svg");
        }
    };

}

Utils.extend(UIModeViewController, UIViewController);