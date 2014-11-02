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
        model = new Model();
        notificationCenter = new NotificationCenter();

        var body = d3.select("body");
        _mainWindowController = new UIWindowController(body);
    } ();
}

var model;
var notificationCenter;