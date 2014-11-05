
function PotholesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;


    ////////////////////////// PUBLIC METHODS /////////////////////////
    this.layerStatusChanged = function () {

    };

    /**
     * Called after the view is added to the a parent view
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function(){

        // Call super
        super_viewDidAppear.call(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function() {
        self.getView().addClass("potholes-layer-view-controller");

        //TODO: do it when the button is clicked
        /*
        notificationCenter.subscribe(self, self.layersStatusChanged, Notifications.mapLayers.LAYERS_STATUS_CHANGED);
        self.layerStatusChanged();
        model.getPotholesModel().startUpdates();
        */
    } ();
}

Utils.extend(PotholesLayerViewController, MapLayerController);
