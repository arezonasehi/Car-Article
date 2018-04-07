var db = require("../../models");

module.exports = function (req, res) {
  let {id, save} = req.body;
  var query = { _id:id };

	db.Headline.findOneAndUpdate(query, {saved:save})
    .then(function(dbArticle) {
      res.json({success:1});
    })
    .catch(function(err) {
      res.json(err);
    });
    
};

