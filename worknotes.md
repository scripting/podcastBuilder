#### 2/27/26; 1:36:54 PM by DW

Moved the home page link to the top, edited its CSS.

BTW, in the next version we should add OG metadata. 

#### 2/11/26; 9:04:09 AM by DW -- v0.4.8

Add a link to the home page of the podcast at the bottom of each page in the archive.

#### 1/24/26; 1:22:39 PM by DW -- v0.4.4

Added a <a href="https://shownotes.scripting.com/scripting/">home page</a> for the podcast. Only made to work on main Scripting podcast, though it may work on the other (which we are not maintaining).

#### 1/23/26; 11:52:35 AM by DW

I started to write a buildIndex thing and decided to redirect from the home page to a page on feedland.com.

#### 12/4/24; 11:00:50 AM by DW

Added support for <webmaster> in feed, needed by https://www.listennotes.com/rss-viewer/.

Had the two apps use the podcastbuilder package from NPM, not from the local disk.

#### 9/13/24; 10:06:35 AM by DW

Include a link to the RSS feed in the head section of the template for show notes. 

Also include the URL of the show notes folder as a macro, though we aren't using it in the template because we don't put anything at that url. 

Add a white on orange XML icon linking to the feed. 

#### 7/14/24; 10:06:23 AM by DW

Add a player to the shownotes pages. We already have the url of the enclosure. Why not give them a way to play it too. Nice. 

#### 7/13/24; 9:55:35 AM by DW

New option -- showNotesFolder.

#### 7/10/24; 10:13:44 AM by DW

Why we're using 2024 dates in the Podcast0 feed.

If I hadn't made the mistake of using a 2024 date for the Bill Gates podcast, it would have been great to use 2004 dates. It's so cool to see that in the various clients.

But that means Bill Gates will always be at the top of the list, everywhere, and ruines the reverse chronologic view, and it's a boring podcast. 

So I changed all the dates to 2024 now, that will give them all new guids, and they will all show up as new, unfortunately. 

But from this point on, they will sort out correctly. 

#### 7/1/24; 4:18:35 PM by DW

It's now possible to build the feed without publishing for testing.

To turn it off, add flPublishFeed: false to your config

#### 6/26/24; 10:04:03 PM by DW

If config.s3ArchivePath is defined, we save a copy of the RSS feed in a folder, organized by year.

For the scripting news podcast feed, look for: http://scripting.com/podcast/2024/06.xml

#### 6/24/24; 8:08:40 PM by DW

it started with the cuomo podcast during covid, and then i set up podcast0 to generalize it, and now i'm making it a package so i can easily turn scripting news into an apple-compatible podcast. 

