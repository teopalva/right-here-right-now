/**
 * @class UIDayViewController
 * @description ..
 *
 * @constructor
 */
function UIDayViewController() {
    UIViewController.call(this);
    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    // Labels that holds date information
    var _dateLabel;

    // Labels that holds time information
    var _timeLabel;

    // Weather icon
    var _weatherImage;

    // Label that holds sunrise information
    var _sunriseLabel;

    // Label that holds sunset information
    var _sunsetLabel;

    var _tempLabelF;

    var _tempLabelC;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * Handler method for WEATHER_UPDATED notification
     */
    this.weatherUpdated = function() {
        var conditions = model.getWeatherModel().getCurrentConditions();
        _weatherImage.setImagePath("assets/images/weather/" + weatherIconMapping[conditions].day);
        _tempLabelF.setText("Temp : " + model.getWeatherModel().getCurrentFahrenheitTemperature() + " F");
        _tempLabelC.setText("Temp : " + model.getWeatherModel().getCurrentCelsiusTemperature() + " C");
    };

    /**
     * Handler method for the CLOCK
     */
    this.clockUpdated = function(){
        var time = model.getTimeModel().getCurrentDate();
        _dateLabel.setText(model.getTimeModel().getCurrentDate().toDateString());
        _timeLabel.setText(time.getHours() + ":" + toTwoDigits(time.getMinutes()));
    };

    /**
     * Handler method for the SUN
     */
    this.sunUpdated = function(){
        _sunriseLabel.setText("Sunrise : " + model.getTimeModel().getSunriseTime());
        _sunsetLabel.setText("Sunset : " + model.getTimeModel().getSunsetTime());
    }

    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {
        var toolViewBox = self.getView().getViewBox();

        // Date label
        var labelHeight = toolViewBox.height / 10;
        var padding = 20;
        _dateLabel.getView().setFrame(0, padding, toolViewBox.width, labelHeight);
        _dateLabel.getView().setViewBox(0, 0, toolViewBox.width, labelHeight);
        _dateLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _dateLabel.setTextSize(model.getThemeModel().bigTextSize());
        self.add(_dateLabel);

        // Time label
        _timeLabel.getView().setFrame(0, labelHeight + padding, toolViewBox.width, labelHeight);
        _timeLabel.getView().setViewBox(0, 0, toolViewBox.width, toolViewBox.height / 10);
        _timeLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _timeLabel.setTextSize(model.getThemeModel().bigTextSize());
        self.add(_timeLabel);

        // Setup weather icon
        _weatherImage.getView().setFrame(102.5, 105, 113, 113);
        _weatherImage.getView().setViewBox(0, 0, 113, 113);
        self.add(_weatherImage);

        // Sunrise label
        _sunriseLabel.getView().setFrame(0.05, 208, 144, 35);
        _sunriseLabel.getView().setViewBox(0, 0, 144, 35);
        _sunriseLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _sunriseLabel.setTextSize(model.getThemeModel().mediumTextSize());
        _sunriseLabel.setTextAlignment(TextAlignment.LEFT);
        self.add(_sunriseLabel);

        // Sunset label
        _sunsetLabel.getView().setFrame(0.05, 243, 144, 35);
        _sunsetLabel.getView().setViewBox(0, 0, 144, 35);
        _sunsetLabel.setTextColor(model.getThemeModel().defaultToolTextColor());
        _sunsetLabel.setTextSize(model.getThemeModel().mediumTextSize());
        _sunsetLabel.setTextAlignment(TextAlignment.LEFT);
        self.add(_sunsetLabel);

        // TempF label
        _tempLabelF.getView().setFrame(172,208,144,35);
        _tempLabelF.getView().setViewBox(0,0,144,35);
        _tempLabelF.setTextColor(model.getThemeModel().defaultToolTextColor());
        _tempLabelF.setTextSize(model.getThemeModel().mediumTextSize());
        _tempLabelF.setTextAlignment(TextAlignment.RIGHT);
        self.add(_tempLabelF);


        // TempC label
        _tempLabelC.getView().setFrame(172,243,144,35);
        _tempLabelC.getView().setViewBox(0,0,144,35);
        _tempLabelC.setTextColor(model.getThemeModel().defaultToolTextColor());
        _tempLabelC.setTextSize(model.getThemeModel().mediumTextSize());
        _tempLabelC.setTextAlignment(TextAlignment.RIGHT);
        self.add(_tempLabelC);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    /**
     * Returns a two digits string when minutes < 10
     * Example: 10:3 becomes 10:03
     * @param minutes
     * @returns {string}
     */
    var toTwoDigits = function(minutes){
        return ( minutes<10?'0':'') + minutes;
    };

    var init = function() {
        self.getView().addClass("ui-day-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _dateLabel = new UILabelViewController();
        _timeLabel = new UILabelViewController();
        _sunriseLabel = new UILabelViewController();
        _sunsetLabel = new UILabelViewController();
        _tempLabelF = new UILabelViewController();
        _tempLabelC = new UILabelViewController();

        // Weather icon
        _weatherImage = new UIImageViewController();

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.weatherUpdated, Notifications.weather.WEATHER_UPDATED);
        notificationCenter.subscribe(self, self.clockUpdated, Notifications.time.CLOCK_UPDATED);
        notificationCenter.subscribe(self, self.sunUpdated, Notifications.time.SUN_UPDATED);

        // Start updates
        model.getWeatherModel().startUpdates();
        model.getTimeModel().startUpdates();
    } ();
}

Utils.extend(UIDayViewController, UIViewController);

var weatherIconMapping = {
    "Drizzle" : {day:"Cloud-Drizzle-Sun.svg", night:"Cloud-Drizzle-Moon.svg"},
    "Light Drizzle" : {day:"Cloud-Drizzle-Sun-Alt.svg", night:"Cloud-Drizzle-Moon-Alt.svg"},
    "Heavy Drizzle" : {day:"Cloud-Drizzle-Sun-Alt.svg", night:"Cloud-Drizzle-Moon-Alt.svg"},
    "Rain" : {day:"Cloud-Rain.svg", night:"Cloud-Rain.svg"},
    "Light Rain" : {day:"Cloud-Rain.svg", night:"Cloud-Rain.svg"},
    "Heavy Rain" : {day:"Cloud-Rain.svg", night:"Cloud-Rain.svg"},
    "Snow" : {day:"Cloud-Snow-Sun.svg", night:"Cloud-Snow-Moon.svg"},
    "Light Snow" : {day:"Cloud-Snow-Sun.svg", night:"Cloud-Snow-Moon.svg"},
    "Heavy Snow" : {day:"Cloud-Snow-Sun-Alt.svg", night:"Cloud-Snow-Moon-Alt.svg"},
    "Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Snow Grains" : {day:"weather4.svg", night:"weather4.svg"},
    "Ice Crystals" : {day:"Cloud-Snow-Sun.svg", night:"Cloud-Snow-Moon.svg"},
    "Light Ice Crystals" : {day:"Cloud-Snow-Sun.svg", night:"Cloud-Snow-Moon.svg"},
    "Heavy Ice Crystals" : {day:"Cloud-Snow-Sun-Alt.svg", night:"Cloud-Snow-Moon-Alt.svg"},
    "Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Ice Pellets" : {day:"weather4.svg", night:"weather4.svg"},
    "Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Light Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Heavy Hail" : {day:"weather4.svg", night:"weather4.svg"},
    "Mist" : {day:"weather.svg", night:"weather2.svg"},
    "Light Mist" : {day:"weather.svg", night:"weather2.svg"},
    "Heavy Mist" : {day:"lines.svg", night:"lines.svg"},
    "Fog" : {day:"none.svg", night:"none.svg"},
    "Light Fog" : {day:"none.svg", night:"none.svg"},
    "Heavy Fog" : {day:"none.svg", night:"none.svg"},
    "Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Light Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Heavy Fog Patches" : {day:"none.svg", night:"none.svg"},
    "Smoke" : {day:"none.svg", night:"none.svg"},
    "Light Smoke" : {day:"none.svg", night:"none.svg"},
    "Heavy Smoke" : {day:"none.svg", night:"none.svg"},
    "Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Light Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Heavy Volcanic Ash" : {day:"none.svg", night:"none.svg"},
    "Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Sand" : {day:"none.svg", night:"none.svg"},
    "Light Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Sand" : {day:"none.svg", night:"none.svg"},
    "Haze" : {day:"none.svg", night:"none.svg"},
    "Light Haze" : {day:"none.svg", night:"none.svg"},
    "Heavy Haze" : {day:"none.svg", night:"none.svg"},
    "Spray" : {day:"none.svg", night:"none.svg"},
    "Light Spray" : {day:"none.svg", night:"none.svg"},
    "Heavy Spray" : {day:"none.svg", night:"none.svg"},
    "Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Light Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Heavy Dust Whirls" : {day:"none.svg", night:"none.svg"},
    "Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Light Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Heavy Sandstorm" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Snow" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Light Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Low Drifting Sand" : {day:"none.svg", night:"none.svg"},
    "Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Snow" : {day:"none.svg", night:"none.svg"},
    "Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Widespread Dust" : {day:"none.svg", night:"none.svg"},
    "Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Light Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Heavy Blowing Sand" : {day:"none.svg", night:"none.svg"},
    "Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Light Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Heavy Rain Mist" : {day:"none.svg", night:"none.svg"},
    "Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Light Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Rain Showers" : {day:"none.svg", night:"none.svg"},
    "Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Light Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Snow Showers" : {day:"none.svg", night:"none.svg"},
    "Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Light Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Heavy Snow Blowing Snow Mist" : {day:"none.svg", night:"none.svg"},
    "Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Light Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Ice Pellet Showers" : {day:"none.svg", night:"none.svg"},
    "Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Light Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Light Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Heavy Small Hail Showers" : {day:"none.svg", night:"none.svg"},
    "Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorm" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Rain" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Snow" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms and Ice Pellets" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms with Hail" : {day:"none.svg", night:"none.svg"},
    "Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},
    "Light Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},
    "Heavy Thunderstorms with Small Hail" : {day:"none.svg", night:"none.svg"},

    "Freezing Drizzle" : {day:"Cloud-Drizzle-Sun.svg", night:"Cloud-Drizzle-Moon.svg"},
    "Heavy Freezing Drizzle" : {day:"Cloud-Drizzle-Sun-Alt.svg", night:"Cloud-Drizzle-Moon-Alt.svg"},
    "Light Freezing Drizzle" : {day:"Cloud-Drizzle-Sun.svg", night:"Cloud-Drizzle-Moon.svg"},
    "Freezing Rain" : {day:"Cloud-Rain-Sun.svg", night:"Cloud-Rain-Moon.svg"},
    "Light Freezing Rain" : {day:"Cloud-Rain-Sun.svg", night:"Cloud-Rain-Moon.svg"},
    "Heavy Freezing Rain" : {day:"Cloud-Rain-Sun.svg", night:"Cloud-Rain-Moon.svg"},
    "Freezing Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Light Freezing Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Heavy Freezing Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Patches of Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Shallow Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Partial Fog" : {day:"Cloud-Fog.svg", night:"Cloud-Fog.svg"},
    "Overcast" : {day:"Cloud-Sun.svg", night:"Cloud-Moon.svg"},
    "Clear" : {day:"Sun.svg", night:"Moon.svg"},
    "Partly Cloudy" : {day:"Cloud-Sun.svg", night:"Cloud-Moon.svg"},
    "Mostly Cloudy" : {day:"Cloud-Sun.svg", night:"Cloud-Moon.svg"},
    "Scattered Clouds" : {day:"Cloud.svg", night:"Cloud.svg"},
    "Small Hail" : {day:"Cloud-Hail.svg", night:"Cloud-Hail.svg"},
    "Squalls" : {day:"Wind.svg", night:"Wind.svg"},
    "Funnel Cloud" : {day:"Tornado.svg", night:"Tornado.svg"},
    "Unknown Precipitation" : {day:"Cloud-Rain.svg", night:"Cloud-Rain.svg"},
    "Unknown" : {day:"none.svg", night:"none.svg"}
};