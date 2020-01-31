import {computeCentroidOfPolygon} from './GeometryMath.js';
class measureTool{
    constructor(viewer){
        const tool = new Cesium.DrawTool({
            viewer:viewer,
            isMeasure:true,  // 是否开启测量模式
            isClampGround:true,  // 是否开启贴地模式
            //lineWidth:1.0    // 设置线宽
        });
        var that = this;
        document.getElementById('point').onclick = function() {
            tool.startPoint()  // 画点
        };
        document.getElementById('line').onclick = function() {
            // tool.startPolyline()  // 画线
            that.measureLineSpace(viewer)
        };
        document.getElementById('polygon').onclick = function() {
            // tool.startPolygon();  // 画面
            that.measureAreaSpace(viewer)

        };
        document.getElementById('elevation').onclick = function() {
            tool.startElevation();  // 量高
        };
        document.getElementById('remove').onclick = function() {
            $("#drawId").fadeOut();
            viewer.entities.removeAll();
            tool.destory();
            viewer.camera.flyHome();
        };
    }
 
  //测量空间直线距离 
  /******************************************* */
    measureLineSpace(viewer) {
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var positions = [];
        var poly = null;
        var distance = 0;
        var cartesian = null;
        var floatingPoint;
        var entitylabel = viewer.entities.add({
            label : {
                show : false,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin : Cesium.VerticalOrigin.TOP,
                pixelOffset : new Cesium.Cartesian2(20, -40),
            }
        });

        handler.setInputAction(function (movement) {
          // cartesian = viewer.scene.pickPosition(movement.endPosition);
          
          let ray = viewer.camera.getPickRay(movement.endPosition);
          cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
          
          if (positions.length >= 2 && cartesian) {
            positions.pop();
            positions.push(cartesian);
            if (!Cesium.defined(poly)) {
              poly = new PolyLinePrimitive(positions);
            }
            entitylabel.position = cartesian;
            var d = getSpaceDistance([positions[positions.length-2],cartesian])/1000
            entitylabel.label.show = true;
            entitylabel.label.text = d.toFixed(2)+'km';
            distance = getSpaceDistance(positions)/1000;
            $("#cd_label").html($("#cd_label").html()+"&nbsp;&nbsp;线段长度:"+d+"km"+"&nbsp;&nbsp;总长度:"+distance+"km");
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
          // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
          // cartesian = viewer.scene.pickPosition(movement.position);
          let ray = viewer.camera.getPickRay(movement.position);
          cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          if (positions.length == 0) {
            positions.push(cartesian.clone());
          }
          positions.push(cartesian);
          //   var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          // distance = getSpaceDistance(positions);
          var textDisance = distance.toFixed(2) + "km";
          floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
            position: positions[positions.length - 1],
            point: {
              pixelSize: 10,
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              scaleByDistance: undefined,
            },
            label: {
              text: textDisance,
              font: '18px sans-serif',
              fillColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(20, -40),
              scaleByDistance: undefined,
            }
          });
          
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
          handler.destroy(); //关闭事件句柄
          positions.pop(); //最后一个点无效
          viewer.entities.remove(entitylabel);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        var PolyLinePrimitive = (function () {
          function _(positions) {
            this.options = {
              name: '直线',
              polyline: {
                show: true,
                positions: [],
                material: Cesium.Color.CHARTREUSE,
                width: 5,
                clampToGround: true
              }
            };
            this.positions = positions;
            this._init();
          }

          _.prototype._init = function () {
            var _self = this;
            var _update = function () {
              return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
          };

          return _;
        })();
        //空间两点距离计算函数
        function getSpaceDistance(positions) {
          var distance = 0;
          for (var i = 0; i < positions.length - 1; i++) {

            var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
          }
          return distance.toFixed(2);
        }
  }

  //****************************测量空间面积************************************************//
    measureAreaSpace(viewer){  
      // 取消双击事件-追踪该位置
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      // 鼠标事件
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var positions = [];
        var tempPoints = [];
        var polygon = null;
        var cartesian = null;
        var floatingPoint;
        var areaText = viewer.entities.add({
                name : 'float多边形面积',
                label : {
                    show: false,
                    font : '18px sans-serif',
                    fillColor : Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(20, -40),
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        
        handler.setInputAction(function(movement){
            // cartesian = viewer.scene.pickPosition(movement.endPosition); 
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if(tempPoints.length >= 2 &&cartesian){
                positions.pop();
                positions.push(cartesian);
                if (!Cesium.defined(polygon)) {
                    polygon = new PolygonPrimitive(positions);
                }
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
                var cenofp = computeCentroidOfPolygon(positions);
                areaText.position = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cenofp.longitude),Cesium.Math.toDegrees(cenofp.latitude));
                areaText.label.show = true;
                var area = getArea(tempPoints);
                areaText.label.text = area + "平方公里";
                tempPoints.pop();
                $("#cd_label").html($("#cd_label").html()+"&nbsp;&nbsp;面积:"+area+"平方公里");
            }

        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
        handler.setInputAction(function(movement){
            // cartesian = viewer.scene.pickPosition(movement.position); 
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            if(positions.length == 1) {
                positions.push(cartesian.clone());
            }
            //positions.pop();
            positions.push(cartesian);
            //在三维场景中添加点
            var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            var heightString = cartographic.height;
            tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
            floatingPoint = viewer.entities.add({
                name : '多边形面积',
                position : positions[positions.length - 1],         
                point : {
                    pixelSize : 10,
                    color : Cesium.Color.RED,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 2,
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                }
            });
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
         
        handler.setInputAction(function(movement){
            handler.destroy();
            positions.pop();
            var cenofp = computeCentroidOfPolygon(positions);
     
            var textArea = getArea(tempPoints) + "平方公里";
            viewer.entities.add({
                name : '多边形面积',
                position : Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cenofp.longitude),Cesium.Math.toDegrees(cenofp.latitude)),
                label : {
                    text : textArea,
                    font : '18px sans-serif',
                    fillColor : Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(20, -40),
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            viewer.entities.remove(areaText);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );   
     
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
        
        //计算多边形面积
        function getArea(points) {
            var res = 0;
            var r = 6371;
            //split triangle
            
            for (var i = 0; i < points.length - 2; i++) {
                var j = (i + 1) % points.length;
                var k = (i + 2) % points.length;
                //solve sophere triangle
                var dis_temp1 = distance(points[0], points[j])/1000;
                var dis_temp2 = distance(points[j], points[k])/1000;
                var dis_temp3 = distance(points[0], points[k])/1000;
                var angel1 = Math.acos((Math.cos(dis_temp1/r)-Math.cos(dis_temp2/r)*Math.cos(dis_temp3/r))/(Math.sin(dis_temp2/r)*Math.sin(dis_temp3/r)));
                var angel2 = Math.acos((Math.cos(dis_temp2/r)-Math.cos(dis_temp1/r)*Math.cos(dis_temp3/r))/(Math.sin(dis_temp1/r)*Math.sin(dis_temp3/r)));
                var angel3 = Math.acos((Math.cos(dis_temp3/r)-Math.cos(dis_temp2/r)*Math.cos(dis_temp1/r))/(Math.sin(dis_temp2/r)*Math.sin(dis_temp1/r)));
                res += (angel1+angel2+angel3-Math.PI)*r*r;
            }
            return res.toFixed(2);
        }
     
        var PolygonPrimitive = (function(){
            function _(positions){
                this.options = {
                    name:'多边形',
                    polygon : {
                        hierarchy : [],
                        // perPositionHeight : true,
                        material : Cesium.Color.AQUA.withAlpha(0.5),
                        // material: "rgba(100,0,100,0.5)",
                    }
                };
                
                this.hierarchy = {positions};
                this._init();
            }
        
            _.prototype._init = function(){
                var _self = this;
                var _update = function(){
                    return _self.hierarchy;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update,false);
                viewer.entities.add(this.options);
            };
        
            return _;
        })();
     
        function distance(point1,point2){
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(new Cesium.Cartographic(point1.lon,point1.lat), new Cesium.Cartographic(point2.lon,point2.lat));
            var s = geodesic.surfaceDistance;
            return s;
        }
    }
}
export {measureTool};