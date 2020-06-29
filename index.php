<html style="">
<head>

	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Add a GeoJSON polygon</title>

	<!-- <script type="text/javascript" src="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.js"></script>
	<link rel="stylesheet" type="text/css" href="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.css"> -->

	<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"></script>

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/1.11.0/mapbox-gl.css" type="text/css" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/1.11.0/mapbox-gl.min.js"></script>

	<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css" type="text/css" />
	<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js"></script>

	<link rel="stylesheet" href="assets/css/main.css" />

</head>
<body>

<div id="map">
</div>


<script type="text/javascript">

	mapboxgl.accessToken = 'pk.eyJ1Ijoic2hvYWwiLCJhIjoiY2s4OHh3eWJvMDExeTNncGtjMTdxcXhodCJ9.Hb7RLLV3cP-7pbL_vMUJpg';

    var map = new mapboxgl.Map({
        container: 'map',
        //style: 'mapbox://styles/mapbox/streets-v11',
        //style: 'mapbox://styles/mapbox/satellite-streets-v11',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-7.945261001586914,40.2302011147538],
        zoom: 15
    });

	map.addControl(
		new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl
		})
	);

	map.addControl(new mapboxgl.NavigationControl());


    map.on('load', function()
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


		let _url = 'data/schools.json?' + Math.random();

		fetch(_url)
			.then(response =>
			{
				return response.json();
			})
			.then(data =>
			{
				//console.log(data);

				var coordinates = Array();

				data.features.forEach(function(marker)
				{

					if(marker.geometry.coordinates.length)
					{
						// create a HTML element for each feature
						var el = document.createElement('div');
						el.className = 'marker';

						//console.log(marker.geometry.coordinates);

						// popup
						let _popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
							'<h3>' + marker.properties.title + '</h3>' +
							'<p>' + marker.properties.type + '</p>' +
							'<p><a href="' + marker.properties.web + '">website</a></p>'
						);

						// make a marker for each feature and add it to the map
						new mapboxgl.Marker(el)
							.setLngLat(marker.geometry.coordinates)
							.setPopup(_popup)
							.addTo(map);

						// add coords to array
						coordinates.push(marker.geometry.coordinates);
					}

				});


				// calculate bounding box (by magic!)
				var bounds = coordinates.reduce(function(bounds, coord) {
					return bounds.extend(coord);
				}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));


				// fit bounds
				map.fitBounds(bounds, {
					padding: 100
				});


			}).catch(err =>
			{
				console.log(err);
			});



    });

</script>



</body>
</html>
