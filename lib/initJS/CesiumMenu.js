/*
 * @Author: YangChao 
 * @Date: 2020-02-03 21:58:14 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-06 21:30:28
 */

import {
    Wind3D
} from '../atomJS/wind3D.js';
import {
    Panel
} from '../windJS/gui.js';
import {
    Fly
} from '../toolJS/fly.js';
import {
    Snow
} from '../atomJS/snow.js';
import {
    Rain
} from '../atomJS/rain.js';
import {
    measureTool
} from '../toolJS/measure/measureTool.js';
import {
    temputureMain
} from '../atomJS/kriging/temputureMain.js';
import {
    LineCharts
} from '../echartsJS/lineCharts.js';
import {
    TempStat
} from "../echartsJS/tempstat.js";
import {
    weatherFuture
} from "../echartsJS/weatherFuture.js";
import {
    rainFallStat
} from "../echartsJS/rainfallStat.js";
import {
    weatherPie
} from "../echartsJS/weatherPie.js";
import {
    TweenMax
} from "../gsap.min.js";
import { Css } from './css.js';
import {
    drawTool
} from '../toolJS/drawTool.js';
import {
    arrowDraw
} from '../toolJS/drawArrow/drawPlot';
class Menu {
    constructor(viewer) {

        this.viewer = viewer;
        var that = this;
        var wind_gui;
        var fly_gui;
        var snow_gui;
        var rain_gui;
        var cloud_gui;
        var flow_gui;
        var flow;
        var op = function () {
            this.ShowFly = function () {
                var flyModel = new Fly(viewer);
                flyModel.initFly();
                $("#flyOptionId").fadeIn();
                var option1 = function () {
                    this.StartFly = function () {
                        flyModel.startFly();
                    }
                    this.PouseFly = function () {
                        flyModel.pauseFly();
                    }
                    this.Tracked = function () {
                        flyModel.aircraftView();
                    }
                    this.FlyBack = function () {
                        flyModel.flyBack();
                    };
                    this.FlyForward = function () {
                        flyModel.flyForward();
                    }
                    this.CustomFly = function () {
                        flyModel.customFly();
                    }
                    this.stopFly = function (clear) {
                        flyModel.stopFly(clear);
                    }
                };
                var options1 = new option1();
                $("#startfly").click(options1.StartFly);
                $("#pouse").click(options1.PouseFly);
                $("#tracked").click(options1.Tracked);
                $("#back").click(options1.FlyBack);
                $("#foward").click(options1.FlyForward);
                $("#custom").click(options1.CustomFly);
                $("#closeId2").click(function () {
                    $("#flyOptionId").fadeOut();
                    options1.stopFly(true);
                    viewer.camera.flyHome();
                    // viewer.entities.removeAll();
                })
            };
            this.ShowWind = function () {
                var box = new dat.GUI({
                    autoPlace: false
                });
                $("#windId").fadeIn();
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(120, 32.71, 10000000.0)
                });
                var panel = new Panel(viewer, box);
                var wind3D = new Wind3D(
                    panel,
                    viewer);
                var panelContainer = document.getElementsByClassName('cesium-viewer').item(0);
                box.domElement.classList.add('myPanel');
                panelContainer.appendChild(box.domElement);

                $("#closewind").click(function () {
                    //panelContainer.removeChild(box.domElement);
                    box.domElement.classList.remove('myPanel');
                    $("#windId").fadeOut();
                    wind3D.removePrimitives();
                    viewer.camera.flyHome();
                })

                box.open();
            };
            this.ShowSnow = function () {
                $("#snowId").fadeIn();
                that.resetCameraFunction();
                var snow = new Snow(viewer);
                $("#closesnow").click(function () {
                    $("#snowId").fadeOut();
                    snow.destroy();
                    viewer.camera.flyHome();
                })
                // viewer.scene.globe.depthTestAgainstTerrain = true;
            };
            this.ShowRain = function () {
                $("#rainId").fadeIn();
                that.resetCameraFunction();
                var rain = new Rain(viewer);
                $("#closerain").click(function () {
                    $("#rainId").fadeOut();
                    rain.destroy();
                    viewer.camera.flyHome();
                })
            };
            this.ShowCloud = function () {};
            this.ShowFlow = function () {
                $("#flowId").fadeIn();
                flow = new LineCharts(viewer);
                $("#closeFlow").click(function () {
                    $("#flowId").fadeOut();
                    flow.destroy();
                    viewer.camera.flyHome();
                });
            };
            this.ShowHeat = function () {
                $("#heatId").fadeIn();
                let bounds = {
                    west: 110,
                    east: 130,
                    south: 10,
                    north: 30
                }
                let heatMap = CesiumHeatmap.create(
                    viewer,
                    bounds, {
                        maxopacity: 0.9
                    })
                let data = [];
                for (var i = 0; i < 1000; i++) {
                    data.push({
                        "x": bounds.west + Math.random() * (bounds.east - bounds.west),
                        "y": bounds.south + Math.random() * (bounds.north - bounds.south),
                        "value": Math.round(Math.random() * 100)
                    });
                }
                let valueMin = 0;
                let valueMax = 100;
                heatMap.setWGS84Data(valueMin, valueMax, data);
                $("#closeheat").click(function () {
                    $("#heatId").fadeOut();
                    viewer.entities.removeAll();
                    viewer.camera.flyHome();
                })

                let rectangle = Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north);
                viewer.camera.flyTo({
                    destination: rectangle
                });
            }
            this.ShowTemp = function () {
                new temputureMain(viewer);
            }
            this.measure = function () {
                $("#drawId").fadeIn();
                new measureTool(viewer);
            };
            this.draw = function(){
                // $('#drawId').fadeIn();
                new drawTool(viewer);
            }
            this.statFram = function(){
                // $('#statframleftID').show(100);
                // $('#statframrightID').show(100);
                // $('#closetempId1').show(100);
                TweenMax.to($('#statframleftID'),0.6,{x: "+=500",opacity:1});
                TweenMax.to($('#statframrightID'),0.6,{x: "-=500",opacity:1});
                new TempStat('tempS');
                new weatherFuture('weatherFutureId');
                new rainFallStat('rainFallId');
                new weatherPie('weatherId');
            }
            this.arrow = function(){
                $("#arrowId").fadeIn();
                var arrow = new arrowDraw(viewer);
                $("#straightArrow").click(function () {
                    arrow.draw("straightArrow");
                });
                $("#attackArrow").click(function () {
                    arrow.draw("attackArrow");
                });
                $("#pincerArrow").click(function () {
                    arrow.draw("pincerArrow");
                });
                $("#clear").click(function () {
                    arrow.clearOne();
                });
                $("#save").click(function () {
                    arrow.saveData();
                });
                $("#show").click(function () {
                    $.getJSON("./data/arrow.json", function (jsonData) {
                        arrow.showData(jsonData);
                    });
                });

            }
        }
        var opts = new op();
        $('#rain').click(opts.ShowRain);
        $('#snow').click(opts.ShowSnow);
        $('#heat').click(opts.ShowHeat);
        $('#wind').click(opts.ShowWind);
        $('#flyId').click(opts.ShowFly);
        $("#flow").click(opts.ShowFlow);
        $("#temp").click(opts.ShowTemp);
        $("#distancemeasure").click(opts.measure);
        $("#drawMenuId").click(opts.draw);
        $("#StatFrame").click(opts.statFram);
        $("#arrowMenu").click(opts.arrow);
        // $('#temp').click()

        let viewModel = {
            startLat: 0, //left
            endLat: 10, //right
            startLon: 0, //button
            endLon: 10, //up
            change: function () {
                $("#fileToUpload").trigger('click');

            }
        };
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('toolbar');
        Cesium.knockout.applyBindings(viewModel, toolbar);
        Cesium.knockout.getObservable(viewModel, 'startLat');
        Cesium.knockout.getObservable(viewModel, 'endLat');
        Cesium.knockout.getObservable(viewModel, 'startLon');
        Cesium.knockout.getObservable(viewModel, 'endLon');

        //insert imagerylayer
        var timage = undefined;
        $("#insert").click(function () {
            $("#insetImagery").fadeIn();
            $("#closeInsert").click(function () {
                $("#insetImagery").fadeOut();
                if (timage != undefined) {
                    viewer.scene.imageryLayers.remove(timage);
                }
            })
            $("#fileToUpload").change(function (e) {
                var f = e.currentTarget.files[0];
                var lat1 = viewModel.startLat;
                var lon1 = viewModel.startLon;
                var lat2 = viewModel.endLat;
                var lon2 = viewModel.endLon;
                var layers = viewer.scene.imageryLayers;
                timage = layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                    url: './data/' + f.name,
                    rectangle: Cesium.Rectangle.fromDegrees(lat1, lon1, lat2, lon2)
                }));

            });
        })
    }
    resetCameraFunction() {
        this.viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
            orientation: {
                heading: 4.731089976107251,
                pitch: -0.32003481981370063
            }
        });
    }
}
export {
    Menu
};