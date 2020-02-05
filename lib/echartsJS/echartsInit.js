class echartsInit{
	constructor(element){}
	init(element, option){
		let main = document.getElementById(element);
		
		let existInstance = echarts.getInstanceByDom(main);
		let echart=undefined;
		if (!existInstance) {
			echart = echarts.init(main);
			echart.setOption(option);
		}
		return echart;

	}
}
export {echartsInit}