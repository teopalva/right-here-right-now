/**
 * @class: App
 * @description application delegate
 */
function App() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _mainWindowController;



    ////////////////////////// PUBLIC METHODS //////////////////////////



    ////////////////////////// PRIVATE METHODS //////////////////////////
    /**
     * Initialization stuffs
     */
    var init = function() {
        notificationCenter = new NotificationCenter();
        model = new Model();

        var body = d3.select("body");
        _mainWindowController = new UIWindowController(body);
    } ();
}

var model;
var notificationCenter;