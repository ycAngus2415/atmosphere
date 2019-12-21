class Menu{
    constructor(viewer, mode){
        var box = new dat.GUI({ autoPlace: false });
        this.viewer = viewer;
        var that = this;
        var wind_gui;
        var fly_gui;
        var snow_gui;
        var rain_gui;
        var cloud_gui;
        var flow_gui;
        var flow;
        var op = function(){
            this.ShowFly = function(){
                requirejs(['fly'],function(){
                    var flyModel = new Fly(viewer);
                    flyModel.initFly();
                    if(wind_gui != undefined){
                        box.removeFolder(wind_gui);
                        viewer.scene.primitives.removeAll();
                    }
                    if(snow_gui !=undefined){
                        box.removeFolder(snow_gui);
                        viewer.scene.primitives.removeAll();
                    }
                    if(rain_gui !=undefined){
                        box.removeFolder(rain_gui);
                        viewer.scene.primitives.removeAll();
                    }
                    var option1 = function(){
                        this.StartFly = function(){flyModel.startFly();}
                        this.PouseFly = function(){
                            flyModel.pauseFly();
                        }
                        this.Tracked = function(){
                            flyModel.aircraftView();
                        }
                        this.FlyBack = function(){flyModel.flyBack();};
                        this.FlyForward = function(){flyModel.flyForward();}
                        this.CustomFly = function(){flyModel.customFly();}
                    };
                    fly_gui = box.addFolder("AirFly");
                    var options1 = new option1();
                    fly_gui.add(options1, "StartFly");
                    fly_gui.add(options1, "PouseFly");
                    fly_gui.add(options1, "Tracked");
                    fly_gui.add(options1, "FlyBack");
                    fly_gui.add(options1, "FlyForward");
                    fly_gui.add(options1, "CustomFly");
                 });

            }
            this.ShowWind = function(){
                if(fly_gui != undefined){
                    box.removeFolder(fly_gui);
                    viewer.entities.removeAll();
                }
                if(snow_gui !=undefined){
                    box.removeFolder(snow_gui);
                    viewer.scene.primitives.removeAll();
                }
                if(rain_gui !=undefined){
                    box.removeFolder(rain_gui);
                    viewer.scene.primitives.removeAll();
                }
                wind_gui = box.addFolder("Windy");
                var panel = new Panel(viewer,wind_gui);
                var wind3D = new Wind3D(
                    panel,
                    mode,
                    viewer);
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(120, 32.71, 30000000.0)});
                wind_gui.open();

            }
            this.ShowSnow = function(){
                if(fly_gui !=undefined){
                    box.removeFoler(fly_gui);
                    viewer.entities.removeAll();
                }
                if(wind_gui != undefined){
                    box.removeFolder(wind_gui);
                    viewer.scene.primitives.removeAll();
                }
                if(rain_gui != undefined){
                    box.removeFolder(rain_gui);
                    viewer.scene.primitives.removeAll();
                }
                snow_gui = box.addFolder("Snow");
                requirejs(['snow'], function(snow){
                    snow.init(viewer);
                });
                viewer.scene.globe.depthTestAgainstTerrain = true;
                that.resetCameraFunction();
            }
            this.ShowRain = function(){
                if(fly_gui !=undefined){
                    box.removeFoler(fly_gui);
                    viewer.entities.removeAll();
                }
                if(wind_gui != undefined){
                        box.removeFolder(wind_gui);
                        viewer.scene.primitives.removeAll();
                }
                if(snow_gui !=undefined){
                    box.removeFolder(snow_gui);
                    viewer.scene.primitives.removeAll();
                }
                rain_gui = box.addFolder("Rain");
                requirejs(['rain'], function(rain){
                    rain.init(viewer);
                });
                viewer.scene.globe.depthTestAgainstTerrain = true;
                that.resetCameraFunction();
            }
            this.ShowCloud = function(){
                if(fly_gui !=undefined){
                    box.removeFoler(fly_gui);
                    viewer.entities.removeAll();
                }
                if(wind_gui != undefined){
                        box.removeFolder(wind_gui);
                        viewer.scene.primitives.removeAll();
                }
                if(snow_gui !=undefined){
                    box.removeFolder(snow_gui);
                    viewer.scene.primitives.removeAll();
                }
                if(rain_gui != undefined){
                    box.removeFolder(rain_gui);
                    viewer.scene.primitives.removeAll();
                }
                cloud_gui = box.addFolder("Cloud");
                requirejs(['cloud'], function(cloud){
                    cloud.init(viewer);
                });
            }
            this.ShowFlow = function(){
                flow_gui = box.addFolder("Flow");
                flow = new LineCharts(viewer);
                var option2 = function(){
                    this.destroy = function(){flow.destroy();}
                }
                var option22 = new option2()
                flow_gui.add(option22, 'destroy');
                flow_gui.open();
            }
        }
        var button = box.addFolder("Rendering");
        var opts = new op();
        button.add(opts, 'ShowFly');
        button.add(opts, 'ShowWind');
        button.add(opts, 'ShowSnow');
        button.add(opts, 'ShowRain');
        button.add(opts, 'ShowCloud');
        button.add(opts, 'ShowFlow');
        button.open();
        var panelContainer = document.getElementsByClassName('cesium-viewer').item(0);
        box.domElement.classList.add('myPanel');
        panelContainer.appendChild(box.domElement);
        var viewModel = {
            Hue: 0,
            enableContour: false,
            contourSpacing: 150.0,
            contourWidth: 2.0,
            selectedShading: 'elevation',
            changeColor: function() {
                console.log("点击我了");
            }
        };
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('toolbar');
        Cesium.knockout.applyBindings(viewModel, toolbar);
        
        Cesium.knockout.getObservable(viewModel, 'Hue').subscribe(function(newvalue){
            var layer = viewer.imageryLayers.get(1);
            layer['hue'] = newvalue;
        });
    }

    resetCameraFunction(){
        this.viewer.scene.camera.setView({
            destination : new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
            orientation : {
                heading : 4.731089976107251,
                pitch : -0.32003481981370063
            }
        });
    }
}