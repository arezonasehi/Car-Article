var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (req, res) {

	axios.get("https://www.carmagazine.co.uk/").then(function (response) {

		var $ = cheerio.load(response.data);
		var articles = [];

		$(".articleWrap").each(function (i, element) {
			var result = {};
			result.headline = $(this)
				.children(".articleSearchPage")
				.children("h2")
				.children("a")
				.text();
			result.link = "https://www.carmagazine.co.uk/" + $(this)
				.children(".articleSearchPage")
				.children("h2")
				.children("a")
				.attr("href");
			result.teaser = $(this)
				.children(".articleSearchPage")
				.children(".teaser")
				.text();

			articles.push(result);

		});

		var count = 0;
		var newArticleFound = false;
		var newArticles = 0;

		function addToDB(arrayOfArticles) {
			//look in the database to check if the headline already exists
			db.Headline.find({
					"headline": arrayOfArticles[count].headline
				}).limit(1)
				.then(function (found) {

					if (!found.length) {

						db.Headline.create(arrayOfArticles[count])
							.then(function (dbArticle) {
								console.log(dbArticle);
								newArticleFound = true;
								newArticles++;
							})
							.catch(function (err) {
								console.log("----------------------------------------------------");
								console.log(err);
							});
					} else {};
					count++;
					if (count < arrayOfArticles.length) {
						addToDB(arrayOfArticles);
					} else {
						if (newArticleFound) {
							res.json(newArticles + " articles added!");
						} else {
							res.json("No Articles Found");
						}
					}
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		addToDB(articles);
	});
}