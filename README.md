# RSS Feed Jasmine Testing

This is a small project that showcases a set of test suites using [Jasmine](http://jasmine.github.io/).
The webpage itself, which I did not build, is an RSS Feed aggregate for some news websites, mainly to do
with technology.

A live version of the webpage running the tests can be accessed [here](http://andreicommunication.github.io/feed-reader-testing/).

### Running the application

While the live version of the website [is up](http://andreicommunication.github.io/feed-reader-testing/),
it can also be accessed by cloning this repository and then opening the
**index.html** file in the root directory in your browser of choice.

Gulp was only used to lint the **app.js** file in the **js** directory. If you want
to replicate this part of the build system you can run the following command from
within the root directory of the project:

```
npm install --save-dev gulp jshint gulp-jshint gulp-notify
```

*NOTE: if there are any issues in getting these files, it may help the change the value
of the name attribute inside the **package.json** file, i.e. from "Feed Reader" to
something that suits your fancy.*


Then, to lint the **app.js** file and set up a watch function on it, all you have to do
is type

`gulp`

from inside the root directory.

### Additional Tests

The additional tests that I have added should all pass as well as the features have
also been added when they were missing. The added tests are as follow:

* The "closes when a feed is selected" test inside "The menu". This test is just
testing a feature already present in the original version of the app. The menu should
close when a new feed is selected. We select the feed already loaded/loading to test
this functionality.
* The entire "Feed Creation Form" test suite is new. The feature added is a way for users
to temporarily (no local storage implemented) add new RSS feeds to the webpage. There are a
number of tests here.
    * The input div where users enter a new RSS feed should be hidden by default.
    * There is a button inside the menu that should open and close the input div
    * The button add feed in the input div should run the addFeed function
    * The addFeed function should have no effect on the model or view if the passed
    feed address is not a proper RSS feed
    * The addFeed function should have add a feed to the model and vie if the passed
    feed address is a proper RSS feed. This will result in a cleared input element and
    a hidden input div.
    * The bottom most feed in the feed-list should be accessible by loadFeed. If the
    previous test ran correctly, this should be the newly added feed.
* The "Most Recently Added Feed" test suite tries to open the last feed in the
allFeeds array. If the previous test suite performed correctly, this will tell us
whether or not the feed can actually be accessed by the loadFeed function.