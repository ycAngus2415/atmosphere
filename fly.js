class Fly{
    constructor(viewer){
	    this.mViewer = viewer;
        this.mFlySpeed = 10;
        this.mFlyPath = [];
        /**
         * 初始化飞行数据
         **/
    }
    initFly()
    {
        this.pauseFly();

        // 数据
        if(!this.mFlyPath || this.mFlyPath.length == 0)
        {
            this.mFlyPath[0] = [
            {longitude:116.538799, dimension:39.9948, height:0, time:0},
            {longitude:116.130034, dimension:38.291387, height:50000, time:120},
            {longitude:116.415192, dimension:34.841955, height:500000, time:240},
            {longitude:117.261468, dimension:31.831171, height:5000, time:360}, 
            {longitude:115.881671, dimension:28.70164, height:5000, time:480},
            {longitude:116.120835, dimension:24.308311, height:5000, time:600},
            {longitude:113.269254, dimension:23.13956, height:0, time:720}];

            //设置初始位置
            this.mViewer.camera.flyTo({
                destination :  Cesium.Cartesian3.fromDegrees(this.mFlyPath[0][0].longitude , this.mFlyPath[0][0].dimension , 10000000),
                orientation: {
                    heading : Cesium.Math.toRadians(20.0), // 方向
                    pitch : Cesium.Math.toRadians(-90.0),// 倾斜角度
                    roll : 0
                },
                pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
                maximumHeight:5000, // 相机最大飞行高度
                flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
            });
        }


        // 起始时间
        let start = new Cesium.JulianDate();
        // 结束时间
        let stop = Cesium.JulianDate.addSeconds(start, (this.mFlyPath[0].length-1)*120,new Cesium.JulianDate());
        // 设置始时钟始时间
        this.mViewer.clock.startTime = start.clone();
        // 设置时钟当前时间
        this.mViewer.clock.currentTime = start.clone();
        // 设置始终停止时间
        this.mViewer.clock.stopTime  = stop.clone();
        // 时间速率，数字越大时间过的越快
        this.mViewer.clock.multiplier = this.mFlySpeed;
        // 循环执行
        this.mViewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        let data = this.mFlyPath;
        for(let j=0; j<data.length; j++)
        {
            let property = new Cesium.SampledPositionProperty();
            for(let i=0; i<data[j].length; i++){
                let time = Cesium.JulianDate.addSeconds(start, data[j][i].time, new Cesium.JulianDate());
                let position = Cesium.Cartesian3.fromDegrees(data[j][i].longitude, data[j][i].dimension, data[j][i].height);
                // 添加位置，和时间对应
                property.addSample(time, position);
            }
            // 添加模型
            var model_entity = {
                //id: "fly",
                // 和时间轴关联
                availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    start : start,
                    stop : stop
                })]),
                position: property,
                //基于位置移动自动计算方向.
                orientation: new Cesium.VelocityOrientationProperty(property),
                // 模型数据,跨域，模型文件必须放本地
                model: {
                    uri: "./data/Cesium_Air.gltf",
                    scale: 100,
                    minimumPixelSize: 100
                },
                //路径
                path : {
                    resolution : 1,
                    //设置航线样式，线条颜色，内发光粗细，航线宽度等
                    material : new Cesium.PolylineGlowMaterialProperty({
                        glowPower : 0.1,
                        color : Cesium.Color.RED
                    }),
                    width : 30
                },
                name: "水下滑翔机",
                description: "<table class='cesium-infoBox-defaultTable'><tbody> " + "<tr><td>" + "厂商" + "</td><td>" + "天津大学"
                 + "</td></tr>" + " </tbody></table>",
                
            };

            this.entity = this.mViewer.entities.add(model_entity);
        }
    }

        /**
         * 开始飞行
         **/
    startFly()
    {
        this.mViewer.clock.shouldAnimate = true;
    }

        /**
         * 暂停飞行
         **/
    pauseFly()
    {
        this.mViewer.clock.shouldAnimate = false;
    }

        /**
         * 顶部视图
         **/
    topView()
    {
        this.mViewer.trackedEntity = undefined;
        this.mViewer.zoomTo(this.mViewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
    }

        /**
         * 侧面视图
         **/
    sideView()
    {
        this.mViewer.trackedEntity = undefined;
        this.mViewer.zoomTo(this.mViewer.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500));
    }

        /**
         * 跟随视图
         **/
    aircraftView()
    {
        //this.mViewer.trackedEntity = this.mViewer.entities.getById("fly");
        this.mViewer.trackedEntity = this.entity;
    }

        /**
         * 向后飞行
         **/
    flyBack()
    {
        this.mFlySpeed = -10;
        this.mViewer.clock.multiplier = this.mFlySpeed;
    }

        /**
         * 向前飞行
         **/
    flyForward()
    {
        this.mFlySpeed = 10;
        this.mViewer.clock.multiplier = this.mFlySpeed;
    }

        /**
         * 自定义路线飞行
         **/ 
    customFly()
    {
        var that = this;
        var mviewer = this.mViewer;
        window.PolyLinePrimitive = (function(){
            function _(positions)
            {
                this.options = {
                    polyline : {
                        show : true,
                        positions : [],
                        material : Cesium.Color.CORNFLOWERBLUE,
                        width : 5
                    }
                };
                this.positions = positions;
                this._init();
            }
            _.prototype._init = function(){
                var _self = this;
                var _update = function(){
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update,false);
                mviewer.entities.add(this.options);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(mviewer.canvas);
        var positions = [];
        var poly = undefined;
        var lnglatPositions=[];
        handler.setInputAction(function(movement)
        {
            //屏幕坐标转成经纬度坐标
            var cartesian = mviewer.scene.camera.pickEllipsoid(movement.position,mviewer.scene.globe.ellipsoid);
            if(positions.length == 0)
            {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            var ray = mviewer.camera.getPickRay(movement.position);;
            cartesian= mviewer.scene.globe.pick(ray, mviewer.scene);
            if (!cartesian)
                return;
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
            let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
            lnglatPositions.push({longitude:lng, dimension:lat, height:5000, time:lnglatPositions.length*120});
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //鼠标移动事件
        handler.setInputAction(function(movement){
            var cartesian = mviewer.camera.pickEllipsoid(movement.endPosition,mviewer.scene.globe.ellipsoid);
            if(positions.length >= 2)
            {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                }else{
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                }
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
        //双击完成绘制飞行路线操作
        var stopfly = this.stopFly;
        handler.setInputAction(function(movement)
        {
            handler.destroy();
            if(positions.length>0)
            {
                positions[0].height = 0;
                positions[positions.length-1].height =0;
                //先停止之前的飞行，初始化飞行数据，开始飞行
                stopfly(false,mviewer);
                if(lnglatPositions.length>2)
                {
                    lnglatPositions.splice(lnglatPositions.length-1,1);
                    that.mFlyPath[0] = lnglatPositions;
                    that.initFly();
                    that.startFly();
                }
                
            }
        },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

        /**
         * 停止飞行
         **/
    stopFly(clearData, viewer)
    {
        viewer.trackedEntity = undefined;
        var start = Cesium.JulianDate.fromDate(new Date());
        viewer.clock.startTime = start.clone();
        var stop = Cesium.JulianDate.addSeconds(start, 300000000, new Cesium.JulianDate());
        viewer.clock.stopTime = stop.clone();
        viewer.entities.removeAll();
        if(clearData)
            this.mFlyPath = [];
    }
    
}