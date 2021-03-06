/**
 * @namespace Notifications
 * @description Notifications is the namespace for every notification that the application has to deal with.
 * Ideally each components that has to publish notifications should define here its own notifications under
 * its sub-namespace.
 */
var Notifications = Notifications || {};


/**
 * VisualizationModuleController notifications sub-namespace
 */
Notifications.mapController = {
    //whenever a map change its position / zoom
    MAP_POSITION_OR_ZOOM_CHANGED: "com.divvy.mapContainerController.mapPositionOrZoomChanged",
    ZOOM_CHANGED: "com.divvy.mapContainerController.mapZoomChanged"
};

Notifications.mapContainerController = {
    //Whenever a new map is open/closed
    MAP_CONFIGURATION_CHANGED: "com.divvy.mapContainerController.mapConfigurationChanged"

};

/**
 * Notifications about area of interest
 * @type {{}}
 */
Notifications.areaOfInterest = {
    POINT_ADDED_TO_PATH: "com.divvy.areaOfInterest.pointAddedToPath",
    POINTS_UPDATED: "com.divvy.areaOfInterest.pointsUpdated",
    PATH_CLEANED: "com.divvy.areaOfInterest.pathCleaned",
    PATH_UPDATED: "com.divvy.areaOfInterest.pathUpdated",
    DIRECTIONS_UPDATED: "com.divvy.areaOfInterest.directionsUpdated"
};

Notifications.newsfeed = {
    NEWS_POSTED: "com.divvy.newsfeed.newsPosted"
};

/**
 * Notifications about the potholes
 * @type {{}}
 */
Notifications.potholes = {
    SELECTION_UPDATED: "com.righthererightnow.potholes.selectionUpdated"
};

/**
 * Notifications about the abandoned vehicles
 * @type {{}}
 */
Notifications.vehicles = {
    SELECTION_UPDATED: "com.righthererightnow.vehicles.selectionUpdated"
}

/**
 * Notifications about the lights out
 * @type {{}}
 */
Notifications.lights = {
    SELECTION_UPDATED: "com.righthererightnow.lights.selectionUpdated"
}

/**
 * Notifications about the divvy bikes
 * @type {{}}
 */
Notifications.divvyBikes = {
    LAYER_UPDATED: "com.righthererightnow.divvyBikes.layerUpdated"
}

/**
 * Notifications about weather
 * @type {{}}
 */
Notifications.weather = {
    WEATHER_UPDATED: "com.divvy.weather.weatherUpdated"
};

/**
 * Notifications about map layers
 * @type {{}}
 */
Notifications.mapLayers = {
    LAYERS_STATUS_CHANGED: "com.righthererightnow.mapLayers.layersStatusChanged"
};

/**
 * Notifications about the time
 * @type {{}}
 */
Notifications.time = {
    CLOCK_UPDATED : "com.righthererightnow.time.clockUpdated",
    SUN_UPDATED : "com.righthererightnow.time.sunUpdated",
    TEMPORAL_SCOPE_CHANGED : "com.righthererightnow.time.temporalScope"
};

/**
 * Notifications about CTA buses
 * @type {{}}
 */
Notifications.cta = {
    // Dispatched by the layer button
    LAYER_ADDED: "com.righthererightnow.cta.layerAdded",
    LAYER_CLEANED: "com.righthererightnow.cta.layerCleaned",
    // Dispatched by the model
    LAYER_UPDATED: "com.righthererightnow.cta.layerUpdated",
    TIME: "com.righthererightnow.cta.time",
    VEHICLES: "com.righthererightnow.cta.vechicles",
    STOPS: "com.righthererightnow.cta.stops",
    ROUTES_PATHS: "com.righthererightnow.cta.routesPaths",
    ROUTES_PATHS_LOADED: "com.righthererightnow.cta.routesPathsLoaded",
    TRAIN_STATIONS: "com.righthererihgtnow.cta.trainStations",
    BUS_STOP_PREDICTIONS: "com.righthererightnow.cta.busPredictions",
    TRAIN_STOP_PREDICTIONS: "com.righthererightnow.cta.trainPredictions"

};

Notifications.crimes = {
    SELECTION_UPDATED : "com.righthererightnow.crimes.SeletionUpdated",
    DATA_CHANGED : "com.righthererightnow.crimes.DataChanged"
};

/**
 * Notifications about buttons events
 * @type {{}}
 */
Notifications.buttons = {
    NEW_TRIP_CLICKED: "com.righthererightnow.buttons.newTripClicked"
};

/**
 * Popups
 * @type {{}}
 */
Notifications.popups = {
    POPUPS_CHANGED: "com.righthererightnow.popups.popupsChanged"
}

/**
 *
 * @type {{}}
 */
Notifications.passedRestaurants = {
    LAYER_UPDATED: "com.righthererightnow.passedRestaurants.layerUpdated"
}

/**
 *
 * @type {{}}
 */
Notifications.failedRestaurants = {
    LAYER_UPDATED: "com.righthererightnow.failedRestaurants.layerUpdated"
}

Notifications.twitter = {
    TWEET_DETAIL_REQUESTED: "com.righthererightnow.twitter.tweetDetailRequested"
}

Notifications.turistAttractions ={
    DATA_CHANGED : "com.righthererightnow.twitter.dataChanged"
}