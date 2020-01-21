define(function(viewer){
	return {
		init: function(viewer){
			var scene = viewer.scene;
			// rain
			var rainParticleSize = 15.0;
			var rainRadius = 100000.0;
			var rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize * 2.0);

			var rainSystem;

			var rainGravityScratch = new Cesium.Cartesian3();
			var rainUpdate = function(particle, dt) {
			    rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
			    rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(rainGravityScratch, -1050.0, rainGravityScratch);

			    particle.position = Cesium.Cartesian3.add(particle.position, rainGravityScratch, particle.position);

			    var distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
			    if (distance > rainRadius) {
			        particle.endColor.alpha = 0.0;
			    } else {
			        particle.endColor.alpha = rainSystem.endColor.alpha / (distance / rainRadius + 0.1);
			    }
			};

			rainSystem = new Cesium.ParticleSystem({
			    modelMatrix : new Cesium.Matrix4.fromTranslation(scene.camera.position),
			    speed : -1.0,
			    lifetime : 15.0,
			    emitter : new Cesium.SphereEmitter(rainRadius),
			    startScale : 1.0,
			    endScale : 0.0,
			    image : './data/circular_particle.png',
			    emissionRate : 9000.0,
			    startColor :new Cesium.Color(0.27, 0.5, 0.70, 0.0),
			    endColor : new Cesium.Color(0.27, 0.5, 0.70, 0.98),
			    imageSize : rainImageSize,
			    updateCallback : rainUpdate
			});
			this.prain = scene.primitives.add(rainSystem);
			return this.prain;
		},
		destroy: function(viewer,prain){
			viewer.scene.primitives.remove(prain);
		}
	}
})