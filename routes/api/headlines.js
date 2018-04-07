var db = require("../../models");


module.exports = function (req, res) {

	saved = req.query.saved;

	db.Headline.find({"saved":saved})
    .then(function(dbArticle) {
      res.send(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
    
};

