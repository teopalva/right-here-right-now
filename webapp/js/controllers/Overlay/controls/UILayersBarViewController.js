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
        w: 300,
        h: 50
    };

    var _margin = 4;
    var _verticalPadding = _p.h + _margin;

    var _bindings = [

        {
            title: "Trasport",
            label: new UILabelViewController(),
            elements: [{
                    title: "CTA bus",
                    button: new UIButtonViewController(),
                    layers: [Layers.CTA_STOPS, Layers.CTA_BUSES]
            },
                {
                    title: "CTA train",
                    button: new UIButtonViewController(),
                    layers: [Layers.CTA_TRAINS]
            },
                {
                    title: "Divvy Bikes",
                    button: new UIButtonViewController(),
                    layers: [Layers.DIVVY_BIKES]
            }]
        },

        {
            title: "Street Issues",
            label: new UILabelViewController(),
            elements: [{
                title: "Potholes",
                button: new UIButtonViewController(),
                layers: [Layers.POTHOLES]
            }, {
                title: "Abandoned Vehicles",
                button: new UIButtonViewController(),
                layers: [Layers.VEHICLES]
            }, {
                title: "Streets Lights Out",
                button: new UIButtonViewController(),
                layers: [Layers.LIGHTS]
            }]
        },

        {
            title: "Crimes",
            label: new UILabelViewController(),
            elements: [{
                title: "Violent Crimes",
                button: new UIButtonViewController(),
                layers: [Layers.VIOLENT_CRIMES]
            }, {
                title: "Property Crimes",
                button: new UIButtonViewController(),
                layers: [Layers.PROPERTY_CRIMES]
            }, {
                title: "Quality-of-life Crimes",
                button: new UIButtonViewController(),
                layers: [Layers.QUALITY_OF_LIFE_CRIMES]
            }]
        },

        {
            title: "Places of Interest",
            label: new UILabelViewController(),
            elements: [{
                title: "PassedRestaurants",
                button: new UIButtonViewController(),
                layers: [Layers.PASSED_RESTAURANTS, Layers.FAILED_RESTAURANTS]
            }, {
                title: "Bars",
                button: new UIButtonViewController(),
                layers: [Layers.CRIMES]
            }, {
                title: "Stores",
                button: new UIButtonViewController(),
                layers: [Layers.CRIMES]
            }]
        }
    ];

    /////////////////////  PUBLIC METHODS /////////////////////

    /**
     * Handler method for LAYERS_STATUS_CHANGED notification
     */
    this.layerStatusChanged = function () {
        _bindings.forEach(function (category) {
            category.elements.forEach(function (layer) {

                var color;
                var allActive = model.getMapLayersModel().areAllLayersActive(layer.layers);

                color = allActive ? model.getThemeModel().selectedButtonColor(layer.title) : model.getThemeModel().deselectedButtonColor();

                layer.button.getView().setBackgroundColor(color);
            });
        });
    };

    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;

    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();

        var tot = 0;

        _bindings.forEach(function (category, i) {
            var label = category.label;
            label.setText(category.title);
            label.setTextSize(30);
            label.setTextColor("white");
            label.setTextAlignment("left");
            label.getView().setFrame(_p.x, _p.y + _verticalPadding * (tot) + _margin, _p.w, _p.h);
            label.getView().setViewBox(0, 0, _p.w, _p.h);

            category.elements.forEach(function (layer, j) {

                tot++;
                layer.button.setTitle(layer.title);
                layer.button.getView().setFrame(_p.x, _p.y + _verticalPadding * (tot), _p.w, _p.h);
                layer.button.getView().setViewBox(0, 0, _p.w, _p.h);

                layer.button.onClick(function (layers) {
                    if (model.getMapLayersModel().areAllLayersActive(layers)) {
                        model.getMapLayersModel().disableLayers(layers);
                    } else {
                        model.getMapLayersModel().enableLayers(layers);
                    }
                }, layer.layers);

                self.add(layer.button);
            });

            tot++;

            self.add(category.label);
        });

        self.layerStatusChanged();

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-layers-bar-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        //notificationCenter.subscribe(self, self.deselectAll, Notifications.buttons.NEW_TRIP_CLICKED);
        notificationCenter.subscribe(self, self.layerStatusChanged, Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    }();

}

Utils.extend(UILayersBarViewController, UIViewController);