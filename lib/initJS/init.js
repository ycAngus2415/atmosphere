
class init{
    constructor(){

        var options = {
            baseLayerPicker: false,
            geocoder: false,
            infoBox: true,
            shouldAnimate:true,
            fullscreenElement: 'cesiumContainer',
            scene3DOnly: true,
            imageryProvider:new Cesium.WebMapServiceImageryProvider({
                    url : '/data/arcgis_word',
                    layers: 'tile:arcgis'// Here just give layer name   
            })
        };
        this.viewer = new Cesium.Viewer('cesiumContainer', options);
        this.viewer.imageryLayers.addImageryProvider(
                        //Cesium.createTileMapServiceImageryProvider({
                        Cesium.createTileMapServiceImageryProvider({
                            url : '/data/arcgis_word', 
                            layers: 'tile:arcgis', 
                            //url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                        })
                    );
        this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        var scene = this.viewer.scene;
        //添加鼠标经纬度显示标签
        var entity = this.viewer.entities.add({
            label : {
                show : false,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.TOP,
                pixelOffset : new Cesium.Cartesian2(15, 0)
            }
        });
        this.show3DCoordinates(this.viewer);

        // Mouse over the globe to see the cartographic position
        // handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        // handler.setInputAction(function(movement) {
        //     var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        //     if (cartesian) {
        //         var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        //         var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        //         var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

        //         entity.position = cartesian;
        //         entity.label.show = true;
        //         entity.label.text =
        //             'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
        //             '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
        //     } else {
        //         entity.label.show = false;
        //     }
        // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
    }
    homeCamera(){
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

    /*
    * 显示地图当前坐标
    */
    show3DCoordinates(viewer){
        //地图底部工具栏显示地图坐标信息
        var elementbottom = document.createElement("div");
        $(".cesium-viewer").append(elementbottom);
        elementbottom.style.width = "90%";
        elementbottom.style.height = "30px";
        elementbottom.style.background = "rgba(0,0,0,0.5)";
        elementbottom.style.position = "absolute";
        elementbottom.style.bottom = "0px";
        elementbottom.style.cursor = "default";

        var coordinatesDiv = document.getElementById("map_coordinates");
        if (coordinatesDiv) {
            coordinatesDiv.style.display = "block";
        }
        else {
            coordinatesDiv = document.createElement("div");
            coordinatesDiv.id = "map_coordinates";
            coordinatesDiv.style.zIndex = "50";
            coordinatesDiv.style.bottom = "1px";
            coordinatesDiv.style.height = "29px";
            coordinatesDiv.style.position = "absolute";
            coordinatesDiv.style.overflow = "hidden";
            coordinatesDiv.style.textAlign= "center";
            coordinatesDiv.style.left = "10px";
            coordinatesDiv.style.lineHeight = "29px";
            coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
            $(".cesium-viewer").append(coordinatesDiv);
            var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler3D.setInputAction(function(movement) {
                var pick= new Cesium.Cartesian2(movement.endPosition.x,movement.endPosition.y);
                if(pick){
                    var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                    if(cartesian){
                        //世界坐标转地理坐标（弧度）
                        var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                        if(cartographic){
                            //海拔
                            var height = viewer.scene.globe.getHeight(cartographic);
                            //视角海拔高度
                            var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
                            var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
                            //地理坐标（弧度）转经纬度坐标
                            var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                            if(!height){
                                height = 0;
                            }
                            if(!he){
                                he = 0;
                            }
                            if(!he2){
                                he2 = 0;
                            }
                            if(!point){
                                point = [0,0];
                            }
                            coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>视角高度:"+(he - he2).toFixed(2)+"米&nbsp;&nbsp;&nbsp;&nbsp;海拔高度:"+height.toFixed(2)+"米&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6)+ "</span>";
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } 
    }
}
export{init};