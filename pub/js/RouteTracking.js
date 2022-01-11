"use strict";

// The main library js

(function(global, document, $) { 
	let allStations = new Map();
	var index = 0;

	class Station {
		constructor(name, x, y, type, detail) {
			this.name = name;
			this.x = x;
			this.y = y;
			this.width = 20;
			this.height = 20;
			this.offsetX = 0;
			this.offsetY = 0;

			//four types: source, destination, intermediate, current
			this.type = type;
			this.detail = detail;
		}
	}


	function RouteTrackingGenerator(canvas_id) {
		this.id = canvas_id
		this.source = null
		this.destionation = null
		this.currLoc = null;
		this.currPos = null;
		this.selectedStation = null;
		this.stations = []
		allStations.set(this.id, this.stations);

		//set canvas
		this.canvas = document.getElementById(canvas_id)
		this.canvas.width = 800
		this.canvas.height = 500
		this.ctx = this.canvas.getContext('2d')

	}

	RouteTrackingGenerator.prototype = {
		changeMapSize: function(width, height){
			this.canvas.width = width;
			this.canvas.height = height;
		},

		addStation: function(name, x, y, type, detail, position){
			const station = new Station(name, x, y, type, detail)

			if (type === 'source'){
				this.source = station
				this.stations.unshift(station)
			} else if (type === 'destination'){
				this.destionation = station
				this.stations.push(station)
			} else if (type === 'intermediate'){
				if (this.stations.length >= 1){
					if (this.stations[this.stations.length-1].type === 'destination'){
						this.stations.splice(this.stations.length-1, 0, station)
					}else{
						this.stations.push(station)
					}
				}else{
					this.stations.push(station)
				}
			}else{
				this.currLoc = station;
				this.stations.splice(position, 0, station)
				this.currPos = position
			}
			allStations.set(this.id, this.stations);
			this.showRoute()
			displayAllStations(this)
		},

		addStationEvent: function(e) {
			e.preventDefault();

			const x = e.offsetX
			const y = e.offsetY

			for (let i = 0; i < this.stations.length; i++){
		    	const station = this.stations[i]
				if(x >= (station.x - station.offsetX) && x <= (station.x - station.offsetX) + station.width &&
		       		y >= (station.y - station.offsetY) && y <= (station.y - station.offsetY) + station.height){
					console.log('pressed something')
					this.changeType(i)
					return 0;
		    	}
		    }

			if (!this.getStationType('current')){
				this.setCurrLoc(x, y)
			}else{
				this.findClosest(x, y, 'intermediate')
			}
		},

		showAnimation: function(e){
			e.preventDefault()
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.displayOnlyStation()
			drawLine(this)
		},

		setCurrLoc: function(x, y){
			if (!this.currLoc){
				this.findClosest(x, y, 'current')
			}
		},

		findClosest: function(x, y, type){
			let added = false;
			let x0;
			let y0;
			let x1;
			let y1;
			let i;

			for (i = 0; i < this.stations.length - 1; i++){
				x0 = this.stations[i].x
				y0 = this.stations[i].y
				x1 = this.stations[i+1].x
				y1 = this.stations[i+1].y

				if (onLine(x, y, x0, y0, x1, y1)){
					added = true;
					// log('On the way to next station: ' + this.stations[i+1].name)
					if (type === 'current'){
						this.addStation('Current Location', x, y, type, 'On the way to next station: ' + this.stations[i+1].name, i + 1)
					}else{
						// log(x, y, i+1)
						this.addStation('Intermediate location', x, y, type, '', i + 1)
		
					}
					break;
				}
			}
			if (!added){
				if (type === 'intermediate'){
					this.addStation('Intermediate location', x, y, type, '', i + 1)
				}else{
					this.addStation('Current location', x, y, type, '', this.stations.length - 1)
				}
				
			}

		},

		getStationType: function(type, input){
			let curr = null;
			for (let i = 0; i < this.stations.length; i++){
				if (this.stations[i].type === type && input != i){
					return true;
				}
			}
			return false;
		},

		getStations: function(x, y){
			for (let i = 0; i < this.stations.length; i++){
				if (this.stations[i].x == x && this.stations[i].y == y){
					if (i + 1 < this.stations.length){
						return [this.stations[i], this.stations[i+1]];
					}else{
						return [this.stations[i], null];
					}
					
				}
			}
			return [null, null];
		},

		showPath: function(e){
			e.preventDefault()
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.displayOnlyStation()
			index = 0
			if (this.stations.length >= 1){
				const xy = {x: this.stations[0].x, y: this.stations[0].y}
				showProgress(this,xy)
			}
			animate(this)
		},

		displayOnlyStation: function(){
			let station = null;
			for (let i = 0; i < this.stations.length; i++){
				station = this.stations[i]
				if (station.type === 'source'){
					this.ctx.fillStyle = 'blue'
				}else if (station.type === 'intermediate'){
					this.ctx.fillStyle = 'black'
				}else if (station.type === 'destination'){
					this.ctx.fillStyle = 'red'
				}else {
					this.ctx.fillStyle = '#8E40CA'
				}
				this.ctx.fillRect(station.x, station.y, 20, 20)
			}
		},

		changeType: function(i){
			const station = this.stations[i]
			if (station.type === 'intermediate' && !this.getStationType('destination', i)){
				station.type = 'destination'
			}else if (station.type === 'intermediate' && !this.getStationType('current', i)){
				station.type = 'current'
			}else if (station.type === 'current'){
				station.type = 'intermediate'
			}
			this.showRoute()
		},

		showRoute: function(){
			//clear the canvas for redrawing
			//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.lineWidth = 3;
			for (let i = 0; i < this.stations.length; i++){
				// https://www.w3schools.com/graphics/canvas_coordinates.asp
				const curr = this.stations[i]
				this.ctx.strokeStyle = "black"
				if (curr.type === "source"){
					this.ctx.beginPath();
					this.ctx.moveTo(curr.x, curr.y);
				    this.ctx.fillStyle = "blue"
				    this.ctx.fillRect(curr.x, curr.y, 20, 20)
				}else{
					if (curr.type === "intermediate"){
						this.ctx.fillStyle = "black"
					}else if (curr.type === "destination"){
						this.ctx.fillStyle = "red"
					}else{
						this.ctx.fillStyle = "#8E40CA"
					}
					this.ctx.fillRect(curr.x, curr.y, 20, 20)
					this.ctx.lineTo(curr.x, curr.y);
				}
				this.ctx.stroke();
			}
		},

		//the following event listener function was modified from source: https://www.youtube.com/watch?v=FIyaIewZQsI
		onDown: function(e) {
			e.preventDefault();
			this.selectedStation = getStation(e, this)
			if (this.selectedStation != null){
				this.selectedStation.offsetX = e.offsetX - this.selectedStation.x
				this.selectedStation.offsetY = e.offsetY - this.selectedStation.y
			}
		},

		onUp: function(e) {
			e.preventDefault();
			this.selectedStation = null;
		},

		onMove: function(e) {
			e.preventDefault();
			//show mouse position as it moves
			const mouse = this.canvas.parentElement.previousElementSibling
			mouse.innerHTML = `<p>Current Mouse Position: (x = ${e.offsetX}, y = ${e.offsetY})</p>`

			if (this.selectedStation != null){
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				const [x, y] = mouseLoc(e, this)
				this.selectedStation.x = x - this.selectedStation.offsetX
				this.selectedStation.y = y - this.selectedStation.offsetY
				this.selectedStation.offsetX = 0
				this.selectedStation.offsetY = 0
				this.showRoute()
			}else{
				showInfo(e)
			}
		},
	}

	//helper functions
	function onLine(x, y, x0, y0, x1, y1){
		// let result = n
		if (x0 == x1){
			if (y0 < y1 && y >= y0 && y <= y1){
				return true;
			}else if (y0 > y1 && y >= y1 && y <= y0){
				return true;
			}
		}else{
			const slope = (y1 - y0) / (x1 - x0)
			const intercept = y0 - slope * x0
			const value = slope * x + intercept
			if (y <= value + 10 && y >= value - 10) {
				if (slope > 0 && x >= x0 && y >= y0 && x <= x1 && y <= y1){
					return true;
				}else if (slope < 0 && x <= x0 && y >= y0 && x >= x1 && y <= y1){
					return true;
				}
			}
		}
		return false;
	}

	//source: https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path
	// set starting values
	var percent = 0
	var direction = 1;

	function animate(rtg) {
	    percent += direction;
	    if (percent > 120) {
	        percent = 0;
	    };

	    if (index < rtg.stations.length - 1){
	    	if (index >= rtg.currPos){
	    		rtg.ctx.strokeStyle = "grey";
	    		rtg.ctx.fillStyle = "grey"
	    	}else{
	    		rtg.ctx.strokeStyle = "#2C62DE";
	    		rtg.ctx.fillStyle = "#2C62DE"
	    	}
	    	draw(rtg, percent);
	    	// request another frame
		    requestAnimationFrame(function(){
		    	animate(rtg)
		    });
		}
		else{
			setTimeout(function(){
				const route = rtg.nextElementSibling.nextElementSibling
				route.innerHTML = ''
				rtg.showRoute()
			}, 3000)
		}
	}

	// draw the current frame based on percent
	function draw(rtg, percent) {
	    // draw the tracking arc
	    var xy;

	    xy = getLineXYatPercent({
	        x: rtg.stations[index].x,
	        y: rtg.stations[index].y
	    }, {
	        x: rtg.stations[index+1].x,
	        y: rtg.stations[index+1].y
	    }, percent/120);
	   
	    if (xy.x == rtg.stations[index+1].x && xy.y == rtg.stations[index+1].y){
	    	index = index + 1;
	    	showProgress(rtg, xy)
	    }
	    drawDot(rtg, xy);
	}

	// draw tracking arc at point
	function drawDot(rtg, point) {
	    rtg.ctx.beginPath();
	    rtg.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
	    rtg.ctx.fill();
	    rtg.ctx.stroke();
	}

	function getLineXYatPercent(startPt, endPt, percent) {
	    var dx = endPt.x - startPt.x;
	    var dy = endPt.y - startPt.y;
	    var X = startPt.x + dx * percent;
	    var Y = startPt.y + dy * percent;
	    return ({
	        x: X,
	        y: Y
	    });

	}

	function showProgress(rtg, xy){
		const route = rtg.canvas.nextElementSibling.nextElementSibling;
		route.innerHTML = ''

		const p = document.createElement('p')
		p.innerHTML = `Position of the last passed station: x: ${xy.x}, y: ${xy.y}`
		p.style = 'font-weight: bold'
		route.appendChild(p)

		const [station, nextStation] = rtg.getStations(xy.x, xy.y)

		if (station){
			const p1 = document.createElement('p')
			if (station.type === 'source'){
				p1.innerHTML = `Initial Station: ${station.name}`
			}else{
				p1.innerHTML = `Arrived Station: ${station.name}`
			}
			p1.style = 'font-weight: bold'
			p1.style.color = 'blue'
			route.appendChild(p1)

			if (nextStation){
				const p2 = document.createElement('p')
				p2.innerHTML = `Next Station: ${nextStation.name}`
				p2.style = 'font-weight: bold'
				p2.style.color = 'red'
				route.appendChild(p2)
			}
		}
	}

	//get current mouse location
	function mouseLoc(e, rtg){
		const rect = rtg.canvas.getBoundingClientRect()
	    return [e.clientX - Math.round(rect.left), e.clientY - Math.round(rect.top)];
	}

	function getStation(e, rtg) {
	 	const [x, y] = mouseLoc(e, rtg)
		for (let i = 0; i < rtg.stations.length; i++){
			const station = rtg.stations[i]
			if (x >= (station.x - station.offsetX) && x <= (station.x - station.offsetX) + station.width &&
	       		y >= (station.y - station.offsetY) && y <= (station.y - station.offsetY) + station.height) {
		      	return station;
		    }
		}
	  return null;
	}

	function deleteStationEvent(e, rtg) {
		e.preventDefault();

		const name = document.querySelector('#name').value
		rtg.deleteStation(name)
	}

	//source: https://stackoverflow.com/questions/14484678/how-to-animate-the-drawing-of-a-curve-with-canvas
	let currentPoint = 1
	let nextTime = new Date().getTime()
	let pace = 800

	function drawLine(rtg){
		if (currentPoint >= rtg.stations.length){
			setTimeout(() => rtg.showRoute(), 1000)
		}else{
			if(new Date().getTime() > nextTime){
		        nextTime = new Date().getTime() + pace;
		        currentPoint++;
		    }
		    rtg.ctx.beginPath();
		    rtg.ctx.moveTo(rtg.stations[0].x, rtg.stations[0].y);
		    rtg.ctx.lineWidth = 3;
		    rtg.ctx.strokeStyle = '#3C74E2';
		    rtg.ctx.fillStyle = '#3C74E2';
		    for (let p = 1; p < currentPoint; p++) {
		        rtg.ctx.lineTo(rtg.stations[p].x, rtg.stations[p].y);
		    }
		    rtg.ctx.stroke();

		    //call itself recursively
		    requestAnimationFrame(function(){
		    	drawLine(rtg)
		    });
		}
	}

	// Listen for mouse hovers over
	function showInfo(e) {
		e.preventDefault();
		const display = e.target.nextElementSibling
		display.innerHTML = ''
		
		const stations = allStations.get(e.target.id)
		const canvas = e.target
		const ctx = canvas.getContext('2d')

		//source: https://stackoverflow.com/questions/29300280/update-html5-canvas-rectangle-on-hover/37619815
		//get current mouse position
		const rect = canvas.getBoundingClientRect()
	    const x = event.clientX - rect.left
	    const y = event.clientY - rect.top

	    for (let i = 0; i < stations.length; i++){
	    	const station = stations[i]
			if(x >= (station.x - station.offsetX) && x <= (station.x - station.offsetX) + station.width &&
	       		y >= (station.y - station.offsetY) && y <= (station.y - station.offsetY) + station.height){
				displayStation(display, station, true)
	    	}else{
	    		displayStation(display, station, false);
	    	}
	    }
	}

	function displayAllStations(rtg) {
		const display = document.querySelector('.info')
		display.innerHTML = ''

	    for (let i = 0; i < rtg.stations.length; i++){
	    	const station = rtg.stations[i]
			displayStation(display, station, false);
	    
	    }
	}

	function displayStation(display, station, onHover){
		const info = display
		const div = document.createElement('div')
		div.id = station.id
		info.appendChild(div)

		const p1 = document.createElement('p')
		div.appendChild(p1)

		if (onHover){
			p1.innerHTML = `Name: ${station.name}<br />Type: ${station.type}<br />Details: ${station.detail}<br />Location: (x: ${station.x}, y: ${station.y})`
			p1.style = 'font-weight: bold'
			if (station.type === 'source'){
				p1.style.color = 'blue'
			}else if (station.type === 'destination'){
				p1.style.color = 'red'
			}else if (station.type === 'current'){
				p1.style.color = '#8E40CA'
			}
			
		}else{
			p1.innerHTML = `(${station.type}) ${station.name}: (x: ${station.x}, y: ${station.y})`
			if (station.type === 'source'){
				p1.style.color = 'blue'
			}else if (station.type === 'destination'){
				p1.style.color = 'red'
			}else if (station.type === 'current'){
				p1.style.color = '#8E40CA'
			}
		}
	}

	// After setup:
	// Add the CircleGenerator to the window object if it doesn't already exist.
	global.RouteTrackingGenerator = global.RouteTrackingGenerator || RouteTrackingGenerator

})(window, window.document, $); // pass the global window object and jquery to the anonymous function. They will now be locally scoped inside of the function.
