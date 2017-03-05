'use strict';

const Table = require('cli-table');

// curl http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/3275\?res\=3hourly\&key\=[YOUR_API_KEY] | python -m json.tool > loftus_3hr_forecast.json
const loftus = require('./loftus_3hr_forecast.json');
const weather_data = loftus.SiteRep.DV.Location.Period[0].Rep.map((data) => {
	return {
		"time": data.$,
		"direction": data.D,
		"wind_speed": data.S,
	};
});
let iteration = 0;
let num_data_points = weather_data.length;
let current_grid_ref = {"x": 7, "y": 7};

// Gameloop
setInterval(() => {

	if (iteration <= num_data_points) {

		let grid = createGrid();
		grid[current_grid_ref.y][current_grid_ref.x] = 'x'; // Mark the grid
		console.log(grid.toString()); // Print the grid
		grid[current_grid_ref.y][current_grid_ref.x] = ' '; // Reset the mark

		if (typeof weather_data[iteration] == 'undefined') process.exit();
		
		updateCurrentGridReference(weather_data[iteration].direction);

		setTimeout(() => {
			resetView();
		}, 200);

		iteration++;

	} else {
		process.exit();
	}

}, 1000);

let createGrid = () => {
	const grid = new Table();
	for (let i=0;i<=14;i++) {
		grid.push(buildGridRow());
	}
	return grid;
}

function buildGridRow() {
	return Array.apply(null, Array(14)).map(String.prototype.valueOf, ' ');
}

function updateCurrentGridReference(direction) {
	switch(direction) {
		
		case 'N':
			current_grid_ref.y++;
		break;
		case 'S':
			current_grid_ref.y--;
		break;
		case 'E':
			current_grid_ref.x--;
		break;
		case 'W':
			current_grid_ref.x++;
		break;
		
		case 'NE':
			current_grid_ref.x--;
			current_grid_ref.y++;
		break;
		case 'NW':
			current_grid_ref.x++;
			current_grid_ref.y++;
		break;
		case 'SE':
			current_grid_ref.x--;
			current_grid_ref.y--;
		break;
		case 'SW':
			current_grid_ref.x++;
			current_grid_ref.y--;
		break;

		case 'NNE':
			current_grid_ref.y++;
			current_grid_ref.y++;
			current_grid_ref.x--;
		break;
		case 'ENE':
			current_grid_ref.x--;
			current_grid_ref.y++;
			current_grid_ref.x--;
		break;
		case 'NNW':
			current_grid_ref.y++;
			current_grid_ref.y++;
			current_grid_ref.x++;
		break;
		case 'WNW':
			current_grid_ref.x++;
			current_grid_ref.y++;
			current_grid_ref.x++;
		break;

		case 'SSE':
			current_grid_ref.y--;
			current_grid_ref.y--;
			current_grid_ref.x--;
		break;
		case 'ESE':
			current_grid_ref.x--;
			current_grid_ref.y--;
			current_grid_ref.x--;
		break;
		case 'SSW':
			current_grid_ref.y--;
			current_grid_ref.y--;
			current_grid_ref.x++;
		break;
		case 'WSW':
			current_grid_ref.x++;
			current_grid_ref.y--;
			current_grid_ref.x++;
		break;
	}
}

function resetView() {
	process.stdout.moveCursor(0, -31);
};
