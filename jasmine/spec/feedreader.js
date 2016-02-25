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
    // static jQuery objects used by multiple suites
    var $body = $('body');
    var $menuIcon = $('.menu-icon-link');

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
            if (allFeeds.length > 0) { // there are feeds to access
                allFeeds.forEach(function(feed, index, allFeeds) {
                    expect(feed.url).toBeDefined(); // attribute exists
                    expect(feed.url.length).toBeGreaterThan(0); // not empty string
                });
            } else { // We certainly fail.
                expect(false).toBe(true);
            }

        });

        /**
         * This test loops through each feed in the allFeeds object and ensures
         * it has a name defined and that the name is not empty.
         */
        it('have a non empty name for each feed', function() {
            if (allFeeds.length > 0) { // there are feeds to access
                allFeeds.forEach(function(feed, index, allFeeds) {
                    expect(feed.name).toBeDefined(); // attribute exists
                    expect(feed.name.length).toBeGreaterThan(0); // not empty string
                });
            } else { // We certainly fail.
                expect(false).toBe(true);
            }
        });
    });

    /**
     * This is a test suite for the menu.
     */
    describe('The menu', function() {

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
            expect($body.hasClass('menu-hidden')).toBe(true);
            $menuIcon.click(); // simulate click; open menu
            expect($body.hasClass('menu-hidden')).toBe(false);
            $menuIcon.click(); // simulate click; close menu
            expect($body.hasClass('menu-hidden')).toBe(true);
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
            if (allFeeds.length > 0) {
                loadFeed(0, done); // pass callback to loadFeed
            } else {
                done(); // There are zero feeds to load. We're done.
            }

        });

        /**
         * Check that the ajax call to get a the first feed that gets loaded
         * results in at least one entry being loaded onto the .feed container.
         */
        it('at least one entry is returned by loadFeed', function() {
            expect($('.feed .entry').length).toBeGreaterThan(0); // at least 1 entry
        });

    });

    /**
     * Test suite to make sure that when a new feed is selected, the current
     * feed changes.
     */
    describe('New Feed Selection', function() {
        var feedOneEntry; // Text from first feed's entry titles
        var feedTwoEntry; // Text from second feed's entry titles
        // The button that bring us to the first feed (that's already open)
        var $menuFeedFirst = $('.feed-list li:first-child a');


        /**
         * ADDITIONAL TEST: This test checks that the menu closes when a feed is
         * selected.
         */
        it('menu closes when a feed is selected', function() {
            if (allFeeds.length > 0) { // There are feeds to click on
                console.log('got in');
                expect($body.hasClass('menu-hidden')).toBe(true);
                $menuIcon.click(); // open menu
                expect($body.hasClass('menu-hidden')).toBe(false);
                $menuFeedFirst.click(); // select first feed
                expect($body.hasClass('menu-hidden')).toBe(true);
            } else { // We fail.
                expect(false).toBe(true);
            }
        });

        /**
         * Test that we currently have some text present as part of the first
         * feed's entries and then load the second feed to be used by the next
         * test.
         */
        it('loads the first feed with some kind of text present in the titles', function(done) {
            feedOneEntry = $('.feed .entry h2').text();
            expect(feedOneEntry.length).toBeGreaterThan(0);
            if (allFeeds.length > 1) { // There is a second feed to load
                loadFeed(1, done); // Load second feed, don't continue until done
            } else {
                done(); // No second feed to load. We're done.
            }

        });

        /**
         * Test that we currently have some text present as part of the second
         * feed's entry titles. Then test that the entry titles from the first
         * feed are not identical to the entry titles from the second feed.
         */
        it('provide a new result when second feed is loaded', function() {
            feedTwoEntry = $('.feed .entry h2').text();
            expect(feedTwoEntry.length).toBeGreaterThan(0);
            expect(feedOneEntry).not.toBe(feedTwoEntry);

        });

    });
});
