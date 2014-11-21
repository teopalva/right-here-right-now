/**
 * Model for violentCrimes data.
 * @constructor
 */
function CrimesModel() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // Crimes
    var _crimes = [];

    // Keep if data is available
    var _dataAvailable = false;
    var _cachedData = [];

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 10000;

    //////////////////////// PUBLIC METHODS ////////////////////////


    this.filterByDate = function(){
        var timeRange = timeToDisplay;
        if(timeRange == TimeRange.LAST_MONTH)
            _crimes = _cachedData;
        else{
            _crimes = [];
            var elapsed = Date.now() - timeRange * 86400000;
            var limitDate = new Date(elapsed);
            for(i in _cachedData) {
                var stringDate = _cachedData[i].date;
                var d = new Date(stringDate.substring(0,stringDate.indexOf('-')));
                if(d - limitDate >= 0)
                    _crimes.push(_cachedData[i]);
            }
        }
        self.startUpdates();
    };
    
    /**
     * Returns the violentCrimes objects in the form:
     *      - id : number
     *      - creation_date : date (when the crime has been found)
     *      - category : CrimeCategory
     *      - primary_type : sting
     *      - description : string
     *      - latitude : number
     *      - longitude : number
     *      - location : string
     * @param category Ex: CrimeCategory.PROPERTY
     * @returns {Array}
     */
    this.getCrimes = function(category){
        if(category) {
            var filteredCrimes = [];
            for (i = 0; i < _crimes.length; i++)
                if (_crimes[i].category == category) {
                    filteredCrimes.push(_crimes[i]);
                }
            return filteredCrimes;
        }
        // else
        return _crimes;
    };

    /**
     * Return true if data is available
     * @returns {boolean}
     */
    this.isDataAvailable = function() {
        return _dataAvailable;
    };

    /**
     *
     * @param category
     * @returns {*}
     */
    this.getCrimeDensityWithinAreaOfMacroCategory = function(category) {
        var crimes = self.getCrimes(category);
        var filtered = model.getAreaOfInterestModel().filterObjects(crimes);
        return filtered.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @param category
     */
    this.getChicagoCrimeDensityOfMacroCategory = function(category) {
        var chicagoSquaredMiles = 234;
        var count = self.getCrimes(category).length;
        return count / chicagoSquaredMiles;
    };

    /**
     *
     * @param primaryType
     * @returns {*}
     */
    this.getCrimeDensityWithinAreaOfPrimaryType = function(primaryType) {
        var crimes = getCrimes(primaryType);
        var filtered = model.getAreaOfInterestModel().filterObjects(crimes);
        return filtered.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @param primaryType
     */
    this.getChicagoCrimeDensityOfPrimaryType  = function(primaryType) {
        var chicagoSquaredMiles = 234;
        var count = getCrimes(primaryType).length;
        return count / chicagoSquaredMiles;
    };

    /**
     *
     * @param primaryType
     * @returns {Number}
     */
    this.getNumberOfCrimesWithinArea = function(primaryType){
        var crimes = getCrimes(primaryType);
        var filtered = model.getAreaOfInterestModel().filterObjects(crimes);
        return filtered.length;
    };

    /**
     *
     * @param primaryType
     * @returns {*}
     */
    this.getNumberOfCrimesInChicago = function(primaryType) {
        var filtered = getCrimes(primaryType);
        return filtered.length;
    };

    /**
     * Remove the old violentCrimes
     */
    this.clearCrimes = function(){
        _crimes = [];
    };

    /**
     *  Update the violentCrimes information
     */
    this.updateCrimes = function() {
        // remove the old violentCrimes
        self.clearCrimes();

        // retrieve new data
        var link = "https://data.cityofchicago.org/resource/ijzp-q8t2.json";
        var days = TimeRange.LAST_MONTH;
        var limit = 50000;
        var elapsed = Date.now() - days * 86400000;
        var date = new Date(elapsed);

        var query = "?$select=primary_type,description,date,latitude,longitude,id,arrest,location_description,block,case_number" +
            "&$limit=" + limit +
            "&$order=date%20DESC" +
            "&$where=date>=%27" + date.toISOString() + "%27" +
            "%20and%20latitude%20IS%20NOT%20NULL%20and%20longitude%20IS%20NOT%20NULL";


        /*
         var areaOfInterest = model.getAreaOfInterestModel().getAreaOfInterest();
         if(areaOfInterest) {
         var coordinates = d3.geo.bounds(areaOfInterest);

         //  0: long
         //  1: lat
         var bottomLeft = coordinates[0];
         var topRight = coordinates[1];

         query += "%20and%20within_box(location," + topRight[1] + "," + bottomLeft[0] + "," + bottomLeft[1] + "," + topRight[0] + ")";
         }
         */


        d3.json(link + query, function(json){
            json.forEach(function(crime){
                // Add only if we know both latitude and longitude
                if(crime.latitude && crime.longitude && crime.location_description) {
                    crime.category = categorize(crime.primary_type);

                    crime.block = parseBlock(crime.block);
                    crime.date = parseDate(crime.date);
                    crime.arrest = parseArrest(crime.arrest);
                    crime.description = crime.description.capitalize();
                    //crime.primary_type =  crime.primary_type.capitalize();
                    crime.location_description = crime.location_description.capitalize();
                    _crimes.push(crime);
                }
            });
            console.log("Crimes file downloaded: "+_crimes.length+" crimes");
            _cachedData = _crimes;
            _dataAvailable = true;
            self.filterByDate();
        });

    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        notificationCenter.dispatch(Notifications.violentCrimes.LAYER_UPDATED);
        notificationCenter.dispatch(Notifications.propertyCrimes.LAYER_UPDATED);
        notificationCenter.dispatch(Notifications.qualityOfLifeCrimes.LAYER_UPDATED);
    };

    /**
     * Returns the macro category for a given primary category
     * @param primaryCategory
     */
    this.getMacroCategory = function(primaryCategory) {
        return categorize(primaryCategory);
    };


    //////////////////////// PRIVATE METHODS ////////////////////////
    var categorize = function(primary_type){
        switch (primary_type){
            case CrimePrimaryType.ASSAULT                              :
            case CrimePrimaryType.CONCEALED_LICENCE                    :
            case CrimePrimaryType.DECEPTIVE_PRACTICE                   :
            case CrimePrimaryType.GAMBLING                             :
            case CrimePrimaryType.INTIMIDATION                         :
            case CrimePrimaryType.LIQUOR_VIOLATION                     :
            case CrimePrimaryType.NARCOTICS                            :
            case CrimePrimaryType.NON_CRIMINAL                         :
            case CrimePrimaryType.NON_CRIMINAL1                        :
            case CrimePrimaryType.NON_CRIMINAL2                        :
            case CrimePrimaryType.OBSCENITY                            :
            case CrimePrimaryType.OTHER_NARCOTIC                       :
            case CrimePrimaryType.PROSTITUTION                         :
            case CrimePrimaryType.PUBLIC_INDECENCY                     :
            case CrimePrimaryType.PUBLIC_PEACE_VIOLATION               :
            case CrimePrimaryType.RITUALISM                            :
            case CrimePrimaryType.STALKING                             :
            case CrimePrimaryType.WEAPONS_VIOLATION                    : return CrimeCategory.QUALITY_OF_LIFE;

            case CrimePrimaryType.ARSON                                :
            case CrimePrimaryType.BURGLARY                             :
            case CrimePrimaryType.CRIMINAL_DAMAGE                      :
            case CrimePrimaryType.CRIMINAL_TRESPASS                    :
            case CrimePrimaryType.MOTOR_VEHICLE_THEFT                  :
            case CrimePrimaryType.ROBBERY                              :
            case CrimePrimaryType.THEFT                                : return CrimeCategory.PROPERTY;

            case CrimePrimaryType.BATTERY                              :
            case CrimePrimaryType.SEX_ASSAULT                          :
            case CrimePrimaryType.DOMESTIC_VIOLENCE                    :
            case CrimePrimaryType.HOMICIDE                             :
            case CrimePrimaryType.INTERFERENCE_WITH_PUBBLIC_OFFICER    :
            case CrimePrimaryType.INTERFERENCE_WITH_PUBBLIC_OFFICER1   :
            case CrimePrimaryType.KIDNAPPING                           :
            case CrimePrimaryType.OFFENSE_INVOLVING_CHILDREN           :
            case CrimePrimaryType.OFFENSE_INVOLVING_CHILDREN1          :
            case CrimePrimaryType.OTHER_OFFENSE                        :
            case CrimePrimaryType.SEX_OFFENSE                          : return CrimeCategory.VIOLENT;

            // should never get here
            default                                     : return CrimeCategory._error;
        }
    };

    var parseBlock = function(block){
        return block.substring(6);
    };

    var parseDate = function(date) {
        var parsedDate = new Date(date.replace("T"," "));
        return parsedDate.toDateString() + " - " + formatAMPM(parsedDate);
    };

    var parseArrest = function(arrest){
        if(arrest)
            return "yes";
        return "no";
    };

    var getCrimes = function(primaryType){
        var filteredCrimes = [];
        for (i = 0; i < _crimes.length; i++)
            if (_crimes[i].primary_type == primaryType) {
                filteredCrimes.push(_crimes[i]);
            }
        return filteredCrimes;
    };

    var init = function() {
        self.updateCrimes();
    } ();
}

/**
 * Categories of crime
 * @type {{VIOLENT: string, PROPERTY: string, QUALITY_OF_LIFE: string}}
 */
var CrimeCategory = {
    VIOLENT : "violent_crime",
    PROPERTY : "property_crime",
    QUALITY_OF_LIFE : "quality_of_life_crime",
    _error : "unknown"
};

var CrimePrimaryType = {

    ASSAULT : "ASSAULT",
    CONCEALED_LICENCE : "CONCEALED CARRY LICENSE VIOLATION",
    DECEPTIVE_PRACTICE : "DECEPTIVE PRACTICE",
    GAMBLING : "GAMBLING",
    INTIMIDATION : "INTIMIDATION",
    LIQUOR_VIOLATION : "LIQUOR LAW VIOLATION",
    NARCOTICS : "NARCOTICS",
    NON_CRIMINAL : "NON - CRIMINAL",
    NON_CRIMINAL1 : "NON-CRIMINAL",
    NON_CRIMINAL2 : "NON-CRIMINAL (SUBJECT SPECIFIED)",
    OBSCENITY : "OBSCENITY",
    OTHER_NARCOTIC : "OTHER NARCOTIC VIOLATION",
    PROSTITUTION :  "PROSTITUTION",
    PUBLIC_INDECENCY :"PUBLIC INDECENCY",
    PUBLIC_PEACE_VIOLATION : "PUBLIC PEACE VIOLATION",
    RITUALISM : "RITUALISM",
    STALKING : "STALKING",
    WEAPONS_VIOLATION : "WEAPONS VIOLATION",

    ARSON : "ARSON",
    BURGLARY : "BURGLARY",
    CRIMINAL_DAMAGE : "CRIMINAL DAMAGE",
    CRIMINAL_TRESPASS : "CRIMINAL TRESPASS",
    MOTOR_VEHICLE_THEFT : "MOTOR VEHICLE THEFT",
    ROBBERY : "ROBBERY",
    THEFT : "THEFT",

    BATTERY : "BATTERY",
    SEX_ASSAULT : "CRIM SEXUAL ASSAULT",
    DOMESTIC_VIOLENCE : "DOMESTIC VIOLENCE",
    HOMICIDE : "HOMICIDE",
    INTERFERENCE_WITH_PUBBLIC_OFFICER : "INTERFERENCE WITH PUBLIC OFFICER",
    INTERFERENCE_WITH_PUBBLIC_OFFICER1 : "INTERFERE WITH PUBLIC OFFICER",
    KIDNAPPING : "KIDNAPPING",
    OFFENSE_INVOLVING_CHILDREN : "OFFENSE INVOLVING CHILDREN",
    OFFENSE_INVOLVING_CHILDREN1 :"OFFENSES INVOLVING CHILDREN",
    OTHER_OFFENSE : "OTHER OFFENSE",
    SEX_OFFENSE : "SEX OFFENSE"
};