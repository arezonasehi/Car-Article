$(document).ready(function () {

	var articleContainer = $(".article-container");


	function renderArticles(articles) {
		var articlePanels = [];
		for (let i = 0; i < articles.length; i++) {
			articlePanels.push(createPanel(articles[i]));
		}
		articleContainer.append(articlePanels);
	}

	
	function createPanel(article) {

		var panel = $(
			[
				`<div class='card panel-default mb-3'>
	        <div class='card-header'>
	        <h3>
	        <a class='article-link d-block' target='_blank' href='${article.link}'>
	        ${article.headline}
	        </a>
	        <a class='btn btn-warning unsave'>
	        UnSave Article
	        </a>
	        <a class='btn btn-primary add-note text-white'>
	        Add Note
	        </a>
	        </h3>
	        </div>
	        <div class='card-body'>
	        ${article.teaser}
	        </div>
	        </div>`
			].join("")
		);
		panel.data("_id", article._id);

		return panel;
	}

	function handleArticleScrape() {
		console.log("scrape");
		$.get("/scrape")
			.then(function (data) {
				initPage();
				alert(data);
			})
			.catch(function (err) {
				console.log(err);
			});
	};


});