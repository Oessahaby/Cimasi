$(document).ready(function ()
{
    
    setHumidity();
    setLumiere();
    setTemperatureSol();


var date = Array();
var val = Array();
var tempArray = Array();
var Temperature_array = Array();
am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.hiddenState.properties.opacity = 0;

chart.padding(0, 0, 0, 0);

chart.zoomOutButton.disabled = true;

var data = [];
var visits = 10;
var i = 0;
for (i = 0; i <= 30; i++) {
    visits =0;
    data.push({ date: new Date().setSeconds(i - 30), value: visits });
}
chart.data = data;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.minGridDistance = 30;
dateAxis.dateFormats.setKey("second", "ss");
dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
dateAxis.renderer.inside = true;
dateAxis.renderer.axisFills.template.disabled = true;
dateAxis.renderer.ticks.template.disabled = true;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.interpolationDuration = 500;
valueAxis.rangeChangeDuration = 500;
valueAxis.renderer.inside = true;
valueAxis.renderer.minLabelPosition = 0.05;
valueAxis.renderer.maxLabelPosition = 0.95;
valueAxis.renderer.axisFills.template.disabled = true;
valueAxis.renderer.ticks.template.disabled = true;

var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";
series.interpolationDuration = 500;
series.defaultState.transitionDuration = 0;
series.tensionX = 0.8;

chart.events.on("datavalidated", function () {
    dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
});

dateAxis.interpolationDuration = 500;
dateAxis.rangeChangeDuration = 500;

document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        if (interval) {
            clearInterval(interval);
        }
    }
    else {
        GetData();
    }
}, false);

// add data
var s =0;

function GetData(){

	var url = 'https://api.thingspeak.com/channels/1084929/feeds.json?key=5S4XHF5R773T2SO6&results=1';
            $.ajax
            ({
                url: url,
                type: 'GET',
                contentType: "application/json",
                //dataType: "json",
                //crossDomain: true,
                success: function (data, textStatus, xhr) {
                    $.each(data, function (i, item) {
                        if (i == 'feeds') {
                            
                            var ubound = item.length;
                            if(s<item[ubound - 1].field1){
                                s =item[ubound - 1].field1;
                            }
                            
                            //$('#txtField1').val(item[ubound - 1].field1);
                            document.getElementById("test").innerHTML = "highest temperature recorded:  "+ '<b style="color:red;">'+ s +'</b>';
                            var currentdate=new Date();
                            tempArray.push(item[ubound - 1].field1);
                            tempArray.push(currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds())
                            Temperature_array.push(tempArray);
                            tempArray =[];

                            
							
							visits =
            visits + Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
        var lastdataItem = series.dataItems.getIndex(series.dataItems.length - 1);
        chart.addData(
            { date: new Date(lastdataItem.dateX.getTime() + 1000), value: item[ubound - 1].field1 },
            1
        );

                        }
                    });
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
		
            setTimeout(GetData, 15000);


    }
  

GetData();

// all the below is optional, makes some fancy effects
// gradient fill of the series
series.fillOpacity = 1;
var gradient = new am4core.LinearGradient();
gradient.addColor(chart.colors.getIndex(0), 0.2);
gradient.addColor(chart.colors.getIndex(0), 0);
series.fill = gradient;

// this makes date axis labels to fade out
dateAxis.renderer.labels.template.adapter.add("fillOpacity", function (fillOpacity, target) {
    var dataItem = target.dataItem;
    return dataItem.position;
})

// need to set this, otherwise fillOpacity is not changed and not set
dateAxis.events.on("validated", function () {
    am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
        label.fillOpacity = label.fillOpacity;
    })
})

// this makes date axis labels which are at equal minutes to be rotated
dateAxis.renderer.labels.template.adapter.add("rotation", function (rotation, target) {
    var dataItem = target.dataItem;
    if (dataItem.date && dataItem.date.getTime() == am4core.time.round(new Date(dataItem.date.getTime()), "minute").getTime()) {
        target.verticalCenter = "middle";
        target.horizontalCenter = "left";
        return -90;
    }
    else {
        target.verticalCenter = "bottom";
        target.horizontalCenter = "middle";
        return 0;
    }
})

// bullet at the front of the line
var bullet = series.createChild(am4charts.CircleBullet);
bullet.circle.radius = 5;
bullet.fillOpacity = 1;
bullet.fill = chart.colors.getIndex(0);
bullet.isMeasured = false;

series.events.on("validated", function() {
    bullet.moveTo(series.dataItems.last.point);
    bullet.validatePosition();
});


}); // end am4core.ready()
$("#tempBtn").click(function(){
    var csv = 'temperature,Time\n';
    Temperature_array.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });
 

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'temperature.csv';
    hiddenElement.click();
})

});

