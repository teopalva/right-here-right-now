/**
 * Model for violentCrimes data.
 * @constructor
 */
function CrimesModel() {
    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // Crimes
    var _crimes = [];

    // Update timer
    var _updateTimer = null;
    var _intervalMillis = 10000;

    //////////////////////// PUBLIC METHODS ////////////////////////
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
        var days = 30;
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
                    crime.description = crime.description.capitalize();
                    crime.primary_type =  crime.primary_type.capitalize();
                    crime.location_description = crime.location_description.capitalize();
                    _crimes.push(crime);
                }
            });
            console.log("Crimes file downloaded");
            self.startUpdates();
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


    //////////////////////// PRIVATE METHODS ////////////////////////
    var categorize = function(primary_type){
        switch (primary_type){
            case "ARSON"                                :
            case "BURGLARY"                             :
            case "CRIMINAL DAMAGE"                      :
            case "CRIMINAL TRESPASS"                    :
            case "MOTOR VEHICLE THEFT"                  :
            case "ROBBERY"                              :
            case "THEFT"                                : return CrimeCategory.PROPERTY;

            case "ASSAULT"                              :
            case "BATTERY"                              :
            case "CRIM SEXUAL ASSAULT"                  :
            case "DOMESTIC VIOLENCE"                    :
            case "HOMICIDE"                             :
            case "INTERFERENCE WITH PUBLIC OFFICER"     :
            case "INTERFERE WITH PUBLIC OFFICER"        :
            case "INTIMIDATION"                         :
            case "KIDNAPPING"                           :
            case "OFFENSE INVOLVING CHILDREN"           :
            case "OFFENSES INVOLVING CHILDREN"          :
            case "OTHER OFFENSE"                        :
            case "SEX OFFENSE"                          : return CrimeCategory.VIOLENT;

            case "CONCEALED CARRY LICENSE VIOLATION"    :
            case "DECEPTIVE PRACTICE"                   :
            case "GAMBLING"                             :
            case "LIQUOR LAW VIOLATION"                 :
            case "NARCOTICS"                            :
            case "NON - CRIMINAL"                       :
            case "NON-CRIMINAL"                         :
            case "NON-CRIMINAL (SUBJECT SPECIFIED)"     :
            case "OBSCENITY"                            :
            case "OTHER NARCOTIC VIOLATION"             :
            case "PROSTITUTION"                         :
            case "PUBLIC INDECENCY"                     :
            case "PUBLIC PEACE VIOLATION"               :
            case "RITUALISM"                            :
            case "STALKING"                             :
            case "WEAPONS VIOLATION"                    : return CrimeCategory.QUALITY_OF_LIFE;

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