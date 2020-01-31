define(function(viewer){
    return {
        init:function(viewer){
            var viewModel = {
                emissionRate : 5.0,
                gravity : 0.0,
                minimumParticleLife : 12,
                maximumParticleLife : 24,
                minimumSpeed : 0.0,
                maximumSpeed : 1.0,
                startScale : 1.0,
                endScale : 5.0,
                particleSize : 25.0
            };
            this.entity = viewer.entities.add({
                rectangle:{
                    coordinates: Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
                    material: new Cesium.StripeMaterialProperty({
                        evenColor: Cesium.Color.WHITE.withAlpha(0.0),
                        oddColor: Cesium.Color.BLUE.withAlpha(0.0),
            //repeat: 5 // 重复5条
                    })
                },
            
                position : Cesium.Cartesian3.fromDegrees(-75.15787310614596, 39.97862668312678, 1000000)
            });

            var emitterModelMatrix = new Cesium.Matrix4();
            var translation = new Cesium.Cartesian3();
            var rotation = new Cesium.Quaternion();
            var hpr = new Cesium.HeadingPitchRoll();
            var trs = new Cesium.TranslationRotationScale();
            var emitterModelMatrix = new Cesium.Matrix4();
            
            var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
                image : './data/smoke.png',

                startColor : Cesium.Color.WHITE.withAlpha(0.7),
                endColor : Cesium.Color.WHITE.withAlpha(0.0),

                startScale : viewModel.startScale,
                endScale : viewModel.endScale,

                minimumParticleLife : viewModel.minimumParticleLife,
                maximumParticleLife : viewModel.maximumParticleLife,

                minimumSpeed : viewModel.minimumSpeed,
                maximumSpeed : viewModel.maximumSpeed,

                imageSize : new Cesium.Cartesian2(viewModel.particleSize, viewModel.particleSize),

                emissionRate : viewModel.emissionRate,

                // bursts : [
                //     // these burst will occasionally sync to create a multicolored effect
                //     new Cesium.ParticleBurst({time : 5.0, minimum : 10, maximum : 100}),
                //     new Cesium.ParticleBurst({time : 10.0, minimum : 50, maximum : 100}),
                //     new Cesium.ParticleBurst({time : 15.0, minimum : 200, maximum : 300})
                // ],

                lifetime : 16.0,

                emitter : new Cesium.SphereEmitter(20000),
                //modelMatrix: this.entity.computeModelMatrix(viewer.clock.startTime, new Cesium.Matrix4()),
                modelMatrix: new Cesium.Matrix4.fromTranslation(viewer.scene.camera.position),

                emitterModelMatrix : computeEmitterModelMatrix(),

                updateCallback : applyGravity
            }));

            var gravityScratch = new Cesium.Cartesian3();

            function applyGravity(p, dt) {
                // We need to compute a local up vector for each particle in geocentric space.
                var position = p.position;

                Cesium.Cartesian3.normalize(position, gravityScratch);
                Cesium.Cartesian3.multiplyByScalar(gravityScratch, viewModel.gravity * dt, gravityScratch);
                p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
            }
            function computeEmitterModelMatrix() {
                hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
                trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4, translation);
                trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
                return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
            }

        }
    }
});