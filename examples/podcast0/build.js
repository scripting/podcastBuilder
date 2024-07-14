const utils = require ("daveutils");
const podcastbuilder = require ("../../podcastbuilder.js");

const config = {
	pathOpmlFile: "/Users/davewiner/Dropbox/portableDave/publicFolder/drummer/podcast0.opml",
	s3path: "/scripting.com/podcast0/rss.xml",
	rssFeedUrl: "http://scripting.com/podcast0/rss.xml",
	flPublishFeed: true, //7/10/24 by DW
	showNotesFolder: "/users/davewiner/dropbox/portabledave/publicfolder/shownotes/podcast0/", //7/13/24 by DW
	showNotesFolderUrl: "http://scripting.com/publicfolder/shownotes/podcast0/", //7/13/24 by DW
	itunes: {
		category: ["Technology", "History", "Business", "Education", "Society & Culture", "Arts"],
		explicit: "no", //other options ore "yes" and "clean"
		author: "Dave Winer",
		type: "episodic"
		},
	image: {
		url: "http://scripting.com/images/2024/06/17/podcast0image.png",
		title: "DW's Podcast0 feed",
		link: "https://this.how/podcast0/"
		}
	}

podcastbuilder.build (config, function (err, data) {
	if (err) {
		console.log (err.message);
		}
	else {
		console.log (data);
		}
	});

