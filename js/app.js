// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12

    });
    var infoWindow = new google.maps.InfoWindow();

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function (data) {

            data.forEach(function (obj) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(obj.location.latitude),
                        lng: Number(obj.location.longitude)
                    },
                    map: map
                });
                obj.marker = marker;

                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(this.getPosition());
                    var html = '<p>' + obj.cameralabel + '</p>';
                    html +='<img src="' + obj.imageurl.url + '"/>';

                    infoWindow.setContent(html);
                    infoWindow.open(map, this);

                });
            });

            $( "#search" ).bind( "search keyup", function() {
                var stxt = $( "#search" ).val().toLowerCase();

                data.forEach(function(obj) {
                    var prop = obj.cameralabel.toLowerCase();
                    if (prop.indexOf(stxt) >= 0) {
                        obj.marker.setMap(map);
                    }
                    else {
                        obj.marker.setMap(null);
                    }


                });

            });

        })
        .fail(function(error) {
            alert('Sorry failed to load the document');
        })
        .always(function() {
            $('#ajax-loader').fadeOut();


        });


});