var solHumidity = Array();
var solHumidity_array = Array()
var solTemperature = Array();
var solTemperature_array = Array();
var lightArray = Array();
var light_array = Array();
var t =0;
function setHumidity(){
var url = 'https://api.thingspeak.com/channels/1085105/feeds.json?key=TSCVHX1NH48O2135&results=1';
            $.ajax
            ({
                url: url,
                type: 'GET',
                contentType: "application/json",
                //dataType: "json",
                //crossDomain: true,
                success: function (data, textStatus, xhr) {
                    $.each(data, function (i, item) {
                        if (i == 'feeds') {
                            
                            var ubound = item.length;
                            var currentdate = new Date();
                           
                            solHumidity.push(item[ubound - 1].field1);

                            
                            solHumidity.push(currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds());
                            solHumidity_array.push(solHumidity);
                            solHumidity = [];
                            document.getElementById("Humidity").innerHTML = item[ubound - 1].field1+" %";
                            if(item[ubound - 1].field1<=45){
                                document.getElementById("etat").innerHTML = " High Speed";
                            }else if(item[ubound - 1].field1 >45 && item[ubound - 1].field1<=85){
                                document.getElementById("etat").innerHTML = " Medium Speed";
                            }else if(item[ubound - 1].field1 >85){
                                document.getElementById("etat").innerHTML = " Off"
                            }
                            
							
		

                        }
                    });
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
		
            setTimeout(setHumidity, 15000);
        }
        function setTemperatureSol(){

            var url = 'https://api.thingspeak.com/channels/1085109/feeds.json?key=WVR97Q1E7JLNS27N&results=1';
            $.ajax
            ({
                url: url,
                type: 'GET',
                contentType: "application/json",
                //dataType: "json",
                //crossDomain: true,
                success: function (data, textStatus, xhr) {
                    $.each(data, function (i, item) {
                        if (i == 'feeds') {
                            
                            var ubound = item.length;
                           
                            document.getElementById("Temp").innerHTML = item[ubound - 1].field1+" °C";
                            var currentdate = new Date();
                            solTemperature.push(item[ubound - 1].field1);
                            solTemperature.push(currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds());
                            solTemperature_array.push(solTemperature);
                            solTemperature = [];
							
		

                        }
                    });
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
		
            setTimeout(setTemperatureSol, 15000);
        }

        function setLumiere(){
            var url = 'https://api.thingspeak.com/channels/1085111/feeds.json?key=8CH8UBT62V9OY16K&results=1';
            $.ajax
            ({
                url: url,
                type: 'GET',
                contentType: "application/json",
                //dataType: "json",
                //crossDomain: true,
                success: function (data, textStatus, xhr) {
                    $.each(data, function (i, item) {
                        if (i == 'feeds') {
                            
                            var ubound = item.length;
                           
                            document.getElementById("light").innerHTML = item[ubound - 1].field1 + " lux";
                            if(item[ubound - 1].field1 < 70){
                                document.getElementById("etatLum").innerHTML = "Outdoor Lamps State: " + '<b style=" color:green;">'+"ON"+'</b>';
                            }else{
                                document.getElementById("etatLum").innerHTML = "Outdoor Lamps State: " + '<b style=" color:red;">'+"OFF"+'</b>';
                            }
                          
                            var currentdate = new Date();
                            lightArray.push(item[ubound - 1].field1);
                            lightArray.push(currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds());
                            light_array.push(lightArray);
                            lightArray =[];
		

                        }
                    });
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
		
            setTimeout(setLumiere, 15000);
        }
        
        


    function Lighth() {
            var csv = 'Light,Time\n';
            light_array.forEach(function(row) {
                    csv += row.join(',');
                    csv += "\n";
            });
         
  
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'Light.csv';
            hiddenElement.click();
        }
    function SolTempCsv() {
            var csv = 'Temperature,Time\n';
            solTemperature_array.forEach(function(row) {
                    csv += row.join(',');
                    csv += "\n";
            });
         

            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'solTemp.csv';
            hiddenElement.click();
        }
        function SolHumCsv() {
            var csv = 'Humidity,Time\n';
            solHumidity_array.forEach(function(row) {
                    csv += row.join(',');
                    csv += "\n";
            });
         

            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'solHumidity.csv';
            hiddenElement.click();
        }
        
        