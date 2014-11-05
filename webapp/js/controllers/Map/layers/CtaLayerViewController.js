/***
 * @class CtaLayerViewController
 * @description Layer of CTA buses lines and stops.
 *
 * @constructor
 */
function CtaLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    //////////////////////// PUBLIC METHODS ////////////////////////
    this.timeChanged = function() {
        var time = model.getCtaModel().getCtaTime();
        console.log(time);
    };

    this.vehiclesChanged = function() {
        var vehicles = model.getCtaModel().getVehicles();
        console.log("Vehicles");
        console.log(vehicles);
    };

    this.stopsChanged = function() {
        var stops = model.getCtaModel().getStops();
        console.log("Stops");
        console.log(stops);
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.timeChanged, Notifications.cta.TIME);
        notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VECHICLES);



        model.getCtaModel().startUpdates();
    } ();

}