

var map;

var moduleName = 'chaikin-smooth';

var llat =  33.82262626353691;
var llong = -118.2202;
var mylist = [];
var counter = 0;
var centers = [];
var dd = [];

var init = function(){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "traced.csv",
            dataType: "text",
            success: function(data) {processData(data);}
         });
    });
    
    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var p = new google.maps.LatLng(data[1],data[2]);
                //dd.push([data[1],data[1]]);
                centers.push([data[0],p])
            }
        }
        
    
    initMap();
    
    }
}


var initMap = function()
{
    console.log("initMap");
    map = new google.maps.Map(document.getElementById('map'),{
        center:{lat:llat ,lng:llong}, //33.787846, -117.852724
        zoom:15
    });
    var point = new google.maps.LatLng(llat ,llong);
    var p2 = new google.maps.LatLng(llat ,llong);
    var p3 = new google.maps.LatLng(llat ,llong);
    var p4 = new google.maps.LatLng(parseFloat(centers[0][1].lat()),llong);
    console.log(p4.lat(),p4.lng());
    var i;
    
    
    //var hex1 = google.maps.Polygon.RegularPoly(p4,500,6,90,"#00ffff", 0, 1, "#00ffff", 0.2);
    //hex1.setMap(map);
    
    
    
    for(i=0;i<centers.length;i++)
        {
            var hex1 = google.maps.Polygon.RegularPoly(centers[i][1],50,6,90,centers[i][0], 0.5, 1, centers[i][0], 0.4);
            hex1.setMap(map);
        }
    
    
    //var p = point;
    /*
    var d = 2 * 50 * Math.cos(Math.PI / 6);
    var j;
    for (i=0;i< 50;i++)
            {
                mylist.push([counter,[point.lat(),point.lng()]]);
                counter+=1;
                var hex1 = google.maps.Polygon.RegularPoly(point,50,6,90,"#000000", 0, 1, "#00ffff", 0.2);
                hex1.setMap(map);
                point = EOffsetBearing(point, d, 90);

            }
    for (j=0;j<50;j++)
        {
        
        point = EOffsetBearing(p2, d, 150);
        p2 = point;
        for (i=0;i< 50;i++)
            {

                var hex1 = google.maps.Polygon.RegularPoly(point,50,6,90,"#000000", 0, 1, "#00ffff", 0.2);
                hex1.setMap(map);
                point = EOffsetBearing(point, d, 90);

            }
        
        p3 = EOffsetBearing(p3, d*1.732, 180);
        p4 = p3;
        point = p3;
        for (i=0;i< 50;i++)
            {

                var hex1 = google.maps.Polygon.RegularPoly(point,50,6,90,"#000000", 0, 1, "#00ffff", 0.2);
                hex1.setMap(map);
                point = EOffsetBearing(point, d, 90);

            }
        //var hex1 = google.maps.Polygon.RegularPoly(p3,50,6,90,"#000000", 0, 1, "#00ffff", 0.2);
        //hex1.setMap(map);    
            
            
            
        point = EOffsetBearing(p3, d, 150);
        p2 = p3;
        
            
        }
        */
}


google.maps.Polygon.Shape = function(point, r1, r2, r3, r4, rotation, vertexCount, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts, tilt) {
  var rot = -rotation * Math.PI / 180;
  var points = [];
  var latConv = google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat() + 0.1, point.lng())) * 10;
  var lngConv = google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat(), point.lng() + 0.1)) * 10;
  var step = (360 / vertexCount) || 10;

  var flop = -1;
  if (tilt) {
    var I1 = 180 / vertexCount;
  } else {
    var I1 = 0;
  }
  for (var i = I1; i <= 360.001 + I1; i += step) {
    var r1a = flop ? r1 : r3;
    var r2a = flop ? r2 : r4;
    flop = -1 - flop;
    var y = r1a * Math.cos(i * Math.PI / 180);
    var x = r2a * Math.sin(i * Math.PI / 180);
    var lng = (x * Math.cos(rot) - y * Math.sin(rot)) / lngConv;
    var lat = (y * Math.cos(rot) + x * Math.sin(rot)) / latConv;

    points.push(new google.maps.LatLng(point.lat() + lat, point.lng() + lng));
  }
  return (new google.maps.Polygon({
    paths: points,
    strokeColor: strokeColour,
    strokeWeight: strokeWeight,
    strokeOpacity: Strokepacity,
    fillColor: fillColour,
    fillOpacity: fillOpacity
  }))
}

google.maps.Polygon.RegularPoly = function(point, radius, vertexCount, rotation, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts) {
  rotation = rotation || 0;
  var tilt = !(vertexCount & 1);
  return google.maps.Polygon.Shape(point, radius, radius, radius, radius, rotation, vertexCount, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts, tilt)
}

function EOffsetBearing(point, dist, bearing) {
  var latConv = google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat() + 0.1, point.lng())) * 10;
  var lngConv = google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat(), point.lng() + 0.1)) * 10;
  var lat = dist * Math.cos(bearing * Math.PI / 180) / latConv;
  var lng = dist * Math.sin(bearing * Math.PI / 180) / lngConv;
  return new google.maps.LatLng(point.lat() + lat, point.lng() + lng)
}

init();
