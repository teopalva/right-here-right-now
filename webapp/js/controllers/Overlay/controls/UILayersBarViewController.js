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
    
    var _p = {x: 20, y: 20, w: 190.5, h: 55};
    var _verticalPadding = 65;


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
        _potholesButton.onClick(function(d){
            invertSelection(_potholesButton);
            model.getPotholesModel().startUpdates();
            //notificationCenter.subscribe(self, self.layersStatusChanged, Notifications.mapLayers.LAYERS_STATUS_CHANGED);
            //self.layerStatusChanged();
            //model.getPotholesModel().startUpdates();
        });
        self.add(_potholesButton);
        
         // Button 2
        _CTAButton.getView().setFrame(_p.x, _p.y + _verticalPadding*1, _p.w, _p.h);
        _CTAButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _CTAButton.setTitle("CTA");
        _CTAButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        _CTAButton.setImage("/webapp/assets/icon/layers_icons/CTA.png");
        _CTAButton.onClick(function(d){
            invertSelection(_CTAButton);
        });
        self.add(_CTAButton);
        
         // Button 3
        _crimeButton.getView().setFrame(_p.x, _p.y + _verticalPadding*2, _p.w, _p.h);
        _crimeButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _crimeButton.setTitle("Crime");
        _crimeButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        _crimeButton.onClick(function(d){
            invertSelection(_crimeButton);
        });
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
        _CTAButton = new UIButtonViewController;
        _crimeButton = new UIButtonViewController;

    }();
    
    var invertSelection = function(button) {
        if (button.isSelected()) {
            button.deselect();
            button.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        } else {
            button.select();
            button.getView().setBackgroundColor(model.getThemeModel().selectedButtonColor());
        }
    };
    
}

Utils.extend(UILayersBarViewController, UIViewController);