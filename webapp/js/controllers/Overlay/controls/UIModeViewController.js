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
    var _transportButtons = [];

    var _walkButton;
    var _bikeButton;
    var _carButton;
    var _busButton;

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
        _newTripButton.setTitle("CLEAR  SELECTION");
        _newTripButton.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
        //_newTripButton.getView().setStroke("white", "1pt");

        _newTripButton.onClick(function () {
            _newTripButton.getView().highlight(_selectColor, 600);
            model.getAreaOfInterestModel().clearPath();
            model.getRecommenderModel().setSelectedTransport(null);
            deselectAllTransportButtons();
        });
        self.add(_newTripButton);

        // RECTANGULAR SELECTION
        _rectModeButton.getView().setFrame(31, 108.5, 112, 113);
        _rectModeButton.getView().setViewBox(0, 0, 112, 113);
        _rectModeButton.setImage("assets/icon/rectMode_deselected.svg");
        _rectModeButton.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
        _rectModeButton.onClick(function () {
            model.getAreaOfInterestModel().setAreaOfInterestType(AreaOfInterestType.RECTANGLE);
            updateModeIcon();
        });
        self.add(_rectModeButton);

        // CUSTOM PATH
        _pathModeButton.getView().setFrame(175, 108.5, 112, 113);
        _pathModeButton.getView().setViewBox(0, 0, 112, 113);
        _pathModeButton.setImage("assets/icon/pathMode_deselected.svg");
        _pathModeButton.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
        _pathModeButton.onClick(function () {
            model.getAreaOfInterestModel().setAreaOfInterestType(AreaOfInterestType.PATH);
            updateModeIcon();
        });
        self.add(_pathModeButton);

        updateModeIcon();

        // RECOMMENDER

        // Box
        _recommenderButton.getView().setFrame(31, 237, 253.5, 75.5);
        _recommenderButton.getView().setViewBox(0, 0, 253.5, 75.5);
        _recommenderButton.getView().setStroke("white", "1pt");
        //self.add(_recommenderButton);

        // Walk
        _walkButton.getView().setFrame(34, 237, 63, 75.5);
        _walkButton.getView().setViewBox(0, 0, 63, 75.5);
        _walkButton.setImage("assets/icon/transport/walk.svg");
        _walkButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().WALK);
            updateLayers();
            selectTransportButton(_walkButton);
        });
        self.add(_walkButton);
        _transportButtons.push(_walkButton);

        // Bike
        _bikeButton.getView().setFrame(97, 237, 63, 75.5);
        _bikeButton.getView().setViewBox(0, 0, 63, 75.5);
        _bikeButton.setImage("assets/icon/transport/bike_.svg");
        _bikeButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().BIKE);
            updateLayers();
            selectTransportButton(_bikeButton);
        });
        self.add(_bikeButton);
        _transportButtons.push(_bikeButton);

        // Car
        _carButton.getView().setFrame(160, 237, 63, 75.5);
        _carButton.getView().setViewBox(0, 0, 63, 75.5);
        _carButton.setImage("assets/icon/transport/car.svg");
        _carButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().CAR);
            updateLayers();
            selectTransportButton(_carButton);
        });
        self.add(_carButton);
        _transportButtons.push(_carButton);

        // Bus
        _busButton.getView().setFrame(223, 237, 63, 75.5);
        _busButton.getView().setViewBox(0, 0, 63, 75.5);
        _busButton.setImage("assets/icon/transport/bus_.svg");
        _busButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().BUS);
            updateLayers();
            selectTransportButton(_busButton);
        });
        self.add(_busButton);
        _transportButtons.push(_busButton);

        deselectAllTransportButtons();

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var updateModeIcon = function () {
        if (model.getAreaOfInterestModel().getAreaOfInterestType() === AreaOfInterestType.RECTANGLE) {
            _pathModeButton.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
            _rectModeButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor);
            //_rectModeButton.setImage("assets/icon/rectMode_selected.svg");
            //_pathModeButton.setImage("assets/icon/pathMode_deselected.svg");
        } else {
            _rectModeButton.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
            _pathModeButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor);
            //_rectModeButton.setImage("assets/icon/rectMode_deselected.svg");
            //_pathModeButton.setImage("assets/icon/pathMode_selected.svg");
        }
    };

    var init = function () {
        self.getView().addClass("ui-mode-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _newTripButton = new UIButtonViewController;
        _rectModeButton = new UIButtonViewController;
        _pathModeButton = new UIButtonViewController;
        _recommenderButton = new UIButtonViewController;
        _walkButton = new UIButtonViewController;
        _bikeButton = new UIButtonViewController;
        _carButton = new UIButtonViewController;
        _busButton = new UIButtonViewController;

    }();

    var updateLayers = function () {
        var layers = model.getRecommenderModel().getRecommendedLayers();
        model.getMapLayersModel().disableAllLayers();
        model.getMapLayersModel().enableLayers(layers);
    };

    var selectTransportButton = function (sel) {
        deselectAllTransportButtons();
        sel.select();
        sel.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor);
    };

    var deselectAllTransportButtons = function () {
        for (b in _transportButtons) {
            _transportButtons[b].deselect();
            _transportButtons[b].getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor);
        }
    };

}

Utils.extend(UIModeViewController, UIViewController);