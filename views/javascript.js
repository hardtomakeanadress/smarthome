$('figure').click( function(arg) {
    var id = this.id;
    $.get('/figure?id=' + id, function(data, status){
        
    $("main").empty();

    if (data) {
        $("main").append(data);
    }
    });
});

$('#logo').click( function(arg) {
   $.get('/', function(data, status){

    if (data) {
        // $("html").empty();
        $("html").load(data);
        console.log("try to load data");
    }
    });
});