
$(document).ready(function() {
	
	var articleContainer = $(".article-container");
	
	function onSavedPage() {
		if (window.location.pathname === "/saved") {
			return true;
		} else {
			return false;
		}
	};

	initPage();

	$(document).on("click", ".scrape", handleArticleScrape);
	$(document).on("click", ".btn.save", handleArticleSave);
	$(document).on("click", ".btn.unsave", handleArticleSave);
	$(document).on("click", ".notes", handleArticleNotes);
	$(document).on("click", ".save-note", handleNoteSave);
	$(document).on("click", ".note-delete", noteDelete);


	function initPage() {
		let saved = onSavedPage()
	    articleContainer.empty();

	    $.get("/api/headlines?saved=" + saved).then(function(data) {
	      if (data && data.length) {
	        renderArticles(data, saved);
	      }
	      else {
	        $('.article-container').html(`
	        	<div class='card mb-3'>
	        		<div class='card-body'>
	        			There's nothing here.
	        			<button id="scrape" class="btn my-3 btn-dark scrape">Get Articles</button>
	        		</div>
	        	</div>
	        	`)
	      }
	    });
  	}

  	function renderArticles(articles, saved) {
			var articlePanels = [];
			
	    for (let i = 0; i < articles.length; i++) {
	   		if (saved) {
	   			articlePanels.push(createPanelSaved(articles[i]));
	   		} else {
	   			articlePanels.push(createPanel(articles[i]));
	   		}
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
	        <a class='btn btn-success save'>
	        Save Article
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
	  function createPanelSaved(article) {
	    
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
	        <a class='btn btn-primary notes text-white'>
	        Notes
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
			console.log("yes");
    	$.get("/scrape")
		.then(function(data) {
			initPage();
			$('.scape-modal-content').html(data);
			$('#scrapeModal').modal();
		})
		.catch(function(err) {
			$('.scape-modal-content').html(err);
			$('#scrapeModal').modal();
		});
    };

    function handleArticleSave() {

	    let save = true

	    if ($(this).hasClass('unsave')) {
	    	save = false;
	    }
	    
	    var articleToSave = $(this).parents(".card").data();
	    var data = {
	    	id: articleToSave._id,
	    	save: save
	    }

	    $.ajax({
	      method: "PUT",
	      url: "/api/headlines",
	      data: data
	    }).then(function(data) {

	      if (data.success) {
	       	initPage();
	      }
	    });
	}

	function handleArticleNotes() {
		$('.notes-modal-body').empty();
	    var currentArticle = $(this).parents(".card").data();


	    $.get("/api/notes/" + currentArticle._id).then(function(data) {
	      var title = `<h4> Notes for ${currentArticle._id}`;
	      var ul = `<ul class='list-group note-container mb-3'></ul>`;
	      var textarea = `<textarea id="new-note" class="col-12" placeholder='New Note' rows='4'></textarea>`;

	    $('.notes-modal-body').append(title).append(ul).append(textarea);
	    $('#notesModal').modal();

	    var noteData = {
	        _id: currentArticle._id,
	        notes: data || []
      	};

      	$(".btn.save-note").data("article", noteData);

	      renderNotesList(noteData);
	    });
	}
	function handleNoteSave() {

	    var noteData;
	    var newNote = $("#new-note").val().trim();
	    if (newNote) {
	      noteData = {
	        _id: $(this).data("article")._id,
	        noteText: newNote
	      };
	      $.post("/api/notes", noteData).then(function(data) {
	        
			 $('#notesModal').modal('hide');
	      });
	    }
	}

	function renderNotesList(data) {
	 	var notesToRender = [];
			var currentNote;
		 	if (!data.notes.length) {
	      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
	      notesToRender.push(currentNote);
	    }
	    else {
	      for (var i = 0; i < data.notes.length; i++) {
	    
	        currentNote = $(
	          [
	            "<li class='list-group-item note'>",
	            data.notes[i].body,
	            "<button class='btn btn-outline-danger note-delete'>x</button>",
	            "</li>"
	          ].join("")
	        );
	        currentNote.children("button").data("_id", data.notes[i]._id);
	        notesToRender.push(currentNote);
	      }
	    }
	    $(".note-container").append(notesToRender);
	}

	function noteDelete() {

	 	var noteToDelete = $(this).data("_id");
	 	var thisNote = $(this).parent();

	 	$.ajax({
	      url: "/api/notes/",
	      method: "DELETE",
	      data: {noteToDelete}
	    }).then(function(data) {
	    	if (data.ok) {
	     		thisNote.hide();
	     	}
	    });
	}

});
