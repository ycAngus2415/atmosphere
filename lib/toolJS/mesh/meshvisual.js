/*
 * @Author: YangChao 
 * @Date: 2020-02-16 18:03:01 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-16 20:18:32
 */
import {PlaneBufferGeometry} from './PlaneBufferGeometry.js';

/**
 * @description mesh visual
 * @class meshVisual
 */
class meshVisual{
	constructor(viewer){
		this.viewer = viewer;
		
		viewer.extend(Cesium.viewerCesiumInspectorMixin);
		
		viewer.cesiumInspector.container.style.display = "none";
		
		// var geometry = this.initGraphics();
		var prim,geometry;
		[prim,geometry] = this.initGraphics2();
		
		var iswire = false;
		var that = this;
		$("#wireCheck").change(function(){
			viewer.cesiumInspector.viewModel.wireframe = !viewer.cesiumInspector.viewModel.wireframe;
			if(iswire){
				PlaneBufferGeometry.restoreFromWireframe(geometry);
				that.viewer.scene.primitives.remove(prim);
				prim = that.addPrimitive(geometry,that.modelMatrix,false)
				iswire=false;
			}
			else{
				PlaneBufferGeometry.toWireframe(geometry);
				that.viewer.scene.primitives.remove(prim);
				prim = that.addPrimitive(geometry,that.modelMatrix,false);
				iswire=true;
			}
			
			//Cesium.GeometryPipeline.toWireframe(geometry);
		})

	}
	initGraphics() {
	
		this.homePosition = [109.88, 38.18, 300000];
	
		var center = Cesium.Cartesian3.fromDegrees(this.homePosition[0], this.homePosition[1], 5000);
		
		var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
		
		var terrainWidth = 100;
		var terrainDepth = 100;
		var terrainHalfWidth = terrainWidth / 2;
		var terrainHalfDepth = terrainDepth / 2;
		var terrainMaxHeight = 2000;
		var terrainMinHeight = -1000;
		let geOption1 = {
			width: 1000,
			height: 1000,
			widthSegments: 99,
			heightSegments: 99,
		}
		let heightData = this.generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);
        var geometry = PlaneBufferGeometry.createGeometry(geOption1);
		
		var vertices = geometry.attributes.position.values;
		var colorarray = [];
		var colors1 = [[100,0,5],[0,0,255],[0,150,255],[0,255,255],[200,255,255],[255,250,150],[255,255,50],[255,150,100],[255,100,100],[255,0,0],[155,0,0],[100,50,0]];
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

