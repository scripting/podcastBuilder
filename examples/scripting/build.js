const utils = require ("daveutils");
const podcastbuilder = require ("../../podcastbuilder.js");

const config = {
	pathOpmlFile: "/Users/davewiner/Dropbox/portableDave/publicFolder/scripting/blog.opml",
	s3path: "/scripting.com/podcast.xml",
	rssFeedUrl: "http://scripting.com/podcast.xml",
	itunes: {
		category: ["Technology", "History", "Business", "Education", "Society & Culture", "Arts"],
		explicit: "no", //other options ore "yes" and "clean"
		author: "Dave Winer",
		type: "episodic"
		},
	image: {
		url: "http://scripting.com/images/2024/06/17/podcast0image.png",
		title: "Home on the range",
		link: "http://somewhere.some"
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

