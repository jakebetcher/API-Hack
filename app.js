


function storeTheAddress() {
	let theAddress = $('.js-query').val();
	return theAddress;
}

function storeTheFilters() {
	let filter = $('#filters').val();
	return filter;
}

function onFormSubmit () {
        $('#my-form').val('');
        return true; 
    }


function getDataFromGeocodingApi(callback) {
        const geocodingURL = "https://maps.googleapis.com/maps/api/geocode/json";
        const theAddress = storeTheAddress();
        const query = {
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
        getBasicDataFromSygicApi(renderResult, southBound, westBound, northBound, eastBound);
        }


        function doSomethingWithFilter() {
          let filter = storeTheFilters();
              let theAddress = $('.js-query').val();
              if (filter === 'discovering') {
                $('.js-search-results').prepend(`<h2>Discover ${theAddress}</h2>`);
              } else if (filter === 'eating') {
                $('.js-search-results').prepend(`<h2>Eating in ${theAddress}</h2>`);
              } else if (filter === 'going_out') {
                $('.js-search-results').prepend(`<h2>Going Out in ${theAddress}</h2>`);
              } else if (filter === 'hiking') {
                $('.js-search-results').prepend(`<h2>Hiking in ${theAddress}</h2>`);
              } else if (filter === 'playing') {
                $('.js-search-results').prepend(`<h2>Playing in ${theAddress}</h2>`);
              } else if (filter === 'relaxing') {
                $('.js-search-results').prepend(`<h2>Relaxing in ${theAddress}</h2>`);
              } else if (filter === 'shopping') {
                $('.js-search-results').prepend(`<h2>Shopping around ${theAddress}</h2>`);
              } else if (filter === 'sightseeing') {
                $('.js-search-results').prepend(`<h2> See the sights in ${theAddress}</h2>`);
              } else if (filter === 'doing_sports') {
                $('.js-search-results').prepend(`<h2>Play sports in ${theAddress}</h2>`);
              } else if (filter === 'traveling') {
                $('.js-search-results').prepend(`<h2>Travel around ${theAddress}</h2>`);
              }          
        }

        function handleSubmit() {
          $('.js-search-form').submit( function(event) {
              event.preventDefault();
              $('.js-search-results').empty();
              getDataFromGeocodingApi(getCoordinates);
              doSomethingWithFilter();
              const queryTarget = $(event.currentTarget).find('.js-query');
    		      const query = queryTarget.val();
              queryTarget.val("");
          })
      }
      
      $(handleSubmit);

 function getBasicDataFromSygicApi(callback, south, west, north, east) {
  		const sygicURL = 'https://api.sygictravelapi.com/1.0/en/places/list';
      let filter = storeTheFilters();
  		const settings = {
    	url: sygicURL,
    	headers: {
        "x-api-key": "1J87aob1867nkffRIHOopacsRYAJIwwLaQoghwmY"
      	},
      	data: {
      		bounds: `${south}, ${west}, ${north}, ${east}`,
      		levels: 'poi',
      		limit: 20,
      		categories: filter
      	},
      	dataType: 'json',
     	type: 'GET',
    	success: callback
  	};

  	$.ajax(settings);
}

function getDetailedDataFromSygicApi(callback, theId) {
  		
  		const settings = {
    	url: `https://api.sygictravelapi.com/1.0/en/places/${theId}`,
    	headers: {
        "x-api-key": "1J87aob1867nkffRIHOopacsRYAJIwwLaQoghwmY"
      	},
      	dataType: 'json',
     	type: 'GET',
    	success: callback
  	};

  	$.ajax(settings);
}

function renderResult(result) {
	console.log(result.data);
	const arrayLength = result.data.places.length;
	for (let i=0; i<arrayLength; i++) {
	//if (result.data.places[i].thumbnail_url === null) {
		//console.log('no image');
//	} else {
    let theId = result.data.places[i].id;

    
       
	/*let theResult = `
		<div class='results-div'>
			<h2>${result.data.places[i].name}</h2>
			<img src='${result.data.places[i].thumbnail_url}'>
			<p><a href='${result.data.places[i].url}'>check it out</a></p>
			<div class='more-info-div more-info-div${i}'>
      <button class='more-info'>Show More</button>
      </div>
		</div>
	`;*/
	

	//$('.js-search-results').append(theResult);
 // $(`.more-info`).on('click', function(event) {
    getDetailedDataFromSygicApi(doSomeStuff, theId);
 // });
//}
}

}
 

function doSomeStuff(result) {
	//console.log(theresult.data);
  //const theAddress = `<p>${result.data.place.address}<p>`;
  if (result.data.place.thumbnail_url === null) {
    console.log('no image'); 
  } else {
  let someResults = `
    
      <div class='results-div col-1'>
      <p>${result.data.place.name}<p>
      <p>${result.data.place.address}<p>
      <p>${result.data.place.name_suffix}<p>
      <img src='${result.data.place.thumbnail_url}'>
      <p>${result.data.place.description.text}</p>
      <p>${result.data.place.opening_hours}</p>
      <p>${result.data.place.admission}</p>
      </div>
      
  `;
  console.log(someResults); 
  $('.js-search-results').append(someResults);
  //return someResults;
}
}



/*function renderTheResult(result) {
  //console.log(result.data);
  const thePlaces = result.data.places;
   const theDesiredresults = thePlaces.map( function(place, index) { 
      let someId = thePlaces[0].id;
      getDetailedDataFromSygicApi(doSomeStuff, someId);
    });
     $('.js-search-results').append(theDesiredresults);
     console.log(theDesiredresults);
}*/
 


































