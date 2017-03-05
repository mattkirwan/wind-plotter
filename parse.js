'use strict';

var Table = require('cli-table');

// curl http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/3275\?res\=3hourly\&key\=[YOUR_API_KEY] | python -m json.tool > loftus_3hr_forecast.json
let loftus = require('./loftus_3hr_forecast.json');

let filtered = loftus.SiteRep.DV.Location.Period[0].Rep.map((data) => {
	return {
		"time": data.$,
		"direction": data.D,
		"wind_speed": data.S,
	};
});

filtered.map((data) => {
	console.log(data.direction)
});

let current_grid_ref = {"x": 7, "y": 7};

var table = new Table();

table.push(
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
);

let write = (filtered, iteration) => {

	table[current_grid_ref.y][current_grid_ref.x] = 'x';
	console.log(table.toString());

	if (typeof filtered[iteration] == 'undefined') process.exit();

	switch(filtered[iteration].direction) {
		
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

};

let resetView = () => {
	process.stdout.moveCursor(0, -31);
};

let i = 0;
let num_data_points = filtered.length;

let gameLoop = setInterval(() => {

	if (i <= num_data_points) {
		write(filtered, i);

		setTimeout(() => {
			resetView();
		}, 200);

		i++;	
	} else {
		process.exit();
	}

}, 1000);




