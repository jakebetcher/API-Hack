const sygicURL = 'https://api.sygictravelapi.com/1.0/en/places/list';

/*function getDataFromSygicApi(searchTerm, callback) {
  const settings = {
    url: sygicURL,
    headers: {
        "x-api-key": "1J87aob1867nkffRIHOopacsRYAJIwwLaQoghwmY"
      },
      data: {
      	query: `${searchTerm}`,
      },
      dataType: 'json',
      type: 'GET',
    success: callback
  };

  $.ajax(settings);
}*/



function storeTheAddress() {
	let theAddress = $('.js-query').val();
	return theAddress;
}

const geocodingURL = "https://maps.googleapis.com/maps/api/geocode/json";

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
        let latitude= data.results[0].geometry.location.lat;
        let longitude = data.results[0].geometry.location.lng;
        let coordinates = [latitude, longitude];
        console.log(coordinates);
        return coordinates;
        }

         function handleSubmit() {
          $('.js-search-form').submit( function(event) {
              getDataFromGeocodingApi(getCoordinates);
          })
      }
      
      $(handleSubmit);
