
window.onload = function()
{

	var vm = new Vue({
		//el: '#app',
		data: {
			map: null,
			schoolsData: {},
			//status:'',
			loading: false,
			mapCenter: [-7.945261001586914, 40.2302011147538],
			mapZoom: 10,
			//trackNames: ['ferradas', 'rory'],
			tracks: {},
			filters: [],
			marker: {
				className: 'pin1'
			}
		},
		computed: {

		},
		filters: {

		},
		watch: {
			schoolsData: function(newVal, oldVal)
			{
				//console.log(newVal);
				this.populateFilters();
			}
		},
		created: function(){
			this.log('app created');
		},
		mounted: function(){
			this.setup();
		},
		methods: {
			log: function(msg)
			{
				console.log(msg);
			},
			setup: function()
			{
				mapboxgl.accessToken = 'pk.eyJ1Ijoic2hvYWwiLCJhIjoiY2s4OHh3eWJvMDExeTNncGtjMTdxcXhodCJ9.Hb7RLLV3cP-7pbL_vMUJpg';

			    this.map = new mapboxgl.Map({
			        container: 'map',
			        //style: 'mapbox://styles/mapbox/streets-v11',
			        //style: 'mapbox://styles/mapbox/satellite-streets-v11',
			        style: 'mapbox://styles/mapbox/light-v9',
			        center: this.mapCenter,
			        zoom: this.mapZoom
			    });

				this.map.on('load', () =>
				{
					this.addGeocoder();
					this.addControls();
					this.addGeolocate('automatic');
					this.fetchSchools();
				});
			},
			addGeocoder: function()
			{
				// geocoder
				this.map.addControl(
					new MapboxGeocoder({
						accessToken: mapboxgl.accessToken,
						mapboxgl: mapboxgl
					})
				);
			},
			addControls: function()
			{
				this.map.addControl(new mapboxgl.NavigationControl());
			},
			addGeolocate: function(method = 'manual')
			{

				if(method == 'manual')
				{
					// geolocate (manual)

					var geoLocate = new mapboxgl.GeolocateControl({
						fitBoundsOptions: {
				            //zoom: 10,
				        },
						positionOptions: {
							enableHighAccuracy: true
						},
						trackUserLocation: true
					});

					map.addControl(geoLocate);

					geoLocate.on('geolocate', function(e){
						console.log('geolocated');
						// map.setZoom(8);
						map.setZoom(map.getZoom());
					});

				}
				else
				{
					// geolocate (automatic)

					navigator.geolocation.getCurrentPosition(position => {

						const userCoordinates = [position.coords.longitude, position.coords.latitude];

						this.map.addSource("user-coordinates", {
							type: "geojson",
							data: {
								type: "Feature",
								geometry: {
									type: "Point",
									coordinates: userCoordinates
								}
							}
						});

						this.map.addLayer({
							id: "user-coordinates",
							source: "user-coordinates",
							type: "circle"
						});

						// map.flyTo({
						// 	center: userCoordinates,
						// 	zoom: 14
						// });

						// this.setState({
						// 	resolvingLocation: false,
						// 	userCoordinates
						// });

					});
				}

			},
			fetchSchools: function()
			{

				// map.addSource('schools', {
				// 	type: 'geojson',
				// 	data: 'data/schools.json'
				// });
				//
				// map.addLayer({
		        //     "id": "schools",
		        //     "type": "circle",
		        //     "source": "schools",
		        //     "paint": {
				// 		"circle-radius": 5,
				// 		"circle-color": "#ff0000"
		        //     }
		        // });

				var self = this;

				let _url = 'data/schools.json?' + Math.random();

				fetch(_url)
					.then(response =>
					{
						return response.json();
					})
					.then(data =>
					{
						//console.log(data);

						this.schoolsData = data;

						var coordinates = Array();

						data.features.forEach((marker) =>
						{

							if(marker.geometry.coordinates.length)
							{
								//console.log(marker.geometry.coordinates);

								let _html = `<div class="school school-status--${marker.properties.status}" data-layer-id="">
											<p class="school__name">${marker.properties.title}</p>
											<p class="school__type">${marker.properties.type}</span></p>
											<p class="school__web"><a href="${marker.properties.web}">website</a></p>
											<p class="school__description">${marker.properties.description}</p>
											</div>`;

								// popup
								let _popup = new mapboxgl.Popup({ offset: 25 }).setHTML(_html);


								// create a HTML element for each feature
								var el = document.createElement('div');
								el.innerHTML = '<div class="pin"></div>';

								// we can change this depending on some data in the geoJSON if we want to...
								el.className = this.marker.className;

								// make a marker for each feature and add it to the map
								new mapboxgl.Marker(el)
									.setLngLat(marker.geometry.coordinates)
									.setPopup(_popup)
									.addTo(this.map);

								// add coords to array
								coordinates.push(marker.geometry.coordinates);
							}

						});


						// calculate bounding box (by magic!)
						var bounds = coordinates.reduce(function(bounds, coord) {
							return bounds.extend(coord);
						}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));


						// fit bounds
						this.map.fitBounds(bounds, {
							padding: 100
						});


					}).catch(err =>
					{
						console.log(err);
					});
			},
			populateFilters: function()
			{
				 console.log(this.schoolsData);


				// places.features.forEach(function(feature)
				// {
				// 	var symbol = feature.properties['icon'];
				// 	var layerID = 'poi-' + symbol;
				//
				// 	// Add a layer for this symbol type if it hasn't been added already.
				// 	if(!map.getLayer(layerID))
				// 	{
				// 		map.addLayer({
				// 			'id': layerID,
				// 			'type': 'symbol',
				// 			'source': 'places',
				// 			'layout': {
				// 				'icon-image': symbol + '-15',
				// 				'icon-allow-overlap': true
				// 			},
				// 			'filter': ['==', 'icon', symbol]
				// 		});
				//
				// 		// Add checkbox and label elements for the layer.
				// 		var input = document.createElement('input');
				// 		input.type = 'checkbox';
				// 		input.id = layerID;
				// 		input.checked = true;
				// 		filterGroup.appendChild(input);
				//
				// 		var label = document.createElement('label');
				// 		label.setAttribute('for', layerID);
				// 		label.textContent = symbol;
				// 		filterGroup.appendChild(label);
				//
				// 		// When the checkbox changes, update the visibility of the layer.
				// 		input.addEventListener('change', function(e) {
				// 			map.setLayoutProperty(
				// 			layerID,
				// 			'visibility',
				// 			e.target.checked ? 'visible' : 'none'
				// 			);
				// 		});
				//
				// 	}
				//
				// });
			},
			toggleFilter: function()
			{

			}

		}
	}).$mount('#app')

};
