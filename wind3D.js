
class Wind3D {
    constructor(panel, mode, viewer) {

        this.viewer = viewer

        
        this.scene = this.viewer.scene;
        this.camera = this.viewer.camera;
        //new CompositeView(this.viewer);
        //this.rainModel();
        //var line = initWork(this.viewer);
        // require(["lib/CompositeView","lib/index"],function(CompositeView,optionValue){
        //     new CompositeView(this.viewer, optionValue);
        // })
        this.panel = panel;

        this.viewerParameters = {
            lonRange: new Cesium.Cartesian2(),
            latRange: new Cesium.Cartesian2(),
            pixelSize: 0.0
        };
        // use a smaller earth radius to make sure distance to camera > 0
        this.globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0);
        this.updateViewerParameters();

        DataProcess.loadData().then(
            (data) => {
                this.particleSystem = new ParticleSystem(this.scene.context, data,
                    this.panel.getUserInput(), this.viewerParameters);
                this.addPrimitives();
                this.setupEventListeners();
                if (mode.debug) {
                    this.debug();
                }
            });
        this.imageryLayers = this.viewer.imageryLayers;
        this.setGlobeLayer(this.panel.getUserInput());
    }

    addPrimitives() {
        // the order of primitives.add() should respect the dependency of primitives
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.getWind);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.updateSpeed);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.updatePosition);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingSpeed);

        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.segments);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.trails);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.screen);
    }

    updateViewerParameters() {
        var viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
        var lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
        this.viewerParameters.lonRange.x = lonLatRange.lon.min;
        this.viewerParameters.lonRange.y = lonLatRange.lon.max;
        this.viewerParameters.latRange.x = lonLatRange.lat.min;
        this.viewerParameters.latRange.y = lonLatRange.lat.max;

        var pixelSize = this.camera.getPixelSize(
            this.globeBoundingSphere,
            this.scene.drawingBufferWidth,
            this.scene.drawingBufferHeight
        );

        if (pixelSize > 0) {
            this.viewerParameters.pixelSize = pixelSize;
        }
    }

    setGlobeLayer(userInput) {
        //this.viewer.imageryLayers.removeAll();
        this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();

        var globeLayer = userInput.globeLayer;
        switch (globeLayer.type) {
            case "NaturalEarthII": {
                this.viewer.imageryLayers.removeAll();
                this.viewer.imageryLayers.addImageryProvider(
                    //Cesium.createTileMapServiceImageryProvider({
                    Cesium.createTileMapServiceImageryProvider({
                        url : 'data/arcgis_word', 
                        layers: 'tile:arcgis', 
                        //url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                    })
                );
                break;
            }
            case "WMS": {
                console.log(userInput.WMS_URL);
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                    url: userInput.WMS_URL,
                    layers: globeLayer.layer,
                    parameters: {
                        ColorScaleRange: globeLayer.ColorScaleRange
                    }
                }));
                break;
            }
            case "WorldTerrain": {
                this.viewer.imageryLayers.addImageryProvider(
                    Cesium.createWorldImagery()
                );
                this.viewer.terrainProvider = Cesium.createWorldTerrain();
                break;
            }
            case "heatmap":{
                let bounds = {
                    west: 110,
                    east: 130,
                    south: 10,
                    north: 30
                }
                let heatMap = CesiumHeatmap.create(
                    this.viewer,
                    bounds,
                    {
                        maxopacity: 0.3
                    })
                let data = [];
                for(var i = 0;i<1000;i++){
                    data.push({"x": bounds.west+Math.random()*(bounds.east-bounds.west),"y": bounds.south+Math.random()*(bounds.north-bounds.south),"value": Math.round(Math.random()*100)});
                }
                let valueMin = 0;
                let valueMax = 100;
                heatMap.setWGS84Data(valueMin, valueMax, data);
                
                // this.viewer.camera.setView({
                //     destination: Cesium.Cartesian3.fromDegrees(130,30, 50000),
                //     orientation: {
                //         heading: Cesium.Math.toRadians(-90.0), // east, default value is 0.0 (north)
                //         pitch: Cesium.Math.toRadians(-20),    // default value (looking down)
                //         roll: 0.0                             // default value
                //     }
                // });
                let rectangle = Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north);
                this.viewer.camera.flyTo({
                    destination: rectangle
                });

            }
        }
    }

    setupEventListeners() {
        const that = this;

        this.camera.moveStart.addEventListener(function () {
            that.scene.primitives.show = false;
        });

        this.camera.moveEnd.addEventListener(function () {
            that.updateViewerParameters();
            that.particleSystem.applyViewerParameters(that.viewerParameters);
            that.scene.primitives.show = true;
        });

        var resized = false;
        window.addEventListener("resize", function () {
            resized = true;
            that.scene.primitives.show = false;
            that.scene.primitives.removeAll();
        });

        this.scene.preRender.addEventListener(function () {
            if (resized) {
                that.particleSystem.canvasResize(that.scene.context);
                resized = false;
                that.addPrimitives();
                that.scene.primitives.show = true;
            }
        });

        window.addEventListener('particleSystemOptionsChanged', function () {
            that.particleSystem.applyUserInput(that.panel.getUserInput());
        });
        window.addEventListener('layerOptionsChanged', function () {
            that.setGlobeLayer(that.panel.getUserInput());
        });
    }

    debug() {
        const that = this;

        var animate = function () {
            that.viewer.resize();
            that.viewer.render();
            requestAnimationFrame(animate);
        }

        //var spector = new SPECTOR.Spector();
        //spector.displayUI();
        //spector.spyCanvases();

        animate();
    }

    rainModel(){
        this.scene.debugShowFramesPerSecond = true;
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116, 30.5, 50000),
            orientation: {
                heading: Cesium.Math.toRadians(-90.0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(-20),    // default value (looking down)
                roll: 0.0                             // default value
            }
        });
        // 随机的entity
        var entities = [];
        for (var lon = 114.0; lon < 115; lon += 0.1) {
            for (var lat = 30.0; lat < 31; lat += 0.1) {
                entities.push(this.viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees((lon + lon + 0.1) / 2, (lat + lat + 0.1) / 2, Math.random()*10000),
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 0.1,
                        show: true
                    }
                }));
            }
        }
        console.log(entities[1].position);
        
        for (var i = 0; i < entities.length; i++) {
            var particleSystem = this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
                image: 'data/rainy.png',
                startColor: Cesium.Color.GHOSTWHITE,
                endColor: Cesium.Color.GHOSTWHITE,
                startScale: 1,
                endScale: 1,
                life: 20,
                speed: Math.floor(Math.random()* 10000 + 1),//随机速度
                width: 10,  // 设置以像素为单位的粒子的最小和最大宽度
                height: 1000, //设置粒子的最小和最大高度（以像素为单位）。
                rate: 10, //每秒发射的粒子数量
                lifeTime: 1, //多长时间的粒子系统将以秒为单位发射粒子
                loop: true, //是否粒子系统应该在完成时循环它的爆发
                emitter: new Cesium.CircleEmitter(0.5), //此系统的粒子发射器  共有 BoxEmitter,CircleEmitter,ConeEmitter,SphereEmitter 几类
                emitterModelMatrix: computeEmitterModelMatrix(), // 4x4转换矩阵，用于在粒子系统本地坐标系中转换粒子系统发射器
                modelMatrix: computeModelMatrix(entities[i], Cesium.JulianDate.now()), // 4x4转换矩阵，可将粒子系统从模型转换为世界坐标
                forces: [applyGravity] // 强制回调函数--例子：这是添加重力效果
            }));
            
            // this.viewer.scene.preRender.addEventListener(function (scene, time) {
            //     particleSystem.modelMatrix = computeModelMatrix(entities[i], time);
            //     particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
            // });
        }

        // 模型位置
        function computeModelMatrix(entity, time) {
            
            var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
            if (!Cesium.defined(position)) {
                return undefined;
            }

            var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
            var modelMatrix = null;
            if (!Cesium.defined(orientation)) {
                modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
            } else {
                modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, modelMatrix);
            }
            return modelMatrix;
        }
        function computeEmitterModelMatrix() {
            var hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0, new Cesium.HeadingPitchRoll());
            var trs = new Cesium.TranslationRotationScale();
            trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, new Cesium.Cartesian3());
            trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
            return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
        }
        function applyGravity(particle, dt) {
            var position = particle.position;
            var gravityVector = Cesium.Cartesian3.normalize(position, new Cesium.Cartesian3());
            Cesium.Cartesian3.multiplyByScalar(gravityVector, -20 * dt, gravityVector);
            particle.velocity = Cesium.Cartesian3.add(particle.velocity, gravityVector, particle.velocity);
        }


    }
}
