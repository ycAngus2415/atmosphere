class adjust{
	constructor(viewer){
		this.addmenu();
		var imageryLayers = viewer.imageryLayers;

		// The viewModel tracks the state of our mini application.
		var viewModel = {
			brightness: 3,
			contrast: 1.02,
			hue: 0.18,
			saturation: 0,
			gamma: 0.26
		};
		// Convert the viewModel members into knockout observables.
		Cesium.knockout.track(viewModel);

		// Bind the viewModel to the DOM elements of the UI that call for it.
		var toolbar = document.getElementById('toolbar2');
		Cesium.knockout.applyBindings(viewModel, toolbar);

		// Make the active imagery layer a subscriber of the viewModel.
		function subscribeLayerParameter(name) {
			Cesium.knockout.getObservable(viewModel, name).subscribe(
				function(newValue) {
					if (imageryLayers.length > 0) {
						var layer = imageryLayers.get(0);
						layer[name] = newValue;
					}
				}
			);
		}
		subscribeLayerParameter('brightness');
		subscribeLayerParameter('contrast');
		subscribeLayerParameter('hue');
		subscribeLayerParameter('saturation');
		subscribeLayerParameter('gamma');

		// Make the viewModel react to base layer changes.
		function updateViewModel() {
			if (imageryLayers.length > 0) {
				var layer = imageryLayers.get(0);
				layer.brightness = viewModel.brightness;
				layer.contrast = viewModel.contrast;
				layer.hue = viewModel.hue;
				layer.saturation = viewModel.saturation;
				layer.gamma = viewModel.gamma;
			}
		}
		// imageryLayers.layerAdded.addEventListener(updateViewModel);
		// imageryLayers.layerRemoved.addEventListener(updateViewModel);
		// imageryLayers.layerMoved.addEventListener(updateViewModel);
		updateViewModel();
	}
	addmenu(){
		var me = `<div class='test' id="toolbar2">
			<table>
				<tbody><tr>
					<td>Brightness</td>
					<td>
						<input type="range" min="0" max="3" step="0.02" data-bind="value: brightness, valueUpdate: 'input'">
						<input type="text" size="5" data-bind="value: brightness">
					</td>
				</tr>
				<tr>
					<td>Contrast</td>
					<td>
						<input type="range" min="0" max="3" step="0.02" data-bind="value: contrast, valueUpdate: 'input'">
						<input type="text" size="5" data-bind="value: contrast">
					</td>
				</tr>
				<tr>
					<td>Hue</td>
					<td>
						<input type="range" min="0" max="3" step="0.02" data-bind="value: hue, valueUpdate: 'input'">
						<input type="text" size="5" data-bind="value: hue">
					</td>
				</tr>
				<tr>
					<td>Saturation</td>
					<td>
						<input type="range" min="0" max="3" step="0.02" data-bind="value: saturation, valueUpdate: 'input'">
						<input type="text" size="5" data-bind="value: saturation">
					</td>
				</tr>
				<tr>
					<td>Gamma</td>
					<td>
						<input type="range" min="0" max="3" step="0.02" data-bind="value: gamma, valueUpdate: 'input'">
						<input type="text" size="5" data-bind="value: gamma">
					</td>
				</tr>
			</tbody></table>
			</div>`;
		$(".cesium-viewer").append(me);

	}
}
export{adjust};