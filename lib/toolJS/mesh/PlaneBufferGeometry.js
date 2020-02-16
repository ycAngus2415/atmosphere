/*
 * @Author: YangChao 
 * @Date: 2020-02-16 18:13:01 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-16 18:52:35
 */

import {BasicGeometry} from './BasicGeometry.js'

/**
 *
 *
 * @class PlaneBufferGeometry
 */
class PlaneBufferGeometry{
    constructor(options) {
        this.width = options.width;
        this.height = options.height;
        this.widthSegments = options.widthSegments;
        this.heightSegments = options.heightSegments;
    }

    /**
     *
     *
     * @static
     * @param {*} planeBufferGeometry
     * @returns
     * @memberof PlaneBufferGeometry
     */
    static createGeometry(planeBufferGeometry) {

        var width = planeBufferGeometry.width,
            height = planeBufferGeometry.height,
            widthSegments = planeBufferGeometry.widthSegments,
            heightSegments = planeBufferGeometry.heightSegments;

        width = width || 1;
        height = height || 1;

        var width_half = width / 2;
        var height_half = height / 2;

        var gridX = Math.floor(widthSegments) || 1;
        var gridY = Math.floor(heightSegments) || 1;

        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;

        var segment_width = width / gridX;
        var segment_height = height / gridY;

        var ix, iy;

        // buffers

        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];

        // generate vertices, normals and uvs

        for (iy = 0; iy < gridY1; iy++) {

            var y = iy * segment_height - height_half;

            for (ix = 0; ix < gridX1; ix++) {

                var x = ix * segment_width - width_half;

                vertices.push(x, -y, 0);

                normals.push(0, 0, 1);

                uvs.push(ix / gridX);
                uvs.push(1-(iy / gridY));

            }

        }

        // indices

        indices = BasicGeometry.getTriangleIndice(gridX1, gridY1);

        var geom= BasicGeometry.createGeometry({
            positions: new Float32Array(vertices),
            normals: new Float32Array(normals),
            uvs: new Float32Array(uvs),
            indices: new Int32Array(indices)
        })
        
            return geom;
    }
    
    static computeVertexNormals(geometry) {

        var indices = geometry.indices;
        var attributes = geometry.attributes;
        var il = indices.length;
        if (attributes.position) {

            var positions = attributes.position.values;

            if (attributes.normal === undefined) {
                attributes.normal = new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 3,
                    values: new Float32Array(positions.length)
                })

            } else {

                // reset existing normals to zero

                var array = attributes.normal.values;

                for (var i = 0; i < il; i++) {

                    array[i] = 0;

                }

            }

            var normals = attributes.normal.values;

            var vA, vB, vC;

            var pA = new Cesium.Cartesian3(), pB = new Cesium.Cartesian3(), pC = new Cesium.Cartesian3();
            var cb = new Cesium.Cartesian3(), ab = new Cesium.Cartesian3();

            for (var i = 0; i < il; i += 3) {

                vA = indices[i + 0] * 3;
                vB = indices[i + 1] * 3;
                vC = indices[i + 2] * 3;

                Cesium.Cartesian3.fromArray(positions, vA, pA);
                Cesium.Cartesian3.fromArray(positions, vB, pB);
                Cesium.Cartesian3.fromArray(positions, vC, pC);

                Cesium.Cartesian3.subtract(pC, pB, cb);
                Cesium.Cartesian3.subtract(pA, pB, ab);
                Cesium.Cartesian3.cross(cb, ab, cb);

                normals[vA] += cb.x;
                normals[vA + 1] += cb.y;
                normals[vA + 2] += cb.z;

                normals[vB] += cb.x;
                normals[vB + 1] += cb.y;
                normals[vB + 2] += cb.z;

                normals[vC] += cb.x;
                normals[vC + 1] += cb.y;
                normals[vC + 2] += cb.z;

            }

            PlaneBufferGeometry.normalizeNormals(geometry);

            attributes.normal.needsUpdate = true;

        }

        return geometry;
    }
    static normalizeNormals(geometry) {

        var normals = geometry.attributes.normal.values;

        var x, y, z, n;

        for (var i = 0; i < normals.length; i += 3) {

            x = normals[i];
            y = normals[i + 1];
            z = normals[i + 2];

            n = 1.0 / Math.sqrt(x * x + y * y + z * z);

            normals[i] = x * n;
            normals[i + 1] = y * n;
            normals[i + 2] = z * n;
        }

    }
    static toWireframe(geometry){
        if (geometry.primitiveType !== Cesium.PrimitiveType.TRIANGLES
            && geometry.primitiveType !== Cesium.PrimitiveType.TRIANGLE_FAN
            && geometry.primitiveType !== Cesium.PrimitiveType.TRIANGLE_STRIP) {
            return geometry;
        }
        if (!geometry.triangleIndices) {
            geometry.triangleIndices = geometry.indices;
        }
        //if (geometry.lineIndices) {
        //    geometry.indices = geometry.lineIndices;
        //    return geometry;
        //}
        geometry = Cesium.GeometryPipeline.toWireframe(geometry);
        //geometry.lineIndices = geometry.indices;
        return geometry;
    }
    static restoreFromWireframe(geometry) {
        if (geometry.triangleIndices) {
            geometry.indices = geometry.triangleIndices;
        }
        geometry.primitiveType = Cesium.PrimitiveType.TRIANGLES;
        return geometry;
    }
}

export{PlaneBufferGeometry};