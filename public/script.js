/* global $ io */

$(function() {
    var socket = io();
    
    var $stock = $('#addStock');
    
    socket.on('connect',function(data){
        console.log('connected to server');
        
        socket.on('message',function(msg){
            console.log(msg);
            if(msg.action == 'add') {
                $('#stockCards').append('<li id="'+msg.stock+'">'+msg.stock+'</li>');
                $('#cardHolder').appendTemplate("templates/card.html", {name: "GOOG", info: "Google blah blah"});

            } else if(msg.action == 'remove') {
                $('#'+msg.stock).remove();
            }
        });

    });

    
    $('#test').on('click',function(){ getData('S','2001-01-01','2002-01-01') });
    
    $('#add').on('click',function(){ socket.emit('message', {action:'add',stock: $stock.val()}); });
    $('#remove').on('click',function(){ socket.emit('message', {action:'remove',stock: $stock.val()}); });         

});

function getData(id,start,end) {
    var addr = '/api/get/'+id+'/'+start+'/'+end+'/';
    $.get( addr, function( data ) {
        $.each(data, function( index, value ) {
            $('#result').append('<li>'+value.close+'</li>');
        });
    });
}