'use strict';

const Table = require('cli-table');
const gridSize = 14;
const gameSpeed = 400 //millisecs

// curl http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/3275\?res\=3hourly\&key\=[YOUR_API_KEY] | python -m json.tool > loftus_3hr_forecast.json
const loftus = require('./charmouth_3hr_forecast.json');
const weatherData = loftus.SiteRep.DV.Location.Period[0].Rep.map((data) => {
	return {
		"time": data.$,
		"direction": data.D,
		"wind_speed": data.S,
	};
});
let iteration = 0;
let numDataPoints = weatherData.length;
let currentGridRef = {"x": gridSize/2, "y": gridSize/2};

// Game loop
const main = setInterval(() => {

	let exitGame = false;

	while (!exitGame) {
		let grid = createGrid();
		
		// Mark the grid
		grid[currentGridRef.y][currentGridRef.x] = 'x';

		// Print the grid
		console.log(grid.toString());

		// Reset the mark
		grid[currentGridRef.y][currentGridRef.x] = ' ';

		if (typeof weatherData[iteration] == 'undefined') process.exit();

		updateCurrentGridReference(weatherData[iteration].direction);

		setTimeout(() => {
			resetView();
		}, gameSpeed - 1);

		iteration++;

		if (iteration <= numDataPoints) {
			exitGame = true;
		} 
	}

}, gameSpeed);



// Helpers
let createGrid = () => {
	const grid = new Table();
	for (let i=0;i<=gridSize;i++) {
		grid.push(buildGridRow());
	}
	return grid;
}

function buildGridRow() {
	return Array.apply(null, Array(gridSize)).map(String.prototype.valueOf, ' ');
}

function updateCurrentGridReference(direction) {
	direction.split('').map((value) => {
		switch(value) {
			case 'N':
				currentGridRef.y++;
			break;
			case 'S':
				currentGridRef.y--;
			break;
			case 'E':
				currentGridRef.x--;
			break;
			case 'W':
				currentGridRef.x++;
			break;
		}
	});
}

function resetView() {
	process.stdout.moveCursor(0, -31);
};
