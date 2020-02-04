class TempStat{
    constructor(){
        var chart = echarts.init(document.getElementById('tempS'));

        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];

        for (var i = 0; i < 10; i++) {
            xAxisData.push('类目' + i);
            data1.push((Math.random() * 5).toFixed(2));
            data2.push(-Math.random().toFixed(2));
            data3.push((Math.random() + 0.5).toFixed(2));
            data4.push((Math.random() + 0.3).toFixed(2));
        }

        var itemStyle = {
            normal: {
                barBorderRadius: 5,
                label: {
                    show: true,
                    position: 'inside',
                    fontSize: '5',
                }
            },
            emphasis: {
                label: {
                    position: 'inside',
                    fontSize:'10',
                },
                barBorderColor: '#fff',
                barBorderWidth: 1,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
            }
        };

        chart.setOption({
            backgroundColor: 'rgba(0,0,0,0.3)',
            title: {
                text: '我是柱状图',
                left: 'center',
                textStyle: { color: '#fff' },
                padding: 20
            },
            legend: {
                left: 10,
                inactiveColor: '#abc',
                borderWidth: 1,
                textStyle: {color:'#fff'},
                data: [{
                    name: 'bar'
                }, 'bar2', '\n', 'bar3', 'bar4'],
                selected: {
                    // 'bar': false
                },
                // orient: 'vertical',
                // x: 'right',
                // y: 'bottom',
                align: 'left',

                tooltip: {
                    show: true
                }
            },
            brush: {
                xAxisIndex: 0
            },
            toolbox: {
                top: 50,
                // right: 20,
                feature: {
                    magicType: {
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    },
                    brush: {
                        type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear']
                    },
                    restore: {},
                    dataZoom: {},
                },

                iconStyle: {
                    emphasis: {
                        textPosition: 'top'
                        // textAlign: 'right'
                    }
                }
            },
            tooltip: {},
            grid: {
                top: 100
            },
            xAxis: {
                data: xAxisData,
                name: '横轴',
                silent: false,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    textStyle:{
                        color: '#fff'
                    }
                },
                // axisTick: {
                //     show: false
                // },
                axisLine: {
                    onZero: true
                    // lineStyle: {
                    //     width: 5
                    // }
                },
                splitLine: {
                    show: true
                },
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                inverse: true,
                // axisLabel: {
                //     show: false
                // },
                axisLabel: {
                    textStyle:{
                        color: '#fff'
                    }
                },
                // axisLine: {
                //     lineStyle: {
                //         width: 5
                //     }
                // },
                axisTick: {
                    show: false
                },
                // splitLine: {
                //     show: false
                // },
                splitArea: {
                    show: false
                }
            },
            series: [{
                name: 'bar',
                type: 'bar',
                stack: 'one',
                itemStyle: itemStyle,
                cursor: 'move',
                data: data1
            }, {
                name: 'bar2',
                type: 'bar',
                stack: 'one',
                itemStyle: itemStyle,
                cursor: 'default',
                data: data2
            }, {
                name: 'bar3',
                type: 'bar',
                stack: 'two',
                itemStyle: itemStyle,
                data: data3
            }, {
                name: 'bar4',
                type: 'bar',
                stack: 'two',
                itemStyle: itemStyle,
                data: data4
            }]
        });

        chart.on('click', function (params) {
            console.log(params);
        });

        chart.on('legendselectchanged', function (params) {
            chart.setOption({
                // title: {
                // },
                graphic: [{
                    type: 'circle',
                    shape: {
                        cx: 100,
                        cy: 100,
                        r: 20,
                    }
                }]
            });
        });

        window.onresize = chart.resize;
    }
}
export {TempStat};