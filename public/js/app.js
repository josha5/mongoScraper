$("#scrapeArticles").on("click", function() { 
    $.getJSON("/articles", function(data) {
    // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
           
            $("#articles").append(`<div class="card w-100 mt-3">
                                        <div class="card-body">
                                            <h3 class="card-title" data-id="${data[i]._id}"> ${data[i].title}</h3>
                                            <h3><a href="${data[i].link}">Article Link: ${data[i].link}</a></h3>
                                            <p class="card-text">Article Content Here.</p>
                                            <button type="button" id="saveBtn" data-id="${data[i]._id}" class="btn btn-primary">Save Article</button>
                                        </div>
                                    </div>`);
        }
    });
});

$(document).on("click", "#saveBtn", function() {
    let thisID = $(this).attr("data-id");

    $.post("/index/" + thisID)
    .done(function(data) {
        window.location = "/saved"
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
           
            $("#savedArticles").append(`<div class="card w-100 mt-3">
                                        <div class="card-body">
                                            <h3 class="card-title" data-id="${data[i]._id}"> ${data[i].title}</h3>
                                            <h3><a href="${data[i].link}">Article Link: ${data[i].link}</a></h3>
                                            <p class="card-text">Article Content Here.</p>
                                            <button type="button" id="addNoteBtn" class="btn btn-primary">Add Note</button>
                                            <button type="button" id="deleteArticleBtn" class="btn btn-danger">Delete Article</button>
                                        </div>
                                    </div>`);
        } 
    });
});

