/*global require*/
requirejs.config({
    baseUrl: '.',
    paths: {
        'domReady': './lib/requirejs-2.1.9/domReady',
        'Cesium': './Cesium/Cesium',
        'echarts_gl': './lib/echarts/echarts-gl',
        'echarts': './lib/echarts/echarts',
        'jquery': './lib/jquery-2.1.1/jquery',
        //"GLMap": './lib/GLMap',
        "init": './init',
        "fly": './fly',
        "CesiumMenu": './CesiumMenu',
        "snow": './snow',
        "rain": './rain',
        "cloud": './cloud',
        "contour": './contour',
        "lineCharts": './lineCharts'
    },
    shim: {
        'echarts_gl': {
            deps: ['echarts']
        }
    }
});

requirejs(['init', 'fly', 'CesiumMenu','lineCharts'], function(init) {
// //require(["./lib/GLMap.js"], function() ;
    const mode = {
        debug: demo ? false : true
    };
    var viewer = init.initCesium(mode);
    var menu = new Menu(viewer, mode);
    //new Contour(viewer);
    
    //FlyModel(this.viewer);
});