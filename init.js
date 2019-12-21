define(function(){
    return {initCesium:function(mode){

            var options = {
                baseLayerPicker: false,
                geocoder: false,
                infoBox: true,
                shouldAnimate:true,
                fullscreenElement: 'cesiumContainer',
                scene3DOnly: true,
                imageryProvider:new Cesium.WebMapServiceImageryProvider({
                        url : 'data/arcgis_word',
                        layers: 'tile:arcgis'// Here just give layer name   
                })
            };
            var viewer = new Cesium.Viewer('cesiumContainer', options);
            viewer.imageryLayers.addImageryProvider(
                            //Cesium.createTileMapServiceImageryProvider({
                            Cesium.createTileMapServiceImageryProvider({
                                url : 'data/arcgis_word', 
                                layers: 'tile:arcgis', 
                                //url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                            })
                        );
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            var scene = viewer.scene;
            //添加鼠标经纬度显示标签
            var entity = viewer.entities.add({
                label : {
                    show : false,
                    showBackground : true,
                    font : '14px monospace',
                    horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin : Cesium.VerticalOrigin.TOP,
                    pixelOffset : new Cesium.Cartesian2(15, 0)
                }
            });

            // Mouse over the globe to see the cartographic position
            handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function(movement) {
                var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                if (cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

                    entity.position = cartesian;
                    entity.label.show = true;
                    entity.label.text =
                        'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
                } else {
                    entity.label.show = false;
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            return viewer;
        },
        homeCamera:function(){
            var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
            var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
            var homeCameraView = {
                destination : initialPosition,
                orientation : {
                    heading : initialOrientation.heading,
                    pitch : initialOrientation.pitch,
                    roll : initialOrientation.roll
                }
            };
            return homeCameraView;
        }
    }
})