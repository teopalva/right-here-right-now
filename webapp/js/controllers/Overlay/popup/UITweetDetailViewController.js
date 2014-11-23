/**
 * @class UINotificationCenterViewController
 * @description ..
 *
 * @constructor
 */
function UITweetDetailViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    var _triangle;
    var _triangleSize = {
        width: 31,
        height: 22
    };

    var _closeButton;
    var _profileIcon;
    var _profileName;
    var _profileUsername;
    var _tweetRow1;
    var _tweetRow2;
    var _tweetRow3;

    var _maxChars = 50;
    var _fontSize = 22;

    /////////////////////  PUBLIC METHODS /////////////////////

    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;

    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();

        // Call super
        super_viewDidAppear.call(self);
    };

    this.drawTweet = function () {

        showTweetDetail();

        // Retrieve selected tweet
        var tweet = model.getTwitterModel().getTweetDetail();

        // profile icon
        _profileIcon.setImagePath(tweet.getProfileImagePath());
        _profileIcon.getView().setFrame(17, 17, 55, 55);
        _profileIcon.getView().setViewBox(0, 0, 55, 55);
        self.add(_profileIcon);

        // close (hide) detail
        _closeButton.getView().setFrame(455, 150, 25, 25);
        _closeButton.getView().setViewBox(0, 0, 25, 25);
        _closeButton.setImage("assets/icon/closePopup.svg");
        _closeButton.onClick(function () {
            hideTweetDetail();
        });
        self.add(_closeButton);

        var name = tweet.getTitle()[0];
        var username = tweet.getTitle()[1];

        // profile name
        _profileName.setText(name);
        _profileName.setTextSize(25);
        _profileName.setTextColor("white");
        _profileName.setTextAlignment("left");
        _profileName.getView().setFrame(85, 10, 240, 34);
        _profileName.getView().setViewBox(0, 0, 240, 34);
        self.add(_profileName);

        // profile username
        _profileUsername.setText(username);
        _profileUsername.setTextSize(20);
        _profileUsername.setTextColor("white");
        _profileUsername.setTextAlignment("left");
        _profileUsername.getView().setFrame(85, 41, 240, 34);
        _profileUsername.getView().setViewBox(0, 0, 240, 34);
        self.add(_profileUsername);

        // tweet content
        var cleaned = tweet.getDescription();
        cleaned = cleaned.replace("#news", "");
        var lines = getMultipleLinesFromText(cleaned, 3, _maxChars);
        console.log(lines);

        // tweet first row
        _tweetRow1.setText(lines[0]);
        _tweetRow1.setTextSize(_fontSize);
        _tweetRow1.setTextColor("white");
        _tweetRow1.setTextAlignment("left");
        _tweetRow1.getView().setFrame(17, 80, 456, 30);
        _tweetRow1.getView().setViewBox(0, 0, 456, 30);
        self.add(_tweetRow1);

        // tweet second row
        _tweetRow2.setText(lines[1]);
        _tweetRow2.setTextSize(_fontSize);
        _tweetRow2.setTextColor("white");
        _tweetRow2.setTextAlignment("left");
        _tweetRow2.getView().setFrame(17, 110, 456, 30);
        _tweetRow2.getView().setViewBox(0, 0, 456, 30);
        self.add(_tweetRow2);

        // tweet third row
        _tweetRow3.setText(lines[2]);
        _tweetRow3.setTextSize(_fontSize);
        _tweetRow3.setTextColor("white");
        _tweetRow3.setTextAlignment("left");
        _tweetRow3.getView().setFrame(17, 140, 456, 30);
        _tweetRow3.getView().setViewBox(0, 0, 456, 30);
        self.add(_tweetRow3);

    };

    /////////////////////  PRIVATE METHODS /////////////////////

    /*var addBehaviors = function () {
        _closeButton.onClick(function () {
            self.close();
        });
    };*/

    var showTweetDetail = function () {
        self.getView().show();
        self.getView().getSvg().style("pointer-events", "all");
        _closeButton.getView().getSvg().style("pointer-events", "all");
    };

    var hideTweetDetail = function () {
        self.getView().hide();
        self.getView().getSvg().style("pointer-events", "none");
        _closeButton.getView().getSvg().style("pointer-events", "none");
    };

    var init = function () {
        self.getView().addClass("ui-tweet-detail-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().tweetColor());
        self.getView().setCornerRadius(10);

        _profileIcon = new UIImageViewController();
        _closeButton = new UIButtonViewController();
        _profileName = new UILabelViewController();
        _profileUsername = new UILabelViewController();
        _tweetRow1 = new UILabelViewController();
        _tweetRow2 = new UILabelViewController();
        _tweetRow3 = new UILabelViewController();

        hideTweetDetail();

        notificationCenter.subscribe(self, self.drawTweet, Notifications.twitter.TWEET_DETAIL_REQUESTED);

    }();

}

Utils.extend(UITweetDetailViewController, UIViewController);