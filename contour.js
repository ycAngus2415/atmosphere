class Contour{
    constructor(viewer){
        this.viewer = viewer;
        this.minHeight = -414.0; // approximate dead sea elevation
        this.maxHeight = 8777.0; // approximate everest elevation
        this.contourUniforms = {};
        this.shadingUniforms = {};
        this.updateMaterial();
    }

    getElevationContourMaterial() {
    // Creates a composite material with both elevation shading and contour lines
        return new Cesium.Material({
            fabric: {
                type: 'ElevationColorContour',
                materials: {
                    contourMaterial: {
                        type: 'ElevationContour'
                    },
                    elevationRampMaterial: {
                        type: 'ElevationRamp'
                    }
                },
                components: {
                    diffuse: 'contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse',
                    alpha: 'max(contourMaterial.alpha, elevationRampMaterial.alpha)'
                }
            },
            translucent: false
        });
    }

    updateMaterial() {
        var globe = this.viewer.scene.globe;
        var material;
        material = this.getElevationContourMaterial();
        this.shadingUniforms = material.materials.elevationRampMaterial.uniforms;
        this.shadingUniforms.minimumHeight = this.minHeight;
        this.shadingUniforms.maximumHeight = this.maxHeight;
        this.contourUniforms = material.materials.contourMaterial.uniforms;
        this.contourUniforms.width = 2;
        this.contourUniforms.spacing = 150;
        this.contourUniforms.color = Cesium.Color.RED.clone();
        globe.material = material;
    }
}
