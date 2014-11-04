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

    var _mapContainer;
    var _defaultZoom = 13;

    var _mapID = {
        aerial: 'macs91.k25dm9i2',
        map: 'krbalmryde.jk1dm68f'
    };
    var _mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    var _mapAttribution = '';

    // Make out Map-layer object, this is what contains the actual map itself
    var _mapTilesLayer;


    // Layers factory
    var _layersControllersFactory;
    // svg elements
    var _svgLayerGroup;

    /////////////////////////// PUBLIC METHODS ///////////////////////////


    /**
     * Handler for "VISUALIZATION_TYPE_CHANGED" notification.
     * Namely when the visualization type context changed, update map layers.
     */
    /*
    this.visualizationTypeChanged = function() {
        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layersViewControllers = _layersControllersFactory.getLayersControllers(visualizationType);

        // Remove all previous layers from the map
        cleanMap();

        // For each new layer controller class, instantiate the controller with a new layer group, and add that group
        // to the map
        layersViewControllers.forEach(function(Controller) {
            //var layerGroup = L.layerGroup();
            //_mapContainer.addLayer(layerGroup);
            //_layersControllers.push(new Controller(self, layerGroup));
            self.add(new Controller(self));
        });
    };*/

    /**
     * Handles LAYERS_STATUS_CHANGED notification
     */
    this.updateMap = function() {
        // Clean map
        cleanMap();

        // Draw layers
        var layersControllers = _layersControllersFactory.getMapLayers();

        layersControllers.forEach(function(Controller) {
            self.add(new Controller());
        });
    };


    /**
     * @override
     * @param childController
     */
    this.add = function(childController) {
        self.getChildren().push(childController);
        childController.setParentController(self);
        _svgLayerGroup.append(function(){return childController.getView().getSvg().node();});
        childController.viewDidAppear();
    };


    /**
     * @override
     * @param childController
     */
    var oldRemove = this.remove;    // Save super
    this.remove = function(childController) {
        //_mapContainer.removeLayer(childController.getLayerGroup());

        childController.dispose();

        // Call super
        oldRemove.call(self, childController);

        childController.getView().getSvg().remove();
    };



    this.onMapReset = function() {

        var topLeftCoord = model.getMapModel().getTopLeftCoordOfInterest();
        var bottomRightCoord = model.getMapModel().getBottomRightCoordOfInterest();

        //fixed points
        var topLeft = _mapContainer.latLngToLayerPoint(topLeftCoord);
        var bottomRight = _mapContainer.latLngToLayerPoint(bottomRightCoord);
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        //project at a fixed zoom level
        var viewBoxTopLeft = model.getMapModel().projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        var viewBoxBottomRight =  model.getMapModel().projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var viewBoxWidth = viewBoxBottomRight.x - viewBoxTopLeft.x;
        var viewBoxHeight = viewBoxBottomRight.y - viewBoxTopLeft.y;


        self.getView().setFrame(0,0,width,height);
        self.getView().setViewBox(0,0,viewBoxWidth,viewBoxHeight);
        self.getView().getSvg().style("top",topLeft.y + "px");
        self.getView().getSvg().style("left",topLeft.x + "px");

        _svgLayerGroup.attr("transform","translate(" + [-viewBoxTopLeft.x,-viewBoxTopLeft.y] + ")");

        //show again what's hidden in onZoomReset
        _svgLayerGroup.attr("opacity",1);
    };


    this.onZoomStart = function() {
        //when the zoom start hide everything
        _svgLayerGroup.attr("opacity",0);
    };


    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var cleanMap = function() {
        // Remove all children
        while(self.getChildren().length > 0) {
            self.remove(self.getChildren()[0]);
        }
    };


    var init = function() {
        _layersControllersFactory = new MapLayersFactory();

        // Initializing the _mapTilesLayer
        _mapTilesLayer = L.tileLayer(_mapURL, {
            id: _mapID.map,
            maxZoom: 20,
            attribution: _mapAttribution
        });

        // Draw the map container box
        _mapContainer = L.map(_htmlContainer.node(), {zoomControl: false});
        _mapContainer.setView(model.getMapModel().getDefaultFocusPoint(), _defaultZoom);

        var tileLayers = {
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
        _mapContainer.addLayer(tileLayers.map);

        //L.control.layers(tileLayers,[], {position: "topleft"}).addTo(_mapContainer);


        _svgLayerGroup = self.getView().getSvg().append("g");



        // SET MAP ON THE MODEL TO GET LEAFLET UTILITIES
        model.getMapModel().setMap(_mapContainer);



        // Bind MapViewController view to _mapContainer pane
        d3.select(_mapContainer.getPanes().overlayPane).append(function() {
            return self.getView().getSvg().node();
        });



        // Subscribe to notifications
        _mapContainer.on("viewreset", self.onMapReset);
        _mapContainer.on("zoomstart", self.onZoomStart);

        // call first map reset
        self.onMapReset();

        /*
        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
        self.visualizationTypeChanged();*/
        self.updateMap();
        notificationCenter.subscribe(self, self.updateMap, Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    } ();
}

// Inheritance
Utils.extend(MapViewController, UIViewController);