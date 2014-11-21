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
            _newTripButton.getView().highlight(_selectColor, 600);
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

        // Box
        _recommenderButton.getView().setFrame(31, 237, 253.5, 75.5);
        _recommenderButton.getView().setViewBox(0, 0, 253.5, 75.5);
        _recommenderButton.getView().setStroke("white", "1pt");
        self.add(_recommenderButton);

        // Walk
        _walkButton.getView().setFrame(34, 240, 63, 75.5);
        _walkButton.getView().setViewBox(0, 0, 63, 75.5);
        _walkButton.setImage("assets/icon/transport/walk.svg");
        _walkButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().WALK);
            updateLayers();
        });
        self.add(_walkButton);

        // Bike
        _bikeButton.getView().setFrame(97, 240, 63, 75.5);
        _bikeButton.getView().setViewBox(0, 0, 63, 75.5);
        _bikeButton.setImage("assets/icon/transport/bike_.svg");
        _bikeButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().BIKE);
            updateLayers();
        });
        self.add(_bikeButton);

        // Car
        _carButton.getView().setFrame(160, 240, 63, 75.5);
        _carButton.getView().setViewBox(0, 0, 63, 75.5);
        _carButton.setImage("assets/icon/transport/car.svg");
        _carButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().CAR);
            updateLayers();
        });
        self.add(_carButton);

        // Bus
        _busButton.getView().setFrame(223, 240, 63, 75.5);
        _busButton.getView().setViewBox(0, 0, 63, 75.5);
        _busButton.setImage("assets/icon/transport/bus_.svg");
        _busButton.onClick(function () {
            model.getRecommenderModel().setSelectedTransport(model.getRecommenderModel().getTransports().BUS);
            updateLayers();
        });
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
        _recommenderButton = new UIButtonViewController;

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

    var updateLayers = function () {
        var layers = model.getRecommenderModel().getRecommendedLayers();
        console.log(layers);
        model.getMapLayersModel().disableAllLayers();
        model.getMapLayersModel().enableLayers(layers);
    }

}

Utils.extend(UIModeViewController, UIViewController);