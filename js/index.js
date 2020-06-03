var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 8,

    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();

  searchStores();
  // setOnClickListener();
}

function setOnClickListener(stores) {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (element, index) {
    element.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function searchStores() {
  var foundStore = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    stores.forEach(function (store) {
      var postal = store.address.postalCode.substring(0, 5);
      if (postal === zipCode) {
        foundStore.push(store);
      }
    });
  } else {
    foundStore = stores;
  }
  clearLocation();
  displayStore(foundStore);
  showStoreMarker(foundStore);
  setOnClickListener(foundStore);
}

function clearLocation() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function displayStore(stores) {
  var storeHtml = "";
  stores.forEach(function (store, index) {
    var address = store.addressLines;
    var phone = store.phoneNumber;
    storeHtml += `        
    <div class="store-container">
    <div class="store-container-backround">
    <div class="store-info-container">
    <div class="store-address">
      ${address[0]} <br />
      ${address[1]}
    </div>
    <div class="store-phone-number">${phone}</div>
  </div>
  <div class="store-number-container">
    <div class="store-number">
      ${index + 1}
    </div>
  </div>
    </div>
  </div>`;
  });

  document.querySelector(".store-list").innerHTML = storeHtml;
}

function showStoreMarker(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name;
    var address = store.addressLines[0];
    var statusText = store.openStatusText;
    var phone = store.phoneNumber;
    createMarker(latlng, name, address, statusText, phone, index);
    bounds.extend(latlng);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, statusText, phone, index) {
  var html = `
          <div class="store-info-window">
            <div class="store-info-name">
               ${name}
            </div>
            <div class="store-info-status">
               ${statusText}
            </div>
            <div class="store-info-address">
              <div class="circle">
                <i class="fas fa-location-arrow"></i>
              </div>
               ${address}
            </div>
            <div class="store-info-phoneNumber">
              <div class="circle">
                <i class="fas fa-phone-alt"></i>
              </div>
               ${phone}
            </div>
          </div>
  `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index + 1}`,
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
