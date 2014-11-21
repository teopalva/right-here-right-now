/**
 * @class MapOverlayViewController
 * @description
 *
 *
 * @constructor
 */
function MapOverlayViewController() {
    UIViewController.call(this);
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    var _padding = {top: 12.5, left: 12.5};

    // Controls
    var _dayViewController;
    var _dayViewSize = {width: 316.5, height: 283.5};
    
    var _tripInfoViewController;
    var _tripInfoViewSize = {width: 316.5, height: 160};
    
    var _newsFeedViewController;
    var _newsFeedViewSize = {width: 316.5, height: 336};
    
    var _modeViewController;
    var _modeViewSize = {width: 316.5, height: 328.5};
    
    var _mapControlViewController;
    //var _mapControlViewSize = {width: 316.5, height: 145};
    
    var _layersBarViewController;
    var _layersBarViewSize = {width: 340, height: 974};
    
    var _timeIntervalViewController;
    var _timeIntervalViewSize = {width: 142, height: 104.5};

    var _chartsAreaViewController;
    var _chartsAreaFrame = {
        x: (3750 - 1500) -12.5,
        y: 12.5,
        width: 1500,
        height: 975
    };

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {

        _dayViewController.getView().setFrame(_padding.left, _padding.top, _dayViewSize.width, _dayViewSize.height);
        _dayViewController.getView().setViewBox(0, 0, _dayViewSize.width, _dayViewSize.height);
        self.add(_dayViewController);
        
        /*_tripInfoViewController.getView().setFrame(_padding.left, 308.5, _tripInfoViewSize.width, _tripInfoViewSize.height);
        _tripInfoViewController.getView().setViewBox(0, 0, _tripInfoViewSize.width, _tripInfoViewSize.height);
        self.add(_tripInfoViewController);*/
        
        _newsFeedViewController.getView().setFrame(_padding.left, 308.5, _newsFeedViewSize.width, _newsFeedViewSize.height);
        _newsFeedViewController.getView().setViewBox(0, 0, _newsFeedViewSize.width, _newsFeedViewSize.height);
        self.add(_newsFeedViewController);
        
        _modeViewController.getView().setFrame(_padding.left, 657, _modeViewSize.width, _modeViewSize.height);
        _modeViewController.getView().setViewBox(0, 0, _modeViewSize.width, _modeViewSize.height);
        self.add(_modeViewController);
        
       /* _mapControlViewController.getView().setFrame(_padding.left, 841.5, _mapControlViewSize.width, _mapControlViewSize.height);
        _mapControlViewController.getView().setViewBox(0, 0, _mapControlViewSize.width, _mapControlViewSize.height);
        self.add(_mapControlViewController);*/
        
        _layersBarViewController.getView().setFrame(341.5, 12.5, _layersBarViewSize.width, _layersBarViewSize.height);
        _layersBarViewController.getView().setViewBox(0, 0, _layersBarViewSize.width, _layersBarViewSize.height);
        self.add(_layersBarViewController);

        _chartsAreaViewController.getView().setFrame(_chartsAreaFrame.x, _chartsAreaFrame.y, _chartsAreaFrame.width, _chartsAreaFrame.height);
        _chartsAreaViewController.getView().setViewBox(0, 0, _chartsAreaFrame.width, _chartsAreaFrame.height);
        self.add(_chartsAreaViewController);
        
        _timeIntervalViewController.getView().setFrame(1182.5, 882, _timeIntervalViewSize.width, _timeIntervalViewSize.height);
        _timeIntervalViewController.getView().setViewBox(0, 0, _timeIntervalViewSize.width, _timeIntervalViewSize.height);
        self.add(_timeIntervalViewController);

        addBehaviours();

        // Call super
        super_viewDidAppear.call(self);
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var addBehaviours = function() {

    };

    var init = function() {
        self.getView().addClass("map-overlay-view-controller");

        _dayViewController = new UIDayViewController();
        _tripInfoViewController = new UITripInfoViewController();
        _modeViewController = new UIModeViewController();
        _mapControlViewController = new UIMapControlViewController();
        _layersBarViewController = new UILayersBarViewController();
        _newsFeedViewController = new UINewsFeedViewController();
        _chartsAreaViewController = new UIChartsAreaViewController();
        _timeIntervalViewController = new UITimeIntervalViewController();

    } ();
}

Utils.extend(MapOverlayViewController, UIViewController);