			vertices[j + 2] = heightData[i];
			colorarray.push(Math.floor((heightData[i]+2000)/40),50,100);
		}
		var gcolor = new Cesium.GeometryAttribute({
			componentDatatype : Cesium.ComponentDatatype.UNSIGNED_BYTE,
			componentsPerAttribute :3,
			normalize:true,
			values : new Uint8Array(colorarray)
		})
		geometry.attributes.color = gcolor;

		PlaneBufferGeometry.computeVertexNormals(geometry);
		
		this.viewer.scene.camera.flyTo({
			destination: center,
		})
		// PlaneBufferGeometry.toWireframe(geometry)
		this.addPrimitive(geometry, modelMatrix, false)
		return geometry;
		
	}
	/**
	 * @description
	 * @returns prim, geometry
	 * @memberof meshVisual
	 */
	initGraphics2() {
		var extent = [73.4766, 40.1055, 80.088, 53.5693];

		//set up modelmatrix
		var center = Cesium.Cartesian3.fromDegrees((extent[0]+extent[2])/2, (extent[1]+extent[3])/2,10000);
		
		var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center );
		this.modelMatrix = modelMatrix;
		
		var terrainMaxHeight = 200000;
		var terrainMinHeight = -1000;
		
		//change the world coordinate to local coordinate
		var width = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(extent[0],extent[1]),
		Cesium.Cartesian3.fromDegrees(extent[2],extent[1]));
		var height = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(extent[0],extent[1]),
		Cesium.Cartesian3.fromDegrees(extent[0],extent[3]));

		//set param of planbuffergeometry
		let geOption1 = {
			width: Math.ceil(width),
			height: Math.ceil(height),
			widthSegments: 99,
			heightSegments: 99,
		}

		//setup geometry
		let heightData = this.generateHeight(100,100, terrainMinHeight, terrainMaxHeight);
        var geometry = PlaneBufferGeometry.createGeometry(geOption1);
		
		//set height data and color
		var vertices = geometry.attributes.position.values;
		var colorarray = [];
		//var colors1 = [[100,0,5],[0,0,255],[0,150,255],[0,255,255],[200,255,255],[255,250,150],[255,255,50],[255,150,100],[255,100,100],[255,0,0],[155,0,0],[100,50,0]];
        for (var i = 0, j = 0, l = vertices.length; j < l; i++, j += 3) {
			vertices[j + 2] = heightData[i];
			
			colorarray.push(Math.floor(2.5*(heightData[i]+1000)/2010),50,100);
		}

		//set color according height
		var gcolor = new Cesium.GeometryAttribute({
			componentDatatype : Cesium.ComponentDatatype.UNSIGNED_BYTE,
			componentsPerAttribute :3,
			normalize:true,
			values : new Uint8Array(colorarray)
		})
		geometry.attributes.color = gcolor;

		//get Normals from Vertex
		PlaneBufferGeometry.computeVertexNormals(geometry);
		
		this.viewer.scene.camera.flyTo({
			destination:  Cesium.Cartesian3.fromDegrees((extent[0]+extent[2])/2, (extent[1]+extent[3])/2,1000000),
			
		})

		// PlaneBufferGeometry.toWireframe(geometry)

		//add primitive
		var prim = this.addPrimitive(geometry,modelMatrix,false);
		return [prim, geometry];
		

	}

	/**
	 *
	 * @description add primitive with geometry/modelmatrix/translucent
	 * @param {Cesium.Geometry} geometry
	 * @param {Cesium.ModelMatrix} modelMatrix
	 * @param {Boolean} translucent
	 * @returns prim
	 * @memberof meshVisual
	 */
	addPrimitive(geometry, modelMatrix,translucent){
		var prim = this.viewer.scene.primitives.add(new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry,
				modelMatrix: modelMatrix,
				id: 'default',
			}),
			appearance: new Cesium.PerInstanceColorAppearance({translucent:translucent}),
			allowPicking: true,
			vertexCacheOptimize:true,
			interleave:true,
			cull:false,
		}))
		return prim;
	}

	/**
	 *
	 *
	 * @param {*} width
	 * @param {*} depth
	 * @param {*} minHeight
	 * @param {*} maxHeight
	 * @returns
	 * @memberof meshVisual
	 */
	generateHeight(width, depth, minHeight, maxHeight){

        // Generates the height data (a sinus wave)

        var size = width * depth;
        var data = new Float32Array(size);

        var hRange = maxHeight - minHeight;
        var w2 = width / 2;
        var d2 = depth / 2;
        var phaseMult = 12;

        var p = 0;
        for (var j = 0; j < depth; j++) {
            for (var i = 0; i < width; i++) {

                var radius = Math.sqrt(
                    Math.pow((i - w2) / w2, 2.0) +
                    Math.pow((j - d2) / d2, 2.0));
                var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
				if(height==undefined){
					console.log(radius)
				}
                data[p] = height;

                p++;
            }
        }

        return data;

	}

	generateHeight2(width, depth, minHeight, maxHeight){

        // Generates the height data (a sinus wave)

        var size = width * depth;
        var data = new Float32Array(size);

        var hRange = maxHeight - minHeight;
        var w2 = width / 2;
        var d2 = depth / 2;
        var phaseMult = 12;

        var p = 0;
        for (var j = 0; j < depth; j++) {
            for (var i = 0; i < width; i++) {

                var radius = Math.sqrt(
                    Math.pow((i - w2) / w2, 2.0) +
                    Math.pow((j - d2) / d2, 2.0));
                var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
				if(height==undefined){
					console.log(radius)
				}
                data[p] = height;

                p++;
            }
        }

        return data;

	}
	getColorRamp(){
		
		var ramp = document.getElementById('canvasMap');
		ramp.width = 100;
		ramp.height = 100;
		var ctx = ramp.getContext('2d');
	
		var values = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
		var grd = ctx.createRadialGradient(50,50,5,50,50,100);
		// var grd = ctx.createLinearGradient(0, 0, 100, 100);
		grd.addColorStop(values[0], '#000000'); //black
		grd.addColorStop(values[1], '#2747E0'); //blue
		grd.addColorStop(values[2], '#D33B7D'); //pink
		grd.addColorStop(values[3], '#D33038'); //red
		grd.addColorStop(values[4], '#FF9742'); //orange
		grd.addColorStop(values[5], '#ffd700'); //yellow
		grd.addColorStop(values[6], '#ffffff'); //white

		// grd.addColorStop(0, '#D33038'); //red
		// grd.addColorStop(1, '#FF9742'); //orange
	
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 100, 100);
	
		return ramp.toDataURL('image/tri');
	}
}
export{meshVisual};