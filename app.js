import {
	Menu
} from './lib/initJS/CesiumMenu.js';
import {
	init
} from './lib/initJS/init.js';
import {
	Css
} from './lib/initJS/css.js';
import {
	adjust
} from './lib/initJS/adjust.js'
$(document).ready(function() {
	//wind file options
	window.fileOptions = {
		dataDirectory: false ? 'https://raw.githubusercontent.com/RaymanNg/3D-Wind-Field/master/data/' : 'data/',
		dataFile: "demo.nc",
		glslDirectory: false ? '../Cesium-3D-Wind/glsl/' : './lib/windJs/glsl/'
	}
	// const mode = {
	//         debug: demo ? false : true
	//     };

	var initial = new init();
	var css = new Css();
	var menu = new Menu(initial.viewer);
	new adjust(initial.viewer);
});