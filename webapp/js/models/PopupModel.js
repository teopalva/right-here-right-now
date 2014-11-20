/**
 * @description
 * @constructor
 */
function PopupModel() {

    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////

    var self = this;

    var _popups = [];

    ///////////////////////// PUBLIC METHODS /////////////////////////////

    this.addPopup = function(dictionary) {
        _popups.push(dictionary);
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.removePopup = function(dictionary) {
        var index = _popups.indexOf(dictionary);
        _popups.splice(index,1);
        notificationCenter.dispatch(Notifications.popups.POPUPS_CHANGED);
    };

    this.getPopups = function() {
        return _popups;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

    var init = function() {

    } ();
}


var PopupsType = {
    CRIME : "crimes",
    POTHOLES : "potholes",
    LIGHTS : "lights",
    DIVVY_BIKES : "divvy_bikes",
    VEHICLES : "vehicles",
    PASSED_RESTAURANTS : "passedRestaurants"
};