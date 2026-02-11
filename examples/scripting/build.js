const utils = require ("daveutils");
const podcastbuilder = require ("../../podcastbuilder.js");

const config = {
	pathOpmlFile: "/Users/davewiner/Dropbox/portableDave/publicFolder/scripting/podcast.opml",
	s3path: "/scripting.com/podcast.xml",
	s3ArchivePath: "/scripting.com/podcast/", //6/26/24 by DW
	rssFeedUrl: "http://scripting.com/podcast.xml",
	title: "Scripting News podcast",
	description: "Podcasts from Dave Winer, editor of the Scripting News blog, since 1994.",
	link: "https://this.how/scriptingNewsPodcast/",
	flPublishFeed: true, //7/17/24 by DW
	showNotesFolder: "/users/davewiner/dropbox/portabledave/publicfolder/shownotes/scripting/", //7/17/24 by DW
	showNotesFolderUrl: "https://shownotes.scripting.com/scripting/", //7/17/24 by DW
	itunes: {
		category: ["Technology", "History", "Business", "Education", "Society & Culture", "Arts"],
		explicit: "no", //other options ore "yes" and "clean"
		author: "Dave Winer",
		type: "episodic" //choices are episodic or serial, episodic is default
		},
	image: {
		url: "https://s3.amazonaws.com/scripting.com/images/2024/06/25/scriptingNewsPodcastFullImage.png",
		title: "Scripting News podcast with Dave Winer.",
		link: "http://scripting.com/"
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



