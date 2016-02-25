// Imported objects
var Handlebars = Handlebars || {};
var google = google || {};

/**
 * Store variables to be used throughout the file. NOTE: For now this is only
 * storing the data-id for each feed. In a fuller application we would
 * refactor and encapsulate the rest of this code as well.
 */
var storage = {
    feedId: 0
};

/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
var allFeeds = [{
    name: 'Udacity Blog',
    url: 'http://blog.udacity.com/feed'
}, {
    name: 'HTML5 Rocks',
    url: 'http://feeds.feedburner.com/html5rocks'
}, {
    name: 'CSS Tricks',
    url: 'http://css-tricks.com/feed'
}, {
    name: 'Linear Digressions',
    url: 'http://feeds.feedburner.com/udacity-linear-digressions'
}];

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
function loadFeed(id, cb) {
    'use strict';
    var feedUrl = allFeeds[id].url, // load one feed
        feedName = allFeeds[id].name;

    $.ajax({
        type: 'POST', // we're posting our RSS feed to the feed parser
        url: 'https://rsstojson.udacity.com/parseFeed', // feed parser
        data: JSON.stringify({ url: feedUrl }), // send this to feed parser
        contentType: 'application/json', // file format for data being sent
        /**
         * Interpret response.
         * @param  {JSON}   result that the server gives us after our request
         */
        success: function(result) { // got response
            console.log(result);
            var container = $('.feed'), // DOM element to put results into
                title = $('.header-title'), // DOM elem with title to change
                entries = result.feed.entries, // array of feed entries
                // grab the template from the html that each entry will fill
                entryTemplate = Handlebars.compile($('.tpl-entry').html());

            title.html(feedName); // Set the header text
            container.empty(); // Empty out all previous entries

            /* Loop through the entries we just loaded via the Google
             * Feed Reader API. We'll then parse that entry against the
             * entryTemplate (created above using Handlebars) and append
             * the resulting HTML to the list of entries on the page.
             */
            entries.forEach(function(entry) {
                container.append(entryTemplate(entry));
            });

            if (cb) {
                cb();
            }
        },
        error: function(err) {
            console.log('err of loadFeed is' + err);
            //run only the callback without attempting to parse result due to error
            if (cb) {
                cb();
            }
        },
        dataType: 'json'
    });
}

/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
function init() {
    'use strict';
    // Load the first feed we've defined (index of 0).
    loadFeed(0);
}



/**
 * Add a feed to the feed-list if the feed is a verified RSS feed
 * @param {Function} cb Function to be passed from jasmine to assist with
 *                      testing the AJAX call.
 */
function addFeed(cb) {
    'use strict';
    // Tell user the feed is being accessed. NOTE: this is just a console log.
    // implement this with visible text.
    console.log('We are testing whether the feed provided is good, please wait.');
    // Take the value from add-feed-text input element without clearing it
    var url = $('.add-feed-text').val();
    $.ajax({
        type: 'POST', // we're posting our RSS feed to the feed parser
        url: 'https://rsstojson.udacity.com/parseFeed', // feed parser
        data: JSON.stringify({ url: url }), // send this to feed parser
        contentType: 'application/json', // file format for data being sent
        /**
         * Interpret response.
         * @param  {JSON}   result that the server gives us after our request
         */
        success: function(result) { // got response, its probably an RSS feed!
            $('.add-feed-text').val(''); // clear input div
            $('body').addClass('input-hidden'); // hide input div
            // Add the feed to allFeeds, pulling title from the response
            allFeeds.push({
                name: result.feed.title,
                url: url,
                id: storage.feedId++
            });
            // Add the element to the feed-list
            var feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html());
            // Add the new feed to the feed list so that it can be accessed
            $('.feed-list').append(feedItemTemplate(allFeeds[allFeeds.length - 1]));
            if (cb) {
                cb();
            }
        },
        error: function() {
            // Need to tell user that their request failed. NOTE: This is just
            // a console log, a good implementation will show the user visible
            // text to inform them of this.
            console.log('This wasn\'t a good RSS feed!');
            //run only the callback without attempting to parse result due to error
            if (cb) {
                cb();
            }
        },
        dataType: 'json'
    });
}

/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    'use strict';
    //var container = $('.feed'), // container where all current feed entries live
    var $feedList = $('.feed-list'), // feed options list
        // Template for feedlist entries
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        // feedId = 0, // data-id to increment as we add more feeds
        $menuIcon = $('.menu-icon-link');

    // A button we can click on to perform addFeed
    var newFeedButton = '<button class="new-feed-button">New Feed</button>';
    // Append button to .feed-list.
    $feedList.append(newFeedButton);
    var $newFeedButton = $('.new-feed-button');
    var $addFeedButton = $('.add-feed-button');
    $newFeedButton.on('click', function() {
        $('body').toggleClass('input-hidden');
    });
    $addFeedButton.on('click', function() {
        addFeed();
    });


    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = storage.feedId++;
        $feedList.append(feedItemTemplate(feed));
    });



    /* When a link in our $feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occurring.
     */
    $feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    $menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });
});
