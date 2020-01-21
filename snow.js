define(function(viewer){
	return {
		init: function(viewer){
			var scene = viewer.scene;	
	// snow
			var snowParticleSize = 12.0;
			var snowRadius = 100000.0;
			var minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize, snowParticleSize);
			var maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 2.0, snowParticleSize * 2.0);
			var snowSystem;

			var snowGravityScratch = new Cesium.Cartesian3();
			var snowUpdate = function(particle, dt) {
			    snowGravityScratch = Cesium.Cartesian3.normalize(particle.position, snowGravityScratch);
			    Cesium.Cartesian3.multiplyByScalar(snowGravityScratch, Cesium.Math.randomBetween(-30.0, -300.0), snowGravityScratch);
			    particle.velocity = Cesium.Cartesian3.add(particle.velocity, snowGravityScratch, particle.velocity);

			    var distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
			    if (distance > snowRadius) {
			        particle.endColor.alpha = 0.0;
			    } else {
			        particle.endColor.alpha = snowSystem.endColor.alpha / (distance / snowRadius + 0.1);
			    }
			};

			snowSystem = new Cesium.ParticleSystem({
			    modelMatrix : new Cesium.Matrix4.fromTranslation(scene.camera.position),
			    minimumSpeed : -1.0,
			    maximumSpeed : 0.0,
			    lifetime : 15.0,
			    emitter : new Cesium.SphereEmitter(snowRadius),
			    startScale : 0.5,
			    endScale : 1.0,
			    image : './data/snowflake_particle.png',
			    emissionRate : 7000.0,
			    startColor : Cesium.Color.WHITE.withAlpha(0.0),
			    endColor : Cesium.Color.WHITE.withAlpha(1.0),
			    minimumImageSize : minimumSnowImageSize,
			    maximumImageSize : maximumSnowImageSize,
			    updateCallback : snowUpdate
			});
			var psnow = scene.primitives.add(snowSystem);
			return psnow
		},
		destroy: function(viewer,psnow){
			viewer.scene.primitives.remove(psnow);
		}
	}

})