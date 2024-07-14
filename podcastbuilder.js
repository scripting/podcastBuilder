var myVersion = "0.4.1", myProductName = "podcastbuilder"; 

exports.build = buildPodcast; 

const fs = require ("fs");  
const utils = require ("daveutils");
const opmlToJs = require ("opmltojs");
const rss = require ("daverss");
const s3 = require ("daves3");
const dateFormat = require ("dateformat");

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
function formatDateTime (when) { 
	return (dateFormat (new Date (when), "dddd mmmm d, yyyy; h:MM TT Z"));
	}
function notComment (item) { //8/21/22 by DW
	return (!utils.getBoolean (item.isComment));
	}
function visitAll (theOutline, callback) { 
	function visitSubs (theNode) {
		if (theNode.subs !== undefined) {
			for (var i = 0; i < theNode.subs.length; i++) {
				var theSub = theNode.subs [i];
				if (!callback (theSub)) {
					return (false);
					}
				visitSubs (theSub);
				}
			}
		return (true);
		}
	visitSubs (theOutline.opml.body);
	}
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
function buildShowNotes (theOutline, showNotesFolder, showNotesFolderUrl, templateFile) {
	const now = new Date ();
	fs.readFile (templateFile, function (err, templateText) {
		if (err) {
			console.log ("buildShowNotes: templateFile == " + templateFile + ", err.message == " + err.message);
			}
		else {
			visitAll (theOutline, function (node) {
				if (notComment (node)) {
					if (node.enclosure !== undefined) {
						const relpath = utils.getDatePath (node.created) + utils.innerCaseName (node.text) + ".html";
						const f = showNotesFolder + relpath;
						const url = showNotesFolderUrl + relpath;
						utils.sureFilePath (f, function () {
							const pagetable = {
								bodytext: getDescriptionHtml (node),
								postTitle: node.text,
								postTime: formatDateTime (node.created),
								enclosure: node.enclosure, //7/14/24 by DW
								};
							const pagetext = utils.multipleReplaceAll (templateText.toString (), pagetable, false, "[%", "%]");
							fs.readFile (f, function (err, oldPagetext) {
								var flsave = false;
								if (err) {
									flsave = true;
									}
								else {
									if (oldPagetext.toString () !== pagetext) {
										flsave = true;
										}
									}
								if (flsave) {
									fs.writeFile (f, pagetext, function (err) {
										if (err) {
											console.log ("buildShowNotes: f == " + f + ", err.message == " + err.message);
											}
										else {
											console.log ("buildShowNotes: " + url);
											}
										});
									}
								});
							});
						}
					}
				return (true); //keep visiting
				});
			}
		});
	}
function buildPodcast (userConfig, callback) {
	var config = {
		pathOpmlFile: undefined,
		s3path: undefined,
		rssFeedUrl: undefined,
		flPublishFeed: true, //set false for testing -- 7/1/24 by DW
		showNotesFolder: "data/shownotes/", //7/13/24 by DW
		pathTemplateFile: "../../shownotes/template.html" //7/13/24 by DW
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
						console.log (xmltext);
						if (config.flPublishFeed) { //7/1/24 by DW
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
						if (config.showNotesFolder !== undefined) { //7/13/24 by DW
							buildShowNotes (theOutline, config.showNotesFolder, config.showNotesFolderUrl, config.pathTemplateFile);
							}
						}
					});
				}
			});
		});
	}
