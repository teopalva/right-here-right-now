/**
 * @class UITripInfoViewController
 * @description ..
 *
 * @constructor
 */
function UILayersBarViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;
    
    var _p = {x: 20, y: 20, w: 170.5, h: 51};
    var _verticalPadding = 61;


    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();
        
        // Button 1
        _potholesButton.getView().setFrame(_p.x, _p.y, _p.w, _p.h);
        _potholesButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _potholesButton.setTitle("Potole!");
        _potholesButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        self.add(_potholesButton);
        
         // Button 2
        _trafficLightsButton.getView().setFrame(_p.x, _p.y + _verticalPadding*1, _p.w, _p.h);
        _trafficLightsButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _trafficLightsButton.setTitle("Traffic Lights");
        _trafficLightsButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        self.add(_trafficLightsButton);
        
         // Button 3
        _crimeButton.getView().setFrame(_p.x, _p.y + _verticalPadding*2, _p.w, _p.h);
        _crimeButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _crimeButton.setTitle("Crime");
        _crimeButton.getView().setBackgroundColor(model.getThemeModel().selectedButtonColor());
        self.add(_crimeButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-layers-bar-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _potholesButton = new UIButtonViewController;
        _trafficLightsButton = new UIButtonViewController;
        _crimeButton = new UIButtonViewController;

    }();
}

Utils.extend(UILayersBarViewController, UIViewController);