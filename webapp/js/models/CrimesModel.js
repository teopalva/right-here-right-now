/**
 * Model for violentCrimes data.
 * @constructor
 */
function CrimesModel() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // data available
    var _dataAvailable = false;

    // Crimes
    var _chicagoCrimesAllTime = [];
    var _areaCrimesAllTime = [];

    var _chicagoCrimesByDate = [];
    var _areaCrimesByDate = [];

    //////////////////////// PUBLIC METHODS ////////////////////////

    this.filterByDate = function(objects){
        var timeRange = model.getTimeModel().getTemporalScope();
        if(timeRange == TimeRange.LAST_MONTH) {
            return objects;
        }

        var filteredObjects = [];

        //_areaCrimesAllTime = [];
        var elapsed = Date.now() - timeRange * 86400000;
        var limitDate = new Date(elapsed);
        for(var i in objects) {
            var stringDate = objects[i].date;
            var d = new Date(stringDate.substring(0,stringDate.indexOf('-')));
            if(d - limitDate >= 0)
                filteredObjects.push(objects[i]);
        }

        return filteredObjects;
    };

    /**
     * Returns crimes in area for a given category
     * @param category
     * @returns {Array}
     */
    this.getCrimesInSelectedArea = function(category) {
        return self.getCrimes(_areaCrimesByDate, category);
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
     * @param objects
     * @returns {Array}
     */
    this.getCrimes = function(objects, category){
        var filteredCrimes = [];
        for (var i = 0; i < objects.length; i++)
            if (objects[i].category == category) {
                filteredCrimes.push(objects[i]);
            }
        return filteredCrimes;
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

        var crimes = self.getCrimes(_areaCrimesByDate, category);
        return crimes.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @param category
     */
    this.getChicagoCrimeDensityOfMacroCategory = function(category) {
        var chicagoSquaredMiles = 234;
        var count = self.getCrimes(_chicagoCrimesByDate, category).length;
        return count / chicagoSquaredMiles;
    };

    /**
     *
     * @param primaryType
     * @returns {*}
     */
    this.getCrimeDensityWithinAreaOfPrimaryType = function(primaryType) {
        var crimes = getCrimes(_areaCrimesByDate, primaryType);
        return crimes.length / model.getAreaOfInterestModel().getSquaredMiles();
    };

    /**
     *
     * @param primaryType
     */
    this.getChicagoCrimeDensityOfPrimaryType  = function(primaryType) {
        var chicagoSquaredMiles = 234;
        var count = getCrimes(_chicagoCrimesByDate ,primaryType).length;
        return count / chicagoSquaredMiles;
    };

    /**
     *
     * @param primaryType
     * @returns {Number}
     */
    this.getNumberOfCrimesWithinArea = function(primaryType){
        var crimes = getCrimes( _areaCrimesByDate ,primaryType);
        return crimes.length;
    };

    /**
     *
     * @param primaryType
     * @returns {*}
     */
    this.getNumberOfCrimesInChicago = function(primaryType) {
        var filtered = getCrimes(_chicagoCrimesByDate, primaryType);
        return filtered.length;
    };

    // TODO !!???
    /**
     * Remove the old violentCrimes
     */
    this.clearCrimes = function(){
        _areaCrimesAllTime = [];
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
            _chicagoCrimesAllTime = [];
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
                    _chicagoCrimesAllTime.push(crime);
                }
            });
            console.log("Crimes file downloaded: "+_areaCrimesAllTime.length+" crimes");
            _chicagoCrimesByDate = self.filterByDate(_chicagoCrimesAllTime);
            _dataAvailable = true;
            self.updateSelection();
        });
    };

    /**
     * Starts the timer that updates the model at a given interval
     */
    this.startUpdates = function() {
        notificationCenter.dispatch(Notifications.crimes.DATA_CHANGED);
    };

    /**
     * Returns the macro category for a given primary category
     * @param primaryCategory
     */
    this.getMacroCategory = function(primaryCategory) {
        return categorize(primaryCategory);
    };


    /**
     * Handler for notification PATH_UPDATED
     */
    var q;
    this.updateSelection = function() {
        q = queue(1);
        q.defer(filterObjectInSelectedArea, _chicagoCrimesAllTime);
        q.awaitAll(function() {
            notificationCenter.dispatch(Notifications.crimes.SELECTION_UPDATED);
        });
    };


    /**
     * Handler for notification TEMPORAL_SCOPE_CHANGED
     */
    this.updateTemporalScope = function() {
        console.log("updating scope..");
        _chicagoCrimesByDate = self.filterByDate(_chicagoCrimesAllTime);
        _areaCrimesByDate = self.filterByDate(_areaCrimesAllTime);
        notificationCenter.dispatch(Notifications.crimes.SELECTION_UPDATED);
    };


    var filterObjectInSelectedArea = function(objects, callback) {
        _areaCrimesAllTime = model.getAreaOfInterestModel().filterObjects(_chicagoCrimesAllTime);
        _areaCrimesByDate = self.filterByDate(_areaCrimesAllTime);

        callback(null, null);
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

    var getCrimes = function(objects, primaryType){
        var filteredCrimes = [];
        for (var i = 0; i < objects.length; i++)
            if (objects[i]["primary_type"] == primaryType) {
                filteredCrimes.push(objects[i]);
            }
        return filteredCrimes;
    };

    var init = function() {
        self.updateCrimes();

        notificationCenter.subscribe(self, self.updateSelection, Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.subscribe(self, self.updateTemporalScope, Notifications.time.TEMPORAL_SCOPE_CHANGED);
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