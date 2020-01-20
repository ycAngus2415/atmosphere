class temputureMain{
    constructor(viewer){
        this.viewer = viewer;
        $("#tempId").fadeIn();

        var datasource = Cesium.GeoJsonDataSource.load('./kriging/bounds.geojson', {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK.withAlpha(0.1),
            strokeWidth: 1
        });
        var promise = viewer.dataSources.add(datasource);
        this.loadkriging(viewer);
        var temptureLayer = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: this.returnImgae(),
            rectangle: new Cesium.Rectangle(
                Cesium.Math.toRadians(73.4766),
                Cesium.Math.toRadians(18.1055),
                Cesium.Math.toRadians(135.088),
                Cesium.Math.toRadians(53.5693)
            )
        }));
        //viewer.dataSources.add(this.source)

        viewer.camera.flyTo({
            destination : Cesium.Rectangle.fromDegrees(73.0, 3.0, 135.0, 53.0)
        });
        $("#closeTemp").click(function(){
            viewer.imageryLayers.remove(temptureLayer,true);
            console.log(promise)
            promise.then(function(d){
                viewer.dataSources.remove(d,true);
            });
            viewer.camera.flyHome();
            $("#tempId").fadeOut();
        })
        
        // temptureLayer.alpha = 0.4
    }

    loadkriging(viewer) {
        var canvas = document.getElementById("canvasMap");
        canvas.width = 2000;
        canvas.height = 2000;
        let data = new temptureTestData();
        var tempture = data.tempture;
        var n = tempture.length;
        var t = [];
        var x = [];
        var y = [];
        for (var i = 0; i < n; i++) {
            t.push(tempture[i].properties.Temperatur); // 权重值
            x.push(tempture[i].geometry.coordinates[0]); // x
            y.push(tempture[i].geometry.coordinates[1]); // y
        }
        var variogram = kriging.train(t, x, y, "exponential", 0, 100);

        //等值线
        var extent = [73.4766, 18.1055, 135.088, 53.5693];
        var cellWidth = 0.05;
        var pointGrid = turf.pointGrid(extent, cellWidth, { units: 'degrees' });
        for (var i = 0; i < pointGrid.features.length; i++) {
            var temptemp = kriging.predict(pointGrid.features[i].geometry.coordinates[0],pointGrid.features[i].geometry.coordinates[1],variogram);
            pointGrid.features[i].properties.temperature = temptemp;
        }
        // var pwith = turf.pointsWithinPolygon(pointGrid, turf.multiPolygon([bounds]));
        var grid = kriging.grid(bounds, variogram, 0.05);
        var breaks = [];
        for(var i =0 ; i<11;i++){
            breaks.push(grid.zlim[0]+Math.floor(i*(grid.zlim[1]-grid.zlim[0])/11));
        }
        var lines1 = this.contour(pointGrid,breaks);
        this.lineWithinPolygon(lines1,turf.multiPolygon([[bounds[0]],[bounds[1]]]));
        this.source = Cesium.GeoJsonDataSource.load(lines1, {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK.withAlpha(1),
            strokeWidth: 1,
        });
        //temp
        var colors1 = ['rgb(0,0,50)','rgb(0,0,255)','rgb(0,150,255)','rgb(0,255,255)','rgb(200,255,255)','rgb(255,250,150)','rgb(255,255,50)','rgb(255,150,100)','rgb(255,100,100)','rgb(255,0,0)','rgb(155,0,0)'];
        //rain
        var colors2 = ['rgb(0,255,255)','rgb(255,255,180)','rgb(180,255,180)','rgb(100,255,100)','rgb(50,255,50)','rgb(0,150,0)','rgb(0,255,255)','rgb(0,150,255)','rgb(0,100,255)','0,0,255)','rgb(255,0,255)','rgb(125,0,65)'];
        var colors = ['rgb(155,0,0)',"#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"];

        kriging.plot(canvas, grid, [73.4766, 135.088], [18.1055, 53.5693], colors1);
    }
    returnImgae() {
        var mycanvas = document.getElementById("canvasMap");
        return mycanvas.toDataURL("image/png");
    }
    contour(p,breaks){

        // var breaks = [-20, -15, -10, -7, -3, 0, 3, 7, 10, 15, 20, 25];
        var lines = turf.isolines(p, breaks, { zProperty: 'temperature' });
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
        return lines;  
    }
    //featurecollection<multilinestring>,featurecollection<multipolygon>
    lineWithinPolygon(fcmultilinestring,polygon){
        
        console.log(fcmultilinestring)
        console.log('多边形',polygon);
        // if(fcmultilinestring.type!="FeatureCollection" &&fcmultipolygon.type!="Feature")
        // {
        //     console.log("featurecollections are required")
        //     return false;
        // }
        var newline = [];
        for(var i=0;i<fcmultilinestring.features.length;i++){
            var multilinestring = fcmultilinestring.features[i].geometry
            var temp = fcmultilinestring.features[i].properties.temperature;
            for(var j=0;j<multilinestring.coordinates.length;j++){
                var linestring = multilinestring.coordinates[j];
                var linesplit = turf.lineSplit(turf.lineString(linestring),polygon);
                var l = linesplit.features.length;
                for(var k=0;k<linesplit.features.length;k++){
                    if(turf.booleanPointInPolygon(linesplit.features[k].geometry.coordinates[1],polygon)){
                        this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(linesplit.features[k], {
                            stroke: new Cesium.Color(temp/40, temp/45+0.1, temp/50+0.3, 1),
                            fill: Cesium.Color.PINK.withAlpha(1),
                            strokeWidth: 1,
                        }));
                    }
                    
                }
                // var pwith = turf.pointsWithinPolygon(pointGrid, turf.polygon(bounds));
            }

        }


    }
    //feature<linestring>
    linetopoint(line){}
}


    

