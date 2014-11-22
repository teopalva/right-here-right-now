/**
 * @class: NotificationCenter
 * @description Implements a publish subscribe pattern.
 * @author: Massimo De Marchi
 */
function NotificationCenter () {
    ////////////////////////////////// PRIVATE ATTRIBUTES //////////////////////////////////
    var self = this;

    var _observers;






    ////////////////////////////////// PUBLIC METHODS //////////////////////////////////
    /**
     * Dispatches a given notification to all subscribers of that notification
     * @param notification
     */
    this.dispatch = function(notification) {
        if (_observers[notification] != undefined) {
            _observers[notification].forEach(function(observer) {
                observer.handler.apply();
            });
        }
    };

    /**
     * Subscribe an observer to a given notification registering the observer callback to handle the notification
     * @param observer
     * @param callBack
     * @param notification
     */
    this.subscribe = function(observer, callBack, notification) {

        if(!callBack) {
            console.log("try to subscribe without valid callback");
        }

        if (_observers[notification] == undefined) {
            _observers[notification] = [];
        }

        _observers[notification].push({
            target: observer,
            handler: callBack
        });
    };


    /**
     * Unsuscribe an observer from all notifications
     * @param observer
     */
    this.unsuscribeFromAll = function(observer) {
        for(var key in _observers) {
            _observers[key] = _observers[key].filter(function(obs) {
                return obs.target !== observer;
            });
        }
    };

    this.getObserversList = function() {
        return _observers;
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
        _observers = {};
    } ();
}

var sharedNotificationCenter = sharedNotificationCenter || new NotificationCenter();
