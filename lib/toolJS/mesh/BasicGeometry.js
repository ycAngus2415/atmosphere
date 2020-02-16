/*
 * @Author: YangChao 
 * @Date: 2020-02-16 18:19:24 
 * @Last Modified by:   YangChao 
 * @Last Modified time: 2020-02-16 18:19:24 
 */

/**
 *
 *
 * @class BasicGeometry
 */
class BasicGeometry{
    constructor(options) {
        this.positions = options.positions;
        this.normals = options.normals;
        this.uvs = options.uvs;
        this.indices = options.indices;
    }
/**
*
*@param {Cesium.BasicGeometry}basicGeometry
*@return {Cesiumm.Geometry} 
*/
    static createGeometry(basicGeometry) {
        if (!basicGeometry.positions) {
            throw new Error("缺少positions参数");
        }
        if (!basicGeometry.indices) {
            throw new Error("缺少indices参数");
        }
        var positions = basicGeometry.positions;
        var normals = basicGeometry.normals;
        var uvs = basicGeometry.uvs;
        var indices = basicGeometry.indices instanceof Int32Array ? basicGeometry.indices : new Int32Array(basicGeometry.indices);

        var attributes = {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions instanceof Float32Array ? positions : new Float32Array(basicGeometry.positions)
            })
        };
        if (normals) {
            attributes.normal = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: normals instanceof Float32Array ? normals : new Float32Array(normals)
            })
        }
        if (uvs) {
            attributes.uv = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: uvs instanceof Float32Array ? uvs : new Float32Array(uvs)
            })
        }


        var bs = Cesium.BoundingSphere.fromVertices(positions);
        var geo = new Cesium.Geometry({
            attributes: attributes,
            indices: new Int32Array(indices),
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            boundingSphere: bs
        });
        return geo;
    };
/**
 * @param gridX,the number of x direction
 * @param gridY, the number of y direction
 * @return {Array}indices, the face of geometry
 */
    static getTriangleIndice(gridX,gridY){
        let indices = [];
        for (let iy = 0; iy < gridY-1; iy++) {

            for (let ix = 0; ix < gridX-1; ix++) {

                var a = ix + gridX * iy;
                var b = ix + gridX * (iy + 1);
                var c = (ix + 1) + gridX * (iy + 1);
                var d = (ix + 1) + gridX * iy;

                // faces
                
                indices.push(a, b, d);
                indices.push(b, c, d);

            }

        }
        return indices
    }
}
export {BasicGeometry};