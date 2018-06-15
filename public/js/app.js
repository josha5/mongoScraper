$("#scrapeArticles").on("click", function(e) { 
    e.preventDefault();
    $.getJSON("/articles", function(data) {
    // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
           
            $("#articles").append(`<div class="card w-100 mt-3">
                                        <div class="card-body">
                                            <h3 class="card-title" data-id="${data[i]._id}"> ${data[i].title}</h3>
                                            <h3>Article Link:<a href="${data[i].link}"> ${data[i].link}</a></h3>
                                            <p class="card-text"><strong>Summary: </strong>${data[i].summary}</p>
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
        console.log(data);
    });
});


$(document).on("click", "#addNoteBtn", function () {
    let thisID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
          text: $("#noteText" + thisID).val()
        }
      }).done(function(data) {
          console.log(data);
          $("#noteText" + thisID).val("");
          $(".noteModal").modal("hide");
      });
});

$(document).on("click", "#deleteArticleBtn", function() {
        let thisID = $(this).attr("data-id");
        $.post("/articles/delete/" + thisID)
        .done(function(data) {
            window.location = "/saved";
        })
});

$(document).on("click", "#saveBtn", function() {
    alert("article saved");
});

