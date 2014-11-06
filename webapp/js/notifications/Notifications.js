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
    PATH_CLEANED : "com.divvy.areaOfInterest.pathCleaned"
};

/**
 * Notifications about the potholes
 * @type {{}}
 */
Notifications.potholes = {
    // Dispatched by the layer button
    LAYER_ADDED : "com.righthererightnow.potholes.layerAdded",
    LAYER_CLEANED: "com.righthererightnow.potholes.layerCleaned",
    // Dispatched by the model
    LAYER_UPDATED: "com.righthererightnow.potholes.layerUpdated"
}

/**
 * Notifications about the abandoned vehicles
 * @type {{}}
 */
Notifications.vehicles = {
    // Dispatched by the layer button
    LAYER_ADDED : "com.righthererightnow.vehicles.layerAdded",
    LAYER_CLEANED: "com.righthererightnow.vehicles.layerCleaned",
    // Dispatched by the model
    LAYER_UPDATED: "com.righthererightnow.vehicles.layerUpdated"
}

/**
 * Notifications about the lights out
 * @type {{}}
 */
Notifications.lights = {
    // Dispatched by the layer button
    LAYER_ADDED : "com.righthererightnow.lights.layerAdded",
    LAYER_CLEANED: "com.righthererightnow.lights.layerCleaned",
    // Dispatched by the model
    LAYER_UPDATED: "com.righthererightnow.lights.layerUpdated"
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
}
/**
 * Notifications about CTA buses
 * @type {{}}
 */
Notifications.cta = {
    TIME : "com.righthererightnow.cta.time",
    VECHICLES: "com.righthererightnow.cta.vechicles",
    STOPS: "com.righthererightnow.cta.stops"
};

