<!DOCTYPE html>
<html>
<head>

<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' />

<title>Alternative Schools</title>

<!-- <script type="text/javascript" src="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.js"></script>
<link rel="stylesheet" type="text/css" href="https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.css"> -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/1.11.0/mapbox-gl.css" type="text/css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/1.11.0/mapbox-gl.min.js"></script>

<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css" type="text/css" />
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js"></script>

<link rel="stylesheet" href="assets/css/main.css?<?= rand(); ?>" />

</head>
<body>


<div id="app">

	<div id="filters" class="filters">

		<div class="filter" v-for="filter in filters" @click='toggleFilter(filter)'>
		<div class="track__name">{{ filter }}</div>
		</li>

	</div>

	<div id="map"></div>

</div>


<script src="assets/js/app.js"></script>


</body>
</html>
