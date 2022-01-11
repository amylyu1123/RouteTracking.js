"use strict";

window.addEventListener('DOMContentLoaded', loadPage)
const tags = document.getElementById('tags1')
tags.addEventListener('change', updateDemoCode)

const tags2 = document.getElementById('tags2')
tags2.addEventListener('change', updateDemoCode)

const tags3 = document.getElementById('tags3')
tags3.addEventListener('change', updateDemoCode)

function loadPage(e){
	const divs = [document.querySelector('#displayCode1'), document.querySelector('#displayCode2'), document.querySelector('#displayCode3')]
	for (let i = 0; i < divs.length; i++){
		manipulateDisplay('JS', divs[i])
	}
}

function updateDemoCode(e){
	const tag = e.target.value;
	const display = e.target.parentElement.nextElementSibling
	manipulateDisplay(tag, display)
}

function manipulateDisplay(tag, display){

	//clear all displayed before
	display.innerHTML = '';
	if (tag === 'JS'){
		if (display.id === 'displayCode1'){
			display.innerHTML = 
	`<pre>
	const rtg1 = new RouteTrackingGenerator('example1')
	rtg1.addStation('source', 30, 30, 'source', 'demo source')
	rtg1.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg1.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg1.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg1.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg1.showRoute()

	document.querySelector("#example1").addEventListener('mousemove', (e) =>
		rtg1.onMove(e))

	<pre/>`
		}else if (display.id === 'displayCode2'){
			display.innerHTML = 
	`<pre>
	const rtg2 = new RouteTrackingGenerator('example2')
	rtg2.addStation('source', 30, 30, 'source', 'demo source')
	rtg2.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg2.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg2.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg2.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg2.showRoute()

	document.querySelector("#example2").addEventListener('mousedown', (e) =>
		rtg2.onDown(e))
	document.querySelector("#example2").addEventListener('mouseup', (e) =>
		rtg2.onUp(e))
	document.querySelector("#example2").addEventListener('mousemove', (e) =>
		rtg2.onMove(e))

	document.querySelector("#example2").addEventListener('dblclick', (e) =>
		rtg2.addStationEvent(e))

	<pre/>`
		}else{
			display.innerHTML = 
	`<pre>
	const rtg3 = new RouteTrackingGenerator('example3')
	rtg3.addStation('source', 30, 30, 'source', 'demo source')
	rtg3.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg3.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg3.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg3.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg3.showRoute()

	document.querySelector("#demo").addEventListener('click', (e) =>
		rtg3.showAnimation(e))

	document.querySelector("#animate").addEventListener('click', (e) => 
		rtg3.showPath(e))

	document.querySelector("#example3").addEventListener('mousedown', (e) =>
		rtg3.onDown(e))
	document.querySelector("#example3").addEventListener('mouseup', (e) =>
		rtg3.onUp(e))
	document.querySelector("#example3").addEventListener('mousemove', (e) =>
		rtg3.onMove(e))

	document.querySelector("#example3").addEventListener('dblclick', (e) =>
		rtg3.addStationEvent(e))
	<pre/>`
		}
	}else if (tag === 'HTML'){
		if (display.id === 'displayCode1'){
			display.innerHTML = 
	`<pre>
	&lt;canvas id="example1"&gt;&lt;/canvas&gt; 
	&lt;div class="info"&gt;&lt;/div&gt;
	<pre/>`
		}else if (display.id === 'displayCode2'){
			display.innerHTML = 
	`<pre>
	&lt;canvas id="example2"&gt;&lt;/canvas&gt; 
	&lt;div class="info"&gt;&lt;/div&gt;
	<pre/>`
		}else{
			display.innerHTML = 
	`<pre>
	&lt;div/&gt;
	&lt;button id="demo"&gt;Show Animation For the whole route&lt;/button&gt;
    	&lt;button id="animate"&gt;Show Animation for route progress&lt;/button&gt;&lt;div/&gt;
	&lt;canvas id="example3"&gt;&lt;/canvas&gt; 
	&lt;div class="info"&gt;&lt;/div&gt;
	&lt;div class="progress"&gt;&lt;/div&gt;  
	<pre/>`
		}
	
	}else{ // CSS
		if (display.id === 'displayCode1'){
			display.innerHTML = 
	`<pre>
	canvas {
	  float: left;
	  outline: black 3px solid;
	}

	.info{
	  float: right;
          margin-right: 190px;
	}
	<pre/>`
		}else if (display.id === 'displayCode2'){
			display.innerHTML = 
	`<pre>
	canvas {
	  float: left;
	  outline: black 3px solid;
	}

	.info{
	  float: right;
          margin-right: 190px;
	}
	<pre/>`
		}else {
			display.innerHTML = 
	`<pre>
	canvas {
	  float: left;
	  outline: black 3px solid;
	}

	.info{
	  float: right;
          margin-right: 190px;
	}

	.progress{
	  float: left;
	  margin-left: 140px;
	}

	button {
	  width: 300px;
	  height: 40px;
	  background-color: #6959d9;
          font-variant: all-small-caps;
          color: white;
          font-size: 100%;
          border-radius: 8px;
	}
	<pre/>`
		}
	}

}

//three examples below

const rtg1 = new RouteTrackingGenerator('example1')

function example1() {
	rtg1.addStation('source', 30, 30, 'source', 'demo source')
	rtg1.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg1.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg1.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg1.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg1.showRoute()

	document.querySelector("#example1").addEventListener('mousemove', (e) =>
		rtg1.onMove(e))


}

const rtg2 = new RouteTrackingGenerator('example2')

function example2() {
	rtg2.addStation('source', 30, 30, 'source', 'demo source')
	rtg2.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg2.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg2.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg2.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg2.showRoute()

	document.querySelector("#example2").addEventListener('mousedown', (e) =>
		rtg2.onDown(e))
	document.querySelector("#example2").addEventListener('mouseup', (e) =>
		rtg2.onUp(e))
	document.querySelector("#example2").addEventListener('mousemove', (e) =>
		rtg2.onMove(e))

	document.querySelector("#example2").addEventListener('dblclick', (e) =>
		rtg2.addStationEvent(e))
}

const rtg3 = new RouteTrackingGenerator('example3')

function example3() {
	rtg3.addStation('source', 30, 30, 'source', 'demo source')
	rtg3.addStation('destination', 400, 400, 'destination', 'demo destination')
	rtg3.addStation('intermediate station1', 100, 100, 'intermediate', 'demo first intermediate station')
	rtg3.addStation('intermediate station2', 700, 200, 'intermediate', 'demo second intermediate station')
	rtg3.addStation('intermediate station3', 500, 300, 'intermediate', 'demo third intermediate station')

	rtg3.showRoute()

	document.querySelector("#demo").addEventListener('click', (e) =>
		rtg3.showAnimation(e))

	document.querySelector("#animate").addEventListener('click', (e) => 
		rtg3.showPath(e))

	document.querySelector("#example3").addEventListener('mousedown', (e) =>
		rtg3.onDown(e))
	document.querySelector("#example3").addEventListener('mouseup', (e) =>
		rtg3.onUp(e))
	document.querySelector("#example3").addEventListener('mousemove', (e) =>
		rtg3.onMove(e))

	document.querySelector("#example3").addEventListener('dblclick', (e) =>
		rtg3.addStationEvent(e))
}

example1();
example2();
example3();

