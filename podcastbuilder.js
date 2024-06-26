var myVersion = "0.4.1", myProductName = "podcastbuilder"; 

exports.build = buildPodcast; 

const fs = require ("fs");  
const utils = require ("daveutils");
const opmlToJs = require ("opmltojs");
const rss = require ("daverss");
const s3 = require ("daves3");

var whenstart = new Date ();

function readConfig (f, config, callback) {
	fs.readFile (f, function (err, jsontext) {
		if (!err) {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					config [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("Error reading " + f);
				}
			}
		callback ();
		});
	}
function outlineToFeed (theOutline, config) {
	const title = (config.title === undefined) ? theOutline.opml.head.title : config.title; //6/25/2 by DW
	const link = (config.link === undefined) ? theOutline.opml.head.link : config.link; 
	const description = (config.description === undefined) ? theOutline.opml.head.description : config.description;
	var headElements = { 
		title,
		description,
		link: link,
		language: "en-us",
		generator: myProductName + " v" + myVersion,
		docs: "http://cyber.law.harvard.edu/rss/rss.html",
		maxFeedItems: 25,
		flRssCloudEnabled: true,
		rssCloudDomain: "rpc.rsscloud.io",
		rssCloudPort: 5337,
		rssCloudPath: "/pleaseNotify",
		rssCloudRegisterProcedure: "",
		rssCloudProtocol: "http-post",
		image: config.image,
		itunes: config.itunes
		};
	var historyArray = new Array ();
	
	function getDescriptionHtml (item) {
		if (item.subs === undefined) {
			return (undefined);
			}
		else {
			var htmltext = "";
			item.subs.forEach (function (subitem) {
				htmltext += "<p>" + subitem.text + "</p>";
				});
			return (htmltext);
			}
		}
	
	
	opmlToJs.visitSubs (theOutline.opml.body.subs, function (item) {
		if (item.enclosure !== undefined) {
			console.log (utils.jsonStringify (item));
			historyArray.push ({
				title: item.text,
				link: item.link,
				text: getDescriptionHtml (item),
				when: item.created,
				guid: {
					value: new Date (item.created).getTime ()
					},
				enclosure: {
					url: item.enclosure,
					type: item.enclosureType,
					length: item.enclosureLength
					}
				});
			}
		return (true); //keep visiting
		});
	var xmltext = rss.buildRssFeed (headElements, historyArray); 
	return (xmltext);
	}
function buildPodcast (userConfig, callback) {
	var config = {
		pathOpmlFile: undefined,
		s3path: undefined,
		rssFeedUrl: undefined
		};
	readConfig ("config.json", config, function () {
		if (userConfig !== undefined) {
			for (x in userConfig) {
				if (userConfig [x] !== undefined) {
					config [x] = userConfig [x];
					}
				}
			}
		console.log ("buildPodcast: config == " + utils.jsonStringify (config));
		fs.readFile (config.pathOpmlFile, function (err, data) {
			if (err) {
				callback (err);
				}
			else {
				opmlToJs.parse (data, function (theOutline) {
					if (err) {
						callback (err);
						}
					else {
						var xmltext = outlineToFeed (theOutline, config);
						console.log (JSON.stringify (theOutline, undefined, 4));
						s3.newObject (config.s3path, xmltext, "text/xml", "public-read", function (err, data) {
							if (err) {
								callback (err);
								}
							else {
								console.log ("config.rssFeedUrl == " + config.rssFeedUrl);
								rss.cloudPing (undefined, config.rssFeedUrl);
								callback (undefined, config.rssFeedUrl);
								}
							});
						if (config.s3ArchivePath !== undefined) { //6/26/24 by DW
							const theDate = new Date ();
							const year = theDate.getFullYear ();
							const month = utils.padWithZeros (theDate.getMonth () + 1, 2);
							const s3path = config.s3ArchivePath + year + "/" + month + ".xml";
							s3.newObject (s3path, xmltext, "text/xml", "public-read", function (err, data) {
								if (err) {
									console.log ("buildPodcast: err.message == " + err.message);
									}
								});
							}
						}
					});
				}
			});
		});
	}
