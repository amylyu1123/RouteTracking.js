# RouteTracking.js

A link to the landing page: https://route-tracking.herokuapp.com/

# Get Started

This is a front-end javascript library that helps develop for visualizing any kind of tracking from place to place such as parcel tracking, delivery tracking, or anything that related to it, including animation.

To set up RouteTracking.js, include the following codes to load in jQuery, javascript and css in your HTML.

         <script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
         <script defer type="text/javascript" src='js/RouteTracking.js'></script>
         <link rel="stylesheet" type="text/css" href="routeTracking.css">
     

Here is a code snippet of the basic functionality.
We begin by initializing an object of RouteTrackingGenerator with canvas' id as parameter element you want to put the route on.
Use addStation to add new stations.

JS:

		const rtg = new RouteTrackingGenerator('canvas')
        rtg.addStation('source', 30, 30, 'source', 'demo source')
        rtg.addStation('destination', 400, 400, 'destination', 'demo destination')
        rtg.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')

The following HTML contains all necessary HTML for this library

        <div/>
        <button id="demo">Show Animation For the whole route</button>
        <button id="animate">Show Animation for route progress</button><div/>
        <canvas id="canvas"></canvas> 
        <div class="info"></div>
        <div class="progress"></div>


# Documentation
Use this link to direct to the documentation: https://route-tracking.herokuapp.com/documentation.html