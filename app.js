'use strict'

function storeTheAddress() {
	let theAddress = $('.js-query').val();
	return theAddress;
}

function storeTheFilter() {
	let filter = $('.filters').val();
	return filter;
}

function onFormSubmit () {
        $('.my-form').val('');
        return true; 
    }

function displayTitleAccordingToFilter() {
              let filter = storeTheFilter();
              let theAddress = $('.js-query').val();
              if (filter === 'going_out') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Going Out in ${theAddress}</h2></header>`);
                $('body').addClass('going_out-image filter-background-images');
              } 
              if (filter === 'hiking') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Hiking in ${theAddress}</h2></header>`);
                $('body').addClass('hiking-image filter-background-images');
              } 
              if (filter === 'playing') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Playing in ${theAddress}</h2></header>`);
                $('body').addClass('playing-image filter-background-images');
              } 
              if (filter === 'relaxing') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Relaxing in ${theAddress}</h2></header>`);
                $('body').addClass('relaxing-image filter-background-images');
              } 
              if (filter === 'shopping') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Shopping around ${theAddress}</h2></header>`);
                $('body').addClass('shopping-image filter-background-images');
              } 
              if (filter === 'sightseeing') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'> See the sights in ${theAddress}</h2></header>`);
                $('body').addClass('sightseeing-image filter-background-images');
              } 
              if (filter === 'doing_sports') {
                $('.js-search-results').prepend(`<header class='filter-header'><h2 class='filter-title'>Play sports in ${theAddress}</h2></header>`);
                $('body').addClass('doing_sports-image filter-background-images');
              }     
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

function getBasicDataFromSygicApi(callback, south, west, north, east) {
      const sygicURL = 'https://api.sygictravelapi.com/1.0/en/places/list';
      let filter = storeTheFilter();
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

function passBoundsToBasicSygicApi(data) {
        console.log(data);
        const southBound = data.results[0].geometry.bounds.southwest.lat;
        const westBound = data.results[0].geometry.bounds.southwest.lng;
        const northBound = data.results[0].geometry.bounds.northeast.lat;
        const eastBound = data.results[0].geometry.bounds.northeast.lng;
        const bounds = [southBound, westBound, northBound, eastBound];
        console.log(bounds);
        getBasicDataFromSygicApi(passPlaceIdToDetailedSygicApi, southBound, westBound, northBound, eastBound);
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

function passPlaceIdToDetailedSygicApi(result) {
  console.log(result.data);
  const placesList = result.data.places.length;
  for (let i=0; i<placesList; i++) {
    let theId = result.data.places[i].id;
    getDetailedDataFromSygicApi(renderResult, theId);
}
}

function renderResult(result) {
  console.log(result.data);
  const placeProperties = {
    placeAddress: result.data.place.address,
    placeOpeningHours: result.data.place.opening_hours,
    placeAdmission: result.data.place.admission
  }
  for (const prop in placeProperties) {
    if (placeProperties[prop] === null) {
      placeProperties[prop] = 'Not Availablle';
    } else {
      console.log('success');
    }
  }
  
  let placeAttribution;
  let placeDescription = result.data.place.description;
   if (placeDescription !== null) {
     placeDescription = placeDescription.text;
     if (result.data.place.description.link !== null) {
     placeAttribution = `<p class='modal-text'>More on <a href=${result.data.place.description.link} target='_blank'>${result.data.place.description.provider}</a><p>`
   } else {
    placeAttribution = '';
   }

  } else {
      placeDescription = 'Not Available';
      placeAttribution = '';
  }


  let placeThumbnail = result.data.place.thumbnail_url;
   if (placeThumbnail !== null) {
     placeThumbnail = `<img src='${placeThumbnail}' alt='${result.data.place.name}'>`;
  } else {
      placeThumbnail = "<img class='no-image' src='https://cdn2.iconfinder.com/data/icons/picol-vector/32/document_image_cancel-128.png'>";
  }

  let someResults = `
    
      <div class='results-div col-1'>
      <h2>${result.data.place.name}</h2>
      <p><span>Address: </span>${placeProperties.placeAddress}</p>
      <p><span>City: </span>${result.data.place.name_suffix}</p>
      ${placeThumbnail}
      <h4>Description</h4>
           <p class='description-paragraph'>${placeDescription.slice(0, 100)}...</p>
      <button class='show-more show-more-${result.data.place.name}'>More Details</p>
      </div>
      
      <div class='pop-outer'>
        <div class='pop-inner row'>
           <button class='close'>X</button>
           <h2 class='heading-description'>Description</h2>
           <p class='modal-text'>${placeDescription}</p>
           ${placeAttribution}
           <h2>Hours: </h2>
           <p class='modal-text'>${placeProperties.placeOpeningHours}</p>
           <h2>Admission Information</h2>
           <p  class='modal-text'>${placeProperties.placeAdmission}</p>
        </div>
      </div>
  `;

  console.log(someResults); 
  $('.js-search-results').append(someResults);
}


function handleSubmit() {
          $('.js-search-form').submit( function(event) {
              event.preventDefault();
              $('.js-search-results').empty();
              $('.js-search-div').removeClass('search-div');
             // $('.js-main-header').removeClass('main-header');
              $('.form-div').addClass('hidden');
              $('.form-header').addClass('hidden');
              getDataFromGeocodingApi(passBoundsToBasicSygicApi);
              displayTitleAccordingToFilter();
              const queryTarget = $(this).find('.js-query');
    		      const query = queryTarget.val();
              queryTarget.val("");
          })
      }
      
function initApp() {
          handleSubmit();
          displayDescription();
          backToHome();
      }

function displayDescription() {
  $('.js-search-results').on('click', '.show-more', function(event) {
      $('.search-div, .results-div, .filter-title').addClass('body-transparent');
      $(this).parent().next('.pop-outer').fadeIn();
  });
  $('.js-search-results').on('click', '.close', function(event) {
      $('.search-div, .results-div, .filter-title').removeClass('body-transparent');
      $(this).parents('.pop-outer').fadeOut();
  });
}

function backToHome() {
  $('h1').on('click', function(event) {
      $('.form-div').removeClass('hidden');
      $('body').removeClass();
      $('.js-search-results').empty();
      $('.js-search-div').addClass('search-div');
      $('.form-header').removeClass('hidden');
      //$('.js-main-header').addClass('main-header');
  });
}



$(initApp);





 




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
 


































