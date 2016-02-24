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
            allFeeds.forEach(function(feed, index, allFeeds) {
                expect(feed.url).toBeDefined(); // attribute exists
                expect(feed.url).toBeTruthy(); // not empty string
            });
        });

        /**
         * This test loops through each feed in the allFeeds object and ensures
         * it has a name defined and that the name is not empty.
         */
        it('have a non empty name for each feed', function() {
            allFeeds.forEach(function(feed, index, allFeeds) {
                expect(feed.name).toBeDefined(); // attribute exists
                expect(feed.name).toBeTruthy(); // not empty string
            });
        });
    });

    /**
     * This is a test suite for the menu.
     */
    describe('The menu', function() {
        beforeAll(function() {
            this.$body = $('body');
            this.$menuIcon = $('.menu-icon-link');
            this.$menuFeedFirst = $('.feed-list li:first-child a');
        });
        /**
         * This test checks that the menu is hidden be default by checking that
         * body has a certain class applied to it.
         */
        it('is hidden by default', function() {
            expect(this.$body.hasClass('menu-hidden')).toBe(true);
        });

        /**
         * This test checks that the menu changes visibility when the menu icon
         * is clicked. It should check that the menu displays when the icon is
         * first clicked, and then disappeares again when the icon is clicked
         * again.
         */
        it('toggles visibility when icon is clicked', function() {
            expect(this.$body.hasClass('menu-hidden')).toBe(true);
            this.$menuIcon.click(); // simulate click; open menu
            expect(this.$body.hasClass('menu-hidden')).toBe(false);
            this.$menuIcon.click(); // simulate click; close menu
            expect(this.$body.hasClass('menu-hidden')).toBe(true);
        });

        /**
         * ADDITIONAL TEST: This test checks that the menu closes when a feed is
         * selected.
         */
        it('is closed when a feed is opened', function() {
            expect(this.$body.hasClass('menu-hidden')).toBe(true);
            this.$menuIcon.click(); // open menu
            expect(this.$body.hasClass('menu-hidden')).toBe(false);
            this.$menuFeedFirst.click(); // select first feed
            expect(this.$body.hasClass('menu-hidden')).toBe(true);
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
            loadFeed(0, done); // pass callback to loadFeed
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
        var feedOneEntry;
        var feedTwoEntry;


        /**
         * Test that
         */
        it('loads the first feed with some initial entry', function(done) {
            feedOneEntry = $('.feed .entry:first-child h2').text();
            expect(feedOneEntry.length).toBeGreaterThan(0);
            loadFeed(1, done);
        });

        it('loads the second feed with some a different initial entry', function() {
            feedTwoEntry = $('.feed .entry:first-child h2').text();
            expect(feedTwoEntry.length).toBeGreaterThan(0);
            expect(feedOneEntry).not.toBe(feedTwoEntry);
        });

    });
});
