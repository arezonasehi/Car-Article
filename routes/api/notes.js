var db = require("../../models");

function get(req, res) {
  let id = req.params.id;

  
  var query = { _id:id };

  db.Headline.find(query)
    .populate('notes')
    .then(function(dbNotes) {
      res.json(dbNotes[0].notes);
    })
    .catch(function(err) {
      res.json(err);
  });
};

function post(req, res) {

  let {_id, noteText} = req.body;

  db.Note.create({body: noteText})
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({_id:_id}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
};

function deletepost(req, res) {
  let {noteToDelete} = req.body;
  db.Note.remove({_id:noteToDelete})
  .then(function(dbNote) {
    res.json(dbNote);
  })
  .catch(function(err) {
    res.json(err);
  });
}

module.exports = {get, post, deletepost}