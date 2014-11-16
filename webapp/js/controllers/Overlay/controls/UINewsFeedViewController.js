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
    var _separator;

    /**
     * Index of the top of the current page
     */
    var _indexPage;
    var _feed;

    var _pDesc = {
        x: 92.5,
        y: 65.5,
        w: 126,
        h: 53
    };

    var _pHour = {
        x: 234.5,
        y: 65.5,
        w: 65,
        h: 53
    };

    var _pIcon = {
        x: 19.5,
        y: 74
    };

    var _pSep = {
        x: 10,
        y: 117.5,
        w: 296.5,
        h: 5
    }

    var _vPadding = 75;
    var _pageElements = [];

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
        _upButton.getView().setFrame(128, 291, 24, 24);
        _upButton.getView().setViewBox(0, 0, 24, 24);
        _upButton.setImage("assets/icon/arrow_up.svg");
        _upButton.onClick(function () {
            if (_indexPage >= 3) {
                _indexPage -= 3;
                self.drawNews();
                console.log("previous page");
            }
        });
        self.add(_upButton);

        // Arrow down
        _downButton.getView().setFrame(165, 291, 24, 24);
        _downButton.getView().setViewBox(0, 0, 24, 24);
        _downButton.setImage("assets/icon/arrow_down.svg");
        _downButton.onClick(function () {
            if (model.getNewsFeedModel().getNewsfeed().length - 1 > _indexPage + 2) {
                _indexPage += 3;
                self.drawNews();
                console.log("next page");
            }
        });
        self.add(_downButton);

        // Call super
        super_viewDidAppear.call(self);
    };

    /**
     * Refresh the news displayed in the feed
     */
    this.drawNews = function () {

        // Clean newasfeed area
        _pageElements.forEach(function (e) {
            //console.log(e);
            self.remove(e);
        });
        _pageElements = [];

        _feed = model.getNewsFeedModel().getNewsfeed();
        console.log(_feed);
        //var i = Math.max(_indexPage, _feed.length-1);
        var p = 0;
        for (i = _indexPage; i !== _indexPage + 3 && i < _feed.length; i++) {

            var news_ = _feed[i];

            // Icon

            // Description
            _descriptionLabel = new UILabelViewController();
            _descriptionLabel.setText(news_.getDescription());
            _descriptionLabel.setTextSize(20);
            _descriptionLabel.setTextColor("white");
            _descriptionLabel.getView().setFrame(_pDesc.x, _pDesc.y + _vPadding * p, _pDesc.w, _pDesc.h);
            _descriptionLabel.getView().setViewBox(0, 0, _pDesc.w, _pDesc.h);
            self.add(_descriptionLabel);
            _pageElements.push(_descriptionLabel);

            // Hour
            _hourLabel = new UILabelViewController();
            _hourLabel.setText(news_.getTimestamp());
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


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-news-feed-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _titleLabel = new UILabelViewController;
        _upButton = new UIButtonViewController;
        _downButton = new UIButtonViewController;

        // Fake news
        var news1 = new News("News1", "sono news1", "path1", new Date());
        var news2 = new News("News2", "sono news2", "path2", new Date());
        var news3 = new News("News3", "sono news3", "path3", new Date());
        var news4 = new News("News4", "sono news4", "path4", new Date());
        var news5 = new News("News5", "sono news5", "path5", new Date());
        var news6 = new News("News6", "sono news6", "path5", new Date());
        var news7 = new News("News7", "sono news7", "path5", new Date());
        model.getNewsFeedModel().postNews(news1);
        model.getNewsFeedModel().postNews(news2);
        model.getNewsFeedModel().postNews(news3);
        model.getNewsFeedModel().postNews(news4);
        model.getNewsFeedModel().postNews(news5);
        model.getNewsFeedModel().postNews(news6);
        model.getNewsFeedModel().postNews(news7);

        // Show first page of news
        var feed = model.getNewsFeedModel().getNewsfeed();
        _indexPage = feed.length - 4;
        self.drawNews();

        notificationCenter.subscribe(self, self.drawNews, Notifications.newsfeed.NEWS_POSTED);

    }();
}

Utils.extend(UINewsFeedViewController, UIViewController);