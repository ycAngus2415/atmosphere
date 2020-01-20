define(function(viewer){
    return {
        interval: function(viewer){
            var controls = [
                    new Cesium.Cartesian3(1235398.0, -4810983.0, 4146266.0),
                    new Cesium.Cartesian3(1372574.0, -5345182.0, 4606657.0),
                    new Cesium.Cartesian3(-757983.0, -5542796.0, 4514323.0),
                    new Cesium.Cartesian3(-2821260.0, -5248423.0, 4021290.0),
                    new Cesium.Cartesian3(-2539788.0, -4724797.0, 3620093.0)
                ];
            for (var i = 0; i < controls.length; i++) {
                viewer.entities.add({
                    position: controls[i],
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                });
            }
            viewer.zoomTo(viewer.entities);
            var spline = new Cesium.HermiteSpline({
                times: [0, 1, 2, 3, 4],
                points : controls,
                outTangents : [
                    new Cesium.Cartesian3(1125196, -161816, 270551),
                    new Cesium.Cartesian3(-996690.5, -365906.5, 184028.5),
                    new Cesium.Cartesian3(-2096917, 48379.5, -292683.5),
                    new Cesium.Cartesian3(-890902.5, 408999.5, -447115)
                ],
                inTangents : [
                    new Cesium.Cartesian3(-1993381, -731813, 368057),
                    new Cesium.Cartesian3(-4193834, 96759, -585367),
                    new Cesium.Cartesian3(-1781805, 817999, -894230),
                    new Cesium.Cartesian3(1165345, 112641, 47281)
                ]
            });
            var positions = [];
            for (var i = 0; i <= 5; i+=0.1) {
                var cartesian3 = spline.evaluate(i);
                positions.push(cartesian3);
                viewer.entities.add({
                    position: cartesian3,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 6
                    }
                });
            }
        },
        pinterval:function(viewer){

            var controls = [
                    new Cesium.Cartesian3(1235398.0, -4810983.0, 4146266.0),
                    new Cesium.Cartesian3(1372574.0, -5345182.0, 4606657.0),
                    new Cesium.Cartesian3(-757983.0, -5542796.0, 4514323.0),
                    new Cesium.Cartesian3(-2821260.0, -5248423.0, 4021290.0),
                    new Cesium.Cartesian3(-2539788.0, -4724797.0, 3620093.0)
                ];
            var entities = viewer.entities.add({
                    position: controls,
                    polygon: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                });
            
            viewer.zoomTo(entities);
            entities.position.setInterpolationOptions({
                interpolationDegree : 5,
                interpolationAlgorithm : Cesium.LagrangePolynomialApproximation
            });
        }
    }

})