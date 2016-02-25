// Imported objects
var Handlebars = Handlebars || {};
var google = google || {};

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
    name: 'CSS Tricks',
    url: 'http://css-tricks.com/feed'
}, {
    name: 'HTML5 Rocks',
    url: 'http://feeds.feedburner.com/html5rocks'
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
         * @param  {string} status marks whether there is a 'success' or 'failure'
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
  *                      testing the async method testFeed.
  */
function addFeed(cb) {
    'use strict';
    console.log('Running addFeed');
    setTimeout(function(){ // Simulate async call
        console.log($('.add-feed-button').val());
        if (cb){
            cb();
        }
    }, 300);
    // Tell user the feed is being accessed.
    // Take the value from add-feed-text input element without clearing it and
    // test it by seeing if it returns something when run through a variation
    // on loadFeed called testFeed
    //
    // var url = $('.add-feed-button').val();
    // Do an AJAX call right here.
    // success:
        // $('.add-feed-button').val(''); // clear input div
        // Add the feed to allFeeds, pulling title from the response
        // Add the element to the feed-list
        // Add a listener on that element
        // Close the input div
        // // if (cb){ // run callback for Jasmine
            // cb()
        // }
    // error:
        // Tell user the feed is no good.
        // Don't clear the input element
        // if (cb){ // run callback for Jasmine
            // cb()
        // }
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
        feedId = 0, // data-id to increment as we add more feeds
        $menuIcon = $('.menu-icon-link');

    // A button we can click on to perform addFeed
    var newFeedButton = '<button class="new-feed-button">New Feed</button>';
    // Append button to .feed-list.
    $feedList.append(newFeedButton);
    var $newFeedButton = $('.new-feed-button');
    var $addFeedButton = $('.add-feed-button');
    $newFeedButton.on('click', function(){
        $('body').toggleClass('input-hidden');
    });
    $addFeedButton.on('click', function(){
        addFeed();
    });


    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        $feedList.append(feedItemTemplate(feed));

        feedId++;
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
