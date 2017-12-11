const geocodingURL = "https://maps.googleapis.com/maps/api/geocode/json";
const sygicURL = 'https://api.sygictravelapi.com/1.0/en/places/list';

function storeTheAddress() {
	let theAddress = $('.js-query').val();
	return theAddress;
}



function getDataFromGeocodingApi(callback) {
        let theAddress = storeTheAddress();
        let query = {
        address: theAddress,
        key: 'AIzaSyCjtmHMexw6qH3OnOxTQmW09y1OYcpD6EE'
        }
        $.getJSON(geocodingURL, query, callback);
    }


 function getCoordinates(data) {
        console.log(data);
        const southBound = data.results[0].geometry.bounds.southwest.lat;
        const westBound = data.results[0].geometry.bounds.southwest.lng;
        const northBound = data.results[0].geometry.bounds.northeast.lat;
        const eastBound = data.results[0].geometry.bounds.northeast.lng;
        const bounds = [southBound, westBound, northBound, eastBound];
        console.log(bounds);
        getDataFromSygicApi(doThis, southBound, westBound, northBound, eastBound);
        }

        function handleSubmit() {
          $('.js-search-form').submit( function(event) {
              getDataFromGeocodingApi(getCoordinates);
          })
      }
      
      $(handleSubmit);

 function getDataFromSygicApi(callback, south, west, north, east) {
  		const settings = {
    	url: sygicURL,
    	headers: {
        "x-api-key": "1J87aob1867nkffRIHOopacsRYAJIwwLaQoghwmY"
      	},
      	data: {
      		bounds: `${south}, ${west}, ${north}, ${east}`,
      		levels: 'poi',
      		limit: 100
      	},
      	dataType: 'json',
     	type: 'GET',
    	success: callback
  	};

  	$.ajax(settings);
}

function doThis(data) {
	console.log(data);
}