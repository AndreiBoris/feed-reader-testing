/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    'use strict';

    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /**
         * This test loops through each feed in the allFeeds object and ensures
         * it has a URL defined and that the URL is not empty.
         */
        it('have a non empty url for each feed', function() {
            // If allFeeds is not an array or is empty, fail as there are not feeds
            if (allFeeds.constructor === Array && allFeeds.length > 0) {
                allFeeds.forEach(function(feed) {
                    expect(feed.url).toBeDefined(); // attribute exists
                    expect(feed.url.length).toBeGreaterThan(0); // not empty string
                });
            } else { // No feeds: fail
                expect('there').toBe('some feeds, but there weren\'t any.');
            }

        });

        /**
         * This test loops through each feed in the allFeeds object and ensures
         * it has a name defined and that the name is not empty.
         */
        it('have a non empty name for each feed', function() {
            // If allFeeds is not an array or is empty, fail as there are not feeds
            if (allFeeds.constructor === Array && allFeeds.length > 0) {
                allFeeds.forEach(function(feed) {
                    expect(feed.name).toBeDefined(); // attribute exists
                    expect(feed.name.length).toBeGreaterThan(0); // not empty string
                });
            } else { // No feeds: fail
                expect('there').toBe('some feeds, but there weren\'t any.');
            }
        });
    });

    /**
     * This is a test suite for the menu.
     */
    describe('The menu', function() {
        /**
         * @type {jQuery} $body is the body element that takes 'hidden' classes
         * @type {jQuery} $menuIcon is element that allows access to the menu
         * @type {jQuery} $menuFeedFirst is button connected to the first feed
         *                               in the list
         */
        var $body = $('body');
        var $menuIcon = $('.menu-icon-link');
        var $menuFeedFirst = $('.feed-list li:first-of-type a');

        /**
         * This test checks that the menu is hidden be default by checking that
         * body has a certain class applied to it.
         */
        it('is hidden by default', function() {
            expect($body.hasClass('menu-hidden')).toBe(true);
        });

        /**
         * This test checks that the menu changes visibility when the menu icon
         * is clicked. It should check that the menu displays when the icon is
         * first clicked, and then disappeares again when the icon is clicked
         * again.
         */
        it('toggles visibility when icon is clicked', function() {
            // Determine original status of menu appearance
            var originalMenuPosition = $body.hasClass('menu-hidden');
            $menuIcon.click(); // simulate click
            // Menu should have switched appearance
            expect($body.hasClass('menu-hidden')).not.toBe(originalMenuPosition);
            $menuIcon.click(); // simulate click
            // Menu should switch back
            expect($body.hasClass('menu-hidden')).toBe(originalMenuPosition);
        });

        /**
         * This test checks that the menu closes when a feed is selected.
         */
        it('closes when a feed is selected', function() {
            if (allFeeds.length > 0) { // There are feeds to click on
                $body.removeClass('menu-hidden'); // open menu
                expect($body.hasClass('menu-hidden')).toBe(false);
                $menuFeedFirst.click(); // select first feed
                expect($body.hasClass('menu-hidden')).toBe(true);
            } else { // No feeds: fail.
                expect('there').toBe('some feeds, but there weren\'t any.');
            }
        });
    });

    /**
     * This is a test suit for the initial entries that require an ajax call to
     * go through.
     */
    describe('Initial Entries', function() {

        /**
         * Will be performing an asyncronous call so we need to make sure that
         * we only run the tests when the async call is done.
         */
        beforeEach(function(done) {
            if (allFeeds.length > 0) { // There are feeds to load.
                loadFeed(0, done); // load the first feed and pass callback function
            } else {
                done(); // There are zero feeds to load. We're done.
            }

        });

        /**
         * Check that the ajax call to get a the first feed that gets loaded
         * results in at least one entry being loaded onto the .feed container.
         */
        it('contain at least one entry', function() {
            expect($('.feed .entry').length).toBeGreaterThan(0); // at least 1 entry
        });

    });

    /**
     * Test suite to make sure that when a new feed is selected, the current
     * feed changes.
     */
    describe('New Feed Selection', function() {
        /**
         * @type {string} feedOneEntry is text from the first feed's titles
         * @type {string} feedTwoEntry is text from the second feed's titles
         * @type {int} LENGTH_TO_COMPARE is a constant that determines the number of
         *                               characters from each feed that we will be
         *                               comparing. Created for visibility.
         */
        var feedOneEntry;
        var feedTwoEntry;
        var LENGTH_TO_COMPARE = 75;

        beforeEach(function(done) {
            if (allFeeds.length > 1) { // There are at least two feeds to load
                /**
                 * Thank you to my Udacity code reviewer Tamás for help with the
                 * following callback structure!
                 *
                 * Load the first feed and pass custom callback function that
                 * executes when loadFeed is done its work.
                 * @param  {int} feed number to load
                 * @param {function} anonymous callback function that stores the
                 *                             result of the first feed we load
                 *                             and runs another loadFeed to test
                 *                             new feed selection.
                 */
                loadFeed(0, function() {
                    feedOneEntry = $('.feed .entry h2').text().substring(0, LENGTH_TO_COMPARE);
                    loadFeed(1, done); // Only done after this call finishes.
                });
            } else { // There are not enough feeds to test this.
                /**
                 * Assign the result of the first async call to whatever is the
                 * current set of .feed titles. This will cause failure in the
                 * test below.
                 */
                feedOneEntry = $('.feed .entry h2').text().substring(0, LENGTH_TO_COMPARE);
                done();
            }
        });

        /**
         * Test that we currently have some text present as part of the second
         * feed's entry titles. Then test that the entry titles from the first
         * feed are not identical to the entry titles from the second feed.
         */
        it('provides a new result when a new feed is loaded', function() {
            feedTwoEntry = $('.feed .entry h2').text().substring(0, LENGTH_TO_COMPARE);
            expect(feedTwoEntry.length).toBeGreaterThan(0); // Titles aren't empty
            /**
             * This new feed selection should have different titles from the
             * first feed that we had opened.
             */
            expect(feedOneEntry).not.toBe(feedTwoEntry);

        });

    });

    /**
     * Test suite to check that new feeds can be added by users.
     */
    describe('Feed Creation Form', function() {
        /**
         * Used for controlling the visual display of the page during this test.
         * @type {jQuery} $body is the body element that takes 'hidden' classes
         */
        var $body = $('body');

        /**
         *
         * @type {jQuery} $newFeedButton is the button that opens the input div
         * @type {jQuery} $addFeedButton is the button that starts addFeed
         * @type {jQuery} $inputText is the input element that addFeed uses to
         *                           determine what RSS feed to add.
         */
        var $newFeedButton = $('.new-feed-button');
        var $addFeedButton = $('.add-feed-button');
        var $inputText = $('.add-feed-text');

        /**
         * These are required to test if we have added feeds to our view and
         * model.
         * @type {int} originalFeedCount is the number of feed objects in the
         *                               model inside the allFeeds array.
         * @type {int} originalFeedListCount is the number of feeds on the list
         *                                   in the view.
         */
        var originalFeedCount = allFeeds.length;
        var originalFeedListCount = $('.feed-list li').length;

        /**
         * Test that input div is hidden when page loads
         */
        it('is hidden by default', function() {
            expect($body.hasClass('input-hidden')).toBe(true);
        });

        /**
         * Test that input div for new feeds appears when the 'New Feed' button
         * is pressed
         */
        it('opens and closes when new feed button is pressed', function() {
            // Store whether the form begins on or off screen
            var originalPosition = $body.hasClass('input-hidden');
            $body.removeClass('hidden-menu'); // Open menu
            $newFeedButton.click(); // Open form
            // Form should be in the opposite position from what it started in
            expect($body.hasClass('input-hidden')).not.toBe(originalPosition);
            $newFeedButton.click(); // Close form
            // Form should be back to its original position
            expect($body.hasClass('input-hidden')).toBe(originalPosition);
            $body.addClass('hidden-menu'); // Close menu
        });

        /**
         * Test that the add feed button runs addFeed, and set runFeed in
         * motion for next test.
         */
        it('launches addFeed when the corresponding button is pressed', function(done) {
            // Watch addFeed function and allow for callThrough so that when we
            // call addFeed directly at the bottom of this test, we will be
            // calling the actual function and not a spy.
            spyOn(window, 'addFeed').and.callThrough();
            expect(addFeed).not.toHaveBeenCalled();
            $body.removeClass('menu-hidden'); // Open menu
            $newFeedButton.click(); // Open form
            $addFeedButton.click(); // Run addFeed
            // addFeed called when 'Add Feed' button is pressed
            expect(addFeed).toHaveBeenCalled();
            // Bad input for addFeed. addFeed accesses $inputText directly.
            $inputText.val('some bad text');
            // Run addFeed with input and callback and continue to next test
            // when it finishes.
            addFeed(done);
        });

        /**
         * Test that adding a bad feed will not allow the feed to be added. Runs
         * when the addFeed from the last test has finished.
         */
        it('doesn\'t allow a bad rss feed to be added', function(done) {
            var newFeedCount = allFeeds.length;
            var newFeedListCount = $('.feed-list li').length;
            // bad feed doesn't get added
            expect(newFeedCount).toBe(originalFeedCount);
            expect(newFeedListCount).toBe(originalFeedListCount);
            // Good input for addFeed. addFeed accesses $inputText directly.
            $inputText.val('http://www.thestar.com/feeds.topstories.rss');
            // Run addFeed with input and callback and continue to next test
            // when it finishes.
            addFeed(done);
        });

        /**
         * Test that adding a good feed will add that feed correctly. Runs when
         * addFeed from the last test has finished.
         */
        it('adds good rss feeds to the app correctly', function() {
            var newFeedCount = allFeeds.length;
            var newFeedListCount = $('.feed-list li').length;
            // good feed gets added
            expect(newFeedCount).toBe(originalFeedCount + 1);
            expect(newFeedListCount).toBe(originalFeedListCount + 1);
            // Test that the input text gets cleared when a good RSS feed is
            // added
            expect($inputText.val()).toBe('');
            // Test that the input div is hidden
            expect($body.hasClass('input-hidden')).toBe(true);

        });

        /**
         * Test that the newly added feed and causes loadFeed to be run
         */
        it('creates a new feed on the list that can be opened', function(){
            /**
             * Spy on loadFeed to check that it gets called when the
             * corresponding feed list button is clicked.
             */
            spyOn(window, 'loadFeed').and.callThrough();
            /**
             * Ensure that loadFeed hasn't been called yet.
             */
            expect(loadFeed).not.toHaveBeenCalled();
            $body.removeClass('menu-hidden'); // open menu
            /**
             * Simulate click on the newly added feed in the feed-list. This
             * should be the element that is after the last originally added
             * feedList element.
             */
            $('.feed-list li:nth-of-type(' + (originalFeedListCount + 1).toString() + ') a').click();
            /**
             * Clicking on the element should activiate the handler that runs
             * loadFeed and it should be called with the index that corresponds
             * to the most recently added feed. Since we are looking at index
             * values here, this should correspond to the original count of
             * items in the allFeeds array.
             */
            expect(loadFeed).toHaveBeenCalledWith(originalFeedCount);
            $body.addClass('menu-hidden'); // hide menu
        });
    });
});
