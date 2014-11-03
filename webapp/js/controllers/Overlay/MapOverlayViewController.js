/**
 *
 * @constructor
 */
function MapOverlayViewController() {
    UIViewController.call(this);
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    var button;

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    /**
     *
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {
        button = new UIButtonViewController();
        button.getView().setFrame(0, 0, 200, 200);
        button.getView().setViewBox(0, 0, 200, 200);

        button.setTitle("CIAOOOO");
        self.add(button);

        addBehaviours();

        // Call super
        super_viewDidAppear.call(self);
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var addBehaviours = function() {
        button.onClick(function() {
            console.log("CIAO BELLLI");
        });
    };

    var init = function() {
        self.getView().addClass("map-overlay-view-controller");

    } ();
}

Utils.extend(MapOverlayViewController, UIViewController);