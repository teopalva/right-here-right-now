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

    var _p = {
        x: 20,
        y: 20,
        w: 260,
        h: 55
    };
    var _verticalPadding = 65;

    var _bindings = [
        {
            title: "Potholes",
            button: new UIButtonViewController(),
            layers: [Layers.POTHOLES]
        },
        {
            title: "Abandoned Vehicles",
            button: new UIButtonViewController(),
            layers: [Layers.VEHICLES]
        },
        {
            title: "Streets Lights Out",
            button: new UIButtonViewController(),
            layers: [Layers.LIGHTS]
        },
        {
            title: "Divvy Bikes",
            button: new UIButtonViewController(),
            layers: [Layers.DIVVY_BIKES]
        },
        {
            title: "CTA",
            button: new UIButtonViewController(),
            layers: [Layers.CTA_STOPS, Layers.CTA_BUSES]
        },
        {
            title: "Crimes",
            button: new UIButtonViewController(),
            layers: [Layers.VIOLENT_CRIMES]
        }
    ];

    /////////////////////  PUBLIC METHODS /////////////////////

    /**
     * Handler method for LAYERS_STATUS_CHANGED notification
     */
    this.layerStatusChanged = function() {
        _bindings.forEach(function(layerGroup) {

            var color;
            var allActive = model.getMapLayersModel().areAllLayersActive(layerGroup.layers);

            color = allActive ? model.getThemeModel().selectedButtonColor() : model.getThemeModel().deselectedButtonColor();

            layerGroup.button.getView().setBackgroundColor(color);
        });
    };

    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();

        _bindings.forEach(function(layerGroup, i) {
            layerGroup.button.setTitle(layerGroup.title);
            layerGroup.button.getView().setFrame(_p.x, _p.y + _verticalPadding * i, _p.w, _p.h);
            layerGroup.button.getView().setViewBox(0, 0, _p.w, _p.h);

            layerGroup.button.onClick(function(layers) {
                if(model.getMapLayersModel().areAllLayersActive(layers)) {
                    model.getMapLayersModel().disableLayers(layers);
                } else {
                    model.getMapLayersModel().enableLayers(layers);
                }
            }, layerGroup.layers);
            self.add(layerGroup.button);
        });

        self.layerStatusChanged();
        // Button 1
        /*
        _potholesButton.getView().setFrame(_p.x, _p.y, _p.w, _p.h);
        _potholesButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _potholesButton.setTitle("Potholes");
        _potholesButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        _potholesButton.onClick(function (d) {
            invertSelection(_potholesButton, "potholes");
        });
        self.add(_potholesButton);

        // Button 2
        _abandonedButton.getView().setFrame(_p.x, _p.y + _verticalPadding * 1, _p.w, _p.h);
        _abandonedButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _abandonedButton.setTitle("Abandoned Vehicles");
        _abandonedButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        //_abandonedButton.setImage("/webapp/assets/icon/layers_icons/CTA.png");
        _abandonedButton.onClick(function (d) {
            invertSelection(_abandonedButton, "vehicles");
        });
        self.add(_abandonedButton);

        // Button 3
        _lightsButton.getView().setFrame(_p.x, _p.y + _verticalPadding * 2, _p.w, _p.h);
        _lightsButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _lightsButton.setTitle("Street Lights Out");
        _lightsButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        //_lightsButton.setImage("/webapp/assets/icon/layers_icons/CTA.png");
        _lightsButton.onClick(function (d) {
            invertSelection(_lightsButton, "lights");
        });
        self.add(_lightsButton);

        // Button 4
        _divvyButton.getView().setFrame(_p.x, _p.y + _verticalPadding * 3, _p.w, _p.h);
        _divvyButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _divvyButton.setTitle("Divvy Bikes");
        _divvyButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        //_divvyButton.setImage("/webapp/assets/icon/layers_icons/CTA.png");
        _divvyButton.onClick(function (d) {
            invertSelection(_divvyButton, "divvyBikes");
        });
        self.add(_divvyButton);

        // Button 5
        _CTAButton.getView().setFrame(_p.x, _p.y + _verticalPadding * 4, _p.w, _p.h);
        _CTAButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _CTAButton.setTitle("CTA");
        _CTAButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        _CTAButton.setImage("/webapp/assets/icon/layers_icons/CTA.png");
        _CTAButton.onClick(function (d) {
            invertSelection(_CTAButton, "cta");
        });
        self.add(_CTAButton);

        // Button 6
        _crimeButton.getView().setFrame(_p.x, _p.y + _verticalPadding * 5, _p.w, _p.h);
        _crimeButton.getView().setViewBox(0, 0, _p.w, _p.h);
        _crimeButton.setTitle("Crime");
        _crimeButton.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
        _crimeButton.onClick(function (d) {
            invertSelection(_crimeButton, "violentCrimes");
        });
        self.add(_crimeButton);*/

        // Call super
        super_viewDidAppear.call(self);
    };

    /*
     *  Deselect all buttons and clean all layers
     */
    /*
    this.deselectAll = function () {
        for (var b in _buttons) {
            _buttons[b].button.deselect();
            _buttons[b].button.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
            notificationCenter.dispatch(Notifications[_buttons[b].layerName].LAYER_CLEANED);
        }
    };*/

    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-layers-bar-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        /*
        _potholesButton = new UIButtonViewController;
        _buttons.push({
            button: _potholesButton,
            layerName: "potholes"
        });
        _abandonedButton = new UIButtonViewController;
        _buttons.push({
            button: _abandonedButton,
            layerName: "vehicles"
        });
        _lightsButton = new UIButtonViewController;
        _buttons.push({
            button: _lightsButton,
            layerName: "lights"
        });
        _divvyButton = new UIButtonViewController;
        _buttons.push({
            button: _divvyButton,
            layerName: "divvyBikes"
        });
        _CTAButton = new UIButtonViewController;
        _buttons.push({
            button: _CTAButton,
            layerName: "cta"
        });
        _crimeButton = new UIButtonViewController;
        _buttons.push({
            button: _crimeButton,
            layerName: "violentCrimes"
        });*/

        //notificationCenter.subscribe(self, self.deselectAll, Notifications.buttons.NEW_TRIP_CLICKED);
        notificationCenter.subscribe(self, self.layerStatusChanged, Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    }();

    /*
    var invertSelection = function (button, layerName) {
        if (button.isSelected()) {
            button.deselect();
            button.getView().setBackgroundColor(model.getThemeModel().deselectedButtonColor());
            notificationCenter.dispatch(Notifications[layerName].LAYER_CLEANED);
        } else {
            button.select();
            button.getView().setBackgroundColor(model.getThemeModel().selectedButtonColor());
            notificationCenter.dispatch(Notifications[layerName].LAYER_ADDED);
        }
    };*/

}

Utils.extend(UILayersBarViewController, UIViewController);