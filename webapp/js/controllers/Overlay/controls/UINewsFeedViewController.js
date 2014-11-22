/**
 * @class UINewsFeedViewController
 * @description ..
 *
 * @constructor
 */
function UINewsFeedViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    var _titleLabel;
    var _upButton;
    var _downButton;
    var _playButton;
    var _rssButton;
    var _twitterButton;
    var _separator;

    /**
     * Index of the top of the current page
     */
    var _indexPage;

    var _pDesc = {
        x: 85,
        y: 50,
        w: 214,
        h: 53
    };

    var _pHour = {
        x: 222,
        y: 78,
        w: 85,
        h: 53
    };

    var _pIcon = {
        x: 13,
        y: 60,
        w: 70,
        h: 65
    };

    var _pSep = {
        x: 10,
        y: 117.5,
        w: 296.5,
        h: 5
    }

    var _vPadding = 75;
    var _pageElements = [];

    var _mode;
    var _modes = {
        PLAY: 0,
        PAUSE: 1
    };

    var _translation = 83;
    var _translationModes = 80;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;

    this.viewDidAppear = function () {

        // Title
        _titleLabel.setText("News Feed");
        _titleLabel.setTextSize(30);
        _titleLabel.setTextColor("white");
        _titleLabel.getView().setFrame(0, 0, 316.5, 67);
        _titleLabel.getView().setViewBox(0, 0, 316.5, 67);
        self.add(_titleLabel);

        // Arrow up
        _upButton.getView().setFrame(107.5 - _translation, 290, 28, 28);
        _upButton.getView().setViewBox(0, 0, 28, 28);
        _upButton.setImage("assets/icon/arrow_up.svg");
        _upButton.onClick(function () {
            if (_indexPage >= 3) {
                _indexPage -= 3;
                self.drawNews();
            }
        });
        self.add(_upButton);

        // Arrow down
        _downButton.getView().setFrame(131.5 - _translation, 290, 28, 28);
        _downButton.getView().setViewBox(0, 0, 28, 28);
        _downButton.setImage("assets/icon/arrow_down.svg");
        _downButton.onClick(function () {
            if (model.getNewsFeedModel().getNewsfeed().length - 1 > _indexPage + 2) {
                _indexPage += 3;
                self.drawNews();
            }
        });
        self.add(_downButton);

        // Play button
        _playButton.getView().setFrame(174.5 - _translation, 290, 28, 28);
        _playButton.getView().setViewBox(0, 0, 28, 28);
        _playButton.setImage("assets/icon/pause.svg");
        _playButton.onClick(function () {
            if (_mode === _modes.PLAY) {
                _playButton.setImage("assets/icon/play.svg");
                _mode = _modes.PAUSE;
            } else {
                _playButton.setImage("assets/icon/pause.svg");
                _mode = _modes.PLAY;
            }
        });
        self.add(_playButton);
        
        // rss button
        _rssButton.getView().setFrame(144.5 + _translationModes, 290, 28, 28);
        _rssButton.getView().setViewBox(0, 0, 28, 28);
        _rssButton.setImage("assets/icon/rss.svg");
        _rssButton.onClick(function () {
            if (_mode === _modes.PLAY) {
                _rssButton.setImage("assets/icon/play.svg");
                _mode = _modes.PAUSE;
            } else {
                _rssButton.setImage("assets/icon/pause.svg");
                _mode = _modes.PLAY;
            }
        });
        self.add(_rssButton);
        
        // twitter button
        _twitterButton.getView().setFrame(184.5 + _translationModes, 290, 28, 28);
        _twitterButton.getView().setViewBox(0, 0, 28, 28);
        _twitterButton.setImage("assets/icon/twitter.svg");
        _twitterButton.onClick(function () {
            if (_mode === _modes.PLAY) {
                _twitterButton.setImage("assets/icon/play.svg");
                _mode = _modes.PAUSE;
            } else {
                _twitterButton.setImage("assets/icon/pause.svg");
                _mode = _modes.PLAY;
            }
        });
        self.add(_twitterButton);

        // Call super
        super_viewDidAppear.call(self);
    };

    /**
     * Refresh the news displayed in the feed
     */
    this.drawNews = function () {

        // Retrieve real-time feed
        var _feed = model.getNewsFeedModel().getNewsfeed();

        // Clean newsfeed area
        _pageElements.forEach(function (e) {
            //console.log(e);
            self.remove(e);
        });
        _pageElements = [];

        //console.log(_feed);
        //var i = Math.max(_indexPage, _feed.length-1);
        var p = 0;
        for (i = _indexPage; i !== _indexPage + 3 && i < _feed.length; i++) {

            var news_ = _feed[i];

            // Icon
            _newsIconButton = new UIButtonViewController();
            _newsIconButton.getView().setFrame(_pIcon.x, _pIcon.y + _vPadding * p, _pIcon.w, _pIcon.h);
            _newsIconButton.getView().setViewBox(0, 0, _pIcon.w, _pIcon.h);

            var size = {
                width: model.getVisualizationModel().divvyMarkerIconSize().width,
                height: model.getVisualizationModel().divvyMarkerIconSize().height
            };
            _newsIconButton.setImage(news_.getImagePath());
            _newsIconButton.getView().getSvg()
                .attr("width", _pIcon.w)
                .attr("height", _pIcon.h)
            _newsIconButton.onClick(function () {
                // TODO interaction news-map
            });
            self.add(_newsIconButton);
            _pageElements.push(_newsIconButton);

            // Description
            _descriptionLabel = new UILabelViewController();
            _descriptionLabel.setText(news_.getDescription());
            _descriptionLabel.setTextSize(20);
            _descriptionLabel.setTextColor("white");
            _descriptionLabel.setTextAlignment("left");
            _descriptionLabel.getView().setFrame(_pDesc.x, _pDesc.y + _vPadding * p, _pDesc.w, _pDesc.h);
            _descriptionLabel.getView().setViewBox(0, 0, _pDesc.w, _pDesc.h);
            self.add(_descriptionLabel);
            _pageElements.push(_descriptionLabel);

            // Hour
            _hourLabel = new UILabelViewController();
            _hourLabel.setText(formatAMPM(news_.getTimestamp()));
            _hourLabel.setTextSize(20);
            _hourLabel.setTextColor("white");
            _hourLabel.getView().setFrame(_pHour.x, _pHour.y + _vPadding * p, _pHour.w, _pHour.h);
            _hourLabel.getView().setViewBox(0, 0, _pHour.w, _pHour.h);
            self.add(_hourLabel);
            _pageElements.push(_hourLabel);

            // Separator
            _separator = new UIImageViewController(self);
            _separator.setImagePath("assets/icon/news_separator.svg");
            _separator.getView().setFrame(_pSep.x, _pSep.y + _vPadding * p, _pSep.w, _pSep.h);
            _separator.getView().setViewBox(0, 0, _pSep.w, _pSep.h);
            self.add(_separator);
            _pageElements.push(_separator);

            // Update index on position of news
            p++;

        }

    };

    this.seeLastPage = function () {
        if (_mode === _modes.PLAY) {
            // Retrieve real-time feed
            var _feed = model.getNewsFeedModel().getNewsfeed();
            _indexPage = _feed.length - 3;
        }
        self.drawNews();
    };

    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-news-feed-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _titleLabel = new UILabelViewController;
        _upButton = new UIButtonViewController;
        _downButton = new UIButtonViewController;
        _playButton = new UIButtonViewController;
        _rssButton = new UIButtonViewController;
        _twitterButton = new UIButtonViewController;

        // Set mode
        _mode = _modes.PLAY;

        // Fake news
        var news1 = new News("News1", "sono news1", "assets/icon/markers/crime_violent.svg", new Date());
        var news2 = new News("News2", "sono news2", "assets/icon/markers/crime_violent.svg", new Date());
        var news3 = new News("News3", "sono news3", "assets/icon/markers/crime_violent.svg", new Date());
        var news4 = new News("News4", "I'm the longest news ever!", "assets/icon/markers/crime_violent.svg", new Date());
        var news5 = new News("News5", "sono news5", "assets/icon/markers/crime_property.svg", new Date());
        var news6 = new News("News6", "sono news6", "assets/icon/markers/crime_violent.svg", new Date());
        //var news7 = new News("News7", "sono news7", "path5", new Date());
        model.getNewsFeedModel().postNews(news1);
        model.getNewsFeedModel().postNews(news2);
        model.getNewsFeedModel().postNews(news3);
        model.getNewsFeedModel().postNews(news4);
        model.getNewsFeedModel().postNews(news5);
        model.getNewsFeedModel().postNews(news6);
        //model.getNewsFeedModel().postNews(news7);

        // Show first page of news
        self.seeLastPage();
        self.drawNews();

        notificationCenter.subscribe(self, self.seeLastPage, Notifications.newsfeed.NEWS_POSTED);

    }();
}

Utils.extend(UINewsFeedViewController, UIViewController);