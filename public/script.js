/* global $ io */
var socket = io();

$(function() {

    var $stock = $('#addStock');  
    chartIT();
    var chart = $('#chartContainer').highcharts();
    
    socket.on('connect',function(data){
        console.log('connected to server');
        
        socket.on('message',function(msg){
            console.log(msg);
            if(msg.action == 'add') {
                addStock(chart,msg.stock);
            } else if(msg.action == 'remove') {
                removeStock(chart,msg.stock);
            }
        });

    });
  
    $(document).on('click','#add',function(){ socket.emit('message', {action:'add',stock: $stock.val()}); });
    $(document).on('click','.remove',function(){ socket.emit('message', {action:'remove',stock: $(this).attr('id')}); });         

});



// ------------------- funkis ------------------------------------------- 

function addStock(chart,name) {
    var now = new Date().toISOString().slice(0,10);
    var yearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0,10);
    
    $.getJSON('http://dev.dalahest.se/api/get/'+name+'/'+yearAgo+'/'+now+'/',    function (data) {
        var temp = [];
        $.each(data, function (i, val) {
            temp.push([Date.parse(val.date),val.close]);
        });
        chart.addSeries({
            name: data[0].symbol,
            id: data[0].symbol,
            data: temp
        });
        var color = chart.get(name).color;
        $('#cardHolder').appendTemplate("templates/card.html", {name: name, info: "bacon hej å så  blah",num:'1',color: color});
    });
}

function removeStock(chart,name) {
    chart.get(name).remove();
    $('#wrapper_'+name).remove();
}

function chartIT() {
    $('#chartContainer').highcharts('StockChart', {
        navigator : {
            enabled : false
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },
        plotOptions: {
            series: {
                compare: 'percent'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2
        },
        series: []
    }); 
}
    