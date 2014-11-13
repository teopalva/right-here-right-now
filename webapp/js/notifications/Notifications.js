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
    MAP_POSITION_OR_ZOOM_CHANGED : "com.divvy.mapContainerController.mapPositionOrZoomChanged",
    ZOOM_CHANGED : "com.divvy.mapContainerController.mapZoomChanged"
};

Notifications.mapContainerController = {
    //Whenever a new map is open/closed
    MAP_CONFIGURATION_CHANGED : "com.divvy.mapContainerController.mapConfigurationChanged"

};

/**
 * Notifications about area of interest
 * @type {{}}
 */
Notifications.areaOfInterest = {
    POINT_ADDED_TO_PATH : "com.divvy.areaOfInterest.pointAddedToPath",
    POINTS_UPDATED : "com.divvy.areaOfInterest.pointsUpdated",
    PATH_CLEANED : "com.divvy.areaOfInterest.pathCleaned",
    PATH_UPDATED : "com.divvy.areaOfInterest.pathUpdated"
};

Notifications.newsfeed = {
    NEWS_POSTED : "com.divvy.newsfeed.newsPosted"
};

/**
 * Notifications about the potholes
 * @type {{}}
 */
Notifications.potholes = {
    LAYER_UPDATED: "com.righthererightnow.potholes.layerUpdated"
};

/**
 * Notifications about the abandoned vehicles
 * @type {{}}
 */
Notifications.vehicles = {
    LAYER_UPDATED: "com.righthererightnow.vehicles.layerUpdated"
}

/**
 * Notifications about the lights out
 * @type {{}}
 */
Notifications.lights = {
    LAYER_UPDATED: "com.righthererightnow.lights.layerUpdated"
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
    WEATHER_UPDATED : "com.divvy.weather.weatherUpdated"
};

/**
 * Notifications about map layers
 * @type {{}}
 */
Notifications.mapLayers = {
    LAYERS_STATUS_CHANGED : "com.righthererightnow.mapLayers.layersStatusChanged"
};

/**
 * Notifications about the time
 * @type {{}}
 */
Notifications.time = {
    CLOCK_UPDATED : "com.righthererightnow.time.clockUpdated",
    SUN_UPDATED : "com.righthererightnow.time.sunUpdated"
};

/**
 * Notifications about CTA buses
 * @type {{}}
 */
Notifications.cta = {
    // Dispatched by the layer button
    LAYER_ADDED : "com.righthererightnow.cta.layerAdded",
    LAYER_CLEANED: "com.righthererightnow.cta.layerCleaned",
    // Dispatched by the model
    LAYER_UPDATED: "com.righthererightnow.cta.layerUpdated",
    TIME : "com.righthererightnow.cta.time",
    VEHICLES: "com.righthererightnow.cta.vechicles",
    STOPS: "com.righthererightnow.cta.stops"
};

/**
 * Notifications about violentCrimes
 * @type {{}}
 */
Notifications.violentCrimes = {
    LAYER_UPDATED: "com.righthererightnow.violentCrimes.layerUpdated"
};

/**
 * Notifications about propertyCrimes
 * @type {{}}
 */
Notifications.propertyCrimes = {
    LAYER_UPDATED: "com.righthererightnow.propertyCrimes.layerUpdated"
};

/**
 * Notifications about qualityOfLifeCrimes
 * @type {{}}
 */
Notifications.qualityOfLifeCrimes = {
    LAYER_UPDATED: "com.righthererightnow.qualityOfLife.layerUpdated"
};

/**
 * Notifications about buttons events
 * @type {{}}
 */
Notifications.buttons = {
    NEW_TRIP_CLICKED : "com.righthererightnow.buttons.newTripClicked",
};
