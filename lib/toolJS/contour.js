class Contour{
    constructor(viewer){
        // 创建等值线区域
        var extent = [73.4766, 18.1055, 135.088, 53.5693];
        var cellWidth = 0.05;
        var pointGrid = turf.pointGrid(extent, cellWidth, { units: 'degrees' });
 
        for (var i = 0; i < pointGrid.features.length; i++) {
            pointGrid.features[i].properties.temperature = Math.random() * 10;
        }
        //等值线的级数
        
        var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
        var lines = turf.isolines(pointGrid, breaks, { zProperty: 'temperature' });
        //设置颜色
        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        };
        //进行平滑处理
            var _lFeatures = lines.features;
            for(var i=0;i<_lFeatures.length;i++){
                // _lFeatures[i].geometry.type="MultiPolygon";
                var _coords = _lFeatures[i].geometry.coordinates;
                var _lCoords = [];
                for(var j=0;j<_coords.length;j++){
                    var _coord = _coords[j];
                    var line = turf.lineString(_coord);
                    var curved = turf.bezierSpline(line);
                    _lCoords.push(curved.geometry.coordinates);
                }
                _lFeatures[i].geometry.coordinates = _lCoords;
            }
        //geojson数据读取
        //console.log(lines);
        // console.log(JSON.stringify(lines))
        // $.ajax({
        //     type:"post",
        //     url:"/saveJSON",
        //     data:JSON.stringify(lines),
        //     contentType: "application/json; charset=UTF-8",
        //     success: function(data) {
        //         console.log('success');
        //     }
        // });
        var source = Cesium.GeoJsonDataSource.load(lines, {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK.withAlpha(1),
            strokeWidth: 1,
        });
        viewer.dataSources.add(source)
    }
}
