/**
 * @class MapViewController
 * @description this view controller takes care of displaying the map and react to visualization context changes
 * by updating map layers
 *
 * @param htmlContainer
 */
function MapViewController(htmlContainer) {
    // Call the base class constructor
    UIViewController.call(this);

    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;

    var _htmlContainer = htmlContainer;

    var _defaultZoom = 13;

    var _mapContainer;

    var _mapID = {
        aerial: 'macs91.k25dm9i2',
        map: 'krbalmryde.jk1dm68f'
    };
    var _mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    var _mapAttribution = '';

    // Make out Map-layer object, this is what contains the actual map itself
    var _mapTilesLayer;
    var _tileLayers;


    // Layers factory
    var _layersControllersFactory;
    // svg elements
    var _svgLayerGroup;




    /////////////////////////// PUBLIC METHODS ///////////////////////////

    /**
     * Handles LAYERS_STATUS_CHANGED notification
     */
    this.updateMap = function () {
        // Current layers
        var currentLayers = self.getChildren();

        // Draw layers
        var layersControllers = _layersControllersFactory.getMapLayers();

        // Remove inactive layers
        var active;
        for(var j = currentLayers.length -1; j >= 0; j--) {
            active = false;
            var i = 0;
            while(i < layersControllers.length && !active) {
                if(currentLayers[j] instanceof layersControllers[i]) {
                    active = true;
                }
                i++;
            }
            if(!active) {
                self.remove(currentLayers[j]);
            }
        }

        // Add new active layers
        layersControllers.forEach(function (Controller) {
            active = false;
            var i = 0;
            while(i < currentLayers.length && !active) {
                if(currentLayers[i] instanceof Controller) {
                    active = true;
                }
                i++;
            }
            if(!active) {
                self.add(new Controller());
            }
        });
    };


    /**
     * @override
     * @param childController
     */
    this.add = function (childController) {
        self.getChildren().push(childController);
        childController.setParentController(self);
        _svgLayerGroup.append(function () {
            return childController.getView().getSvg().node();
        });
        childController.viewDidAppear();
    };


    /**
     * @override
     * @param childController
     */
    var oldRemove = this.remove; // Save super
    this.remove = function (childController) {
        //_mapContainer.removeLayer(childController.getLayerGroup());

        childController.dispose();

        // Call super
        oldRemove.call(self, childController);

        childController.getView().getSvg().remove();
    };



    this.onMapReset = function () {

        var topLeftCoord = model.getMapModel().getTopLeftCoordOfInterest();
        var bottomRightCoord = model.getMapModel().getBottomRightCoordOfInterest();

        //fixed points
        var topLeft = _mapContainer.latLngToLayerPoint(topLeftCoord);
        var bottomRight = _mapContainer.latLngToLayerPoint(bottomRightCoord);
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        //project at a fixed zoom level
        //var viewBoxTopLeft = model.getMapModel().projectAtDefaultZoom(topLeftCoord.lat, topLeftCoord.lng);
        //var viewBoxBottomRight = model.getMapModel().projectAtDefaultZoom(bottomRightCoord.lat, bottomRightCoord.lng);
        var viewBoxTopLeft = model.getMapModel().projectAtCurrentZoom(topLeftCoord.lat, topLeftCoord.lng);
        var viewBoxBottomRight = model.getMapModel().projectAtCurrentZoom(bottomRightCoord.lat, bottomRightCoord.lng);
        var viewBoxWidth = viewBoxBottomRight.x - viewBoxTopLeft.x;
        var viewBoxHeight = viewBoxBottomRight.y - viewBoxTopLeft.y;

        console.log("vbw= " + viewBoxWidth);
        console.log("vbh= " + viewBoxHeight);

        self.getView().setFrame(0, 0, width, height);
        self.getView().setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
        self.getView().getSvg().style("top", topLeft.y + "px");
        self.getView().getSvg().style("left", topLeft.x + "px");

        _svgLayerGroup.attr("transform", "translate(" + [-viewBoxTopLeft.x, -viewBoxTopLeft.y] + ")");

        //show again what's hidden in onZoomReset
        _svgLayerGroup.attr("opacity", 1);
    };


    this.onZoomStart = function () {
        //when the zoom start hide everything
        _svgLayerGroup.attr("opacity", 0);
    };



    /////////////////////////// PRIVATE METHODS ///////////////////////////


    var init = function () {
        _layersControllersFactory = new MapLayersFactory();

        // Initializing the _mapTilesLayer
        _mapTilesLayer = L.tileLayer(_mapURL, {
            id: _mapID.map,
            maxZoom: 20,
            attribution: _mapAttribution
        });

        // Draw the map container box
        _mapContainer = L.map(_htmlContainer.node(), {
            zoomControl: false
        });
        _mapContainer.setView(model.getMapModel().getDefaultFocusPoint(), _defaultZoom);

        _tileLayers = {
            aerial: L.tileLayer(_mapURL, {
                id: _mapID.aerial,
                maxZoom: 20,
                attribution: _mapAttribution
            }),
            map: L.tileLayer(_mapURL, {
                id: _mapID.map,
                maxZoom: 20,
                attribution: _mapAttribution
            })
        };

        // Add the base map layer to the map container box
        _mapContainer.addLayer(_tileLayers.map);

        //L.control.layers(_tileLayers,[], {position: "topleft"}).addTo(_mapContainer);

        _svgLayerGroup = self.getView().getSvg().append("g");

        // SET MAP ON THE MODEL TO GET LEAFLET UTILITIES
        model.getMapModel().setMap(_mapContainer);

        // Bind MapViewController view to _mapContainer pane
        d3.select(_mapContainer.getPanes().overlayPane).append(function () {
            return self.getView().getSvg().node();
        });

        model.getMapModel().setMapContainer(_mapContainer);
        model.getMapModel().setTileLayers(_tileLayers);

        // Subscribe to notifications
        _mapContainer.on("viewreset", self.onMapReset);
        _mapContainer.on("zoomstart", self.onZoomStart);

        // call first map reset
        self.onMapReset();


        self.updateMap();
        notificationCenter.subscribe(self, self.updateMap, Notifications.mapLayers.LAYERS_STATUS_CHANGED);

    }();
}

// Inheritance
Utils.extend(MapViewController, UIViewController);