import {
	DrawHelper
} from './DrawHelper.js';
class drawTool{
	constructor(viewer){
		// $('#rectId').click(function(){

		// })
		this.initDrawHelper(viewer);
	}
	drawRect(){
		let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
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
	}
	initDrawHelper(viewer) {
		var center = [110.98, 30.83];
		var scene = viewer.scene;
		var canvas = viewer.canvas;
		var clock = viewer.clock;
		var camera = viewer.camera;
        var drawHelper = new DrawHelper(viewer);
        var toolbar = drawHelper.addToolbar(document.getElementById("draw1id"), {
            buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
        });
        toolbar.addListener('markerCreated', function (event) {
            loggingMessage('Marker created at ' + event.position.toString());
            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show: true,
                position: event.position,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: './data/img/glyphicons_242_google_maps.png',
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });
        toolbar.addListener('polylineCreated', function (event) {
            loggingMessage('Polyline created with ' + event.positions.length + ' points');
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();
            polyline.addListener('onEdited', function (event) {
                loggingMessage('Polyline edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('polygonCreated', function (event) {
            loggingMessage('Polygon created with ' + event.positions.length + ' points');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material: Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
                loggingMessage('Polygon edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('circleCreated', function (event) {
            loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function (event) {
                loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            });
        });
        toolbar.addListener('extentCreated', function (event) {
            var extent = event.extent;
            loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function (event) {
                loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
            });
        });

        var logging = document.getElementById('logging');
        function loggingMessage(message) {
            logging.innerHTML = message;
        }
    }
}
export {drawTool};