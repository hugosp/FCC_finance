$(function() {
    var socket = io();
   
    
    socket.on('connect',function(data){
        console.log('connected to server');
        
        socket.on('message',function(msg){
            console.log(msg);
        });

    });

    
    $('#test').on('click',function(){ getData('S','2001-01-01','2002-01-01') });
    
    $('#add').on('click',function(){ socket.emit('message', 'adding'); });
    $('#remove').on('click',function(){ socket.emit('message', 'removing'); });         

});

function getData(id,start,end) {
    var addr = '/api/get/'+id+'/'+start+'/'+end+'/';
    $.get( addr, function( data ) {
        $.each(data, function( index, value ) {
            $('#result').append('<li>'+value.close+'</li>');
        });
    });
}