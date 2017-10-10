$("body").on( "click", "#back", function(event) {
    window.location.reload()
});

$('figure').click( function(arg) {
    var id = this.id;
    $.get('/figure?id=' + id, function(data, status){
        
        if (data) {
            $("main").empty();
            $("main").append(data);
        }
    });
});

$('#logo').click( function(arg) {
    window.location.reload()
});
