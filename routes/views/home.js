var db = require("../../models");

module.exports = function (req, res) {
	

	db.Headline.find({})
    .then(function(dbArticle) {
   
      res.render("home", {Articles: dbArticle} );
    })
    .catch(function(err) {
    
      res.json(err);
    });
};

