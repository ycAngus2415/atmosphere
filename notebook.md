# 2019.12.15

* 粒子系统也是通过primitives添加的。
* 各种粒子系统实例都是通过渲染某一张图片，设置好粒子发射器、运动路径（比如重力）和坐标变换方式，就可以让一张图片通过粒子的方式展示。



# 2020.1.5

* 可以将echarts作为计算平台，将绘制的图形添加到cesium。
* 可以通过坐标变换的方式，设置echarts图形的坐标系到cesium地球，也可以在cesium通过添加entity的方式，放置在内置网页中。



# 2020.1.20

* primitives 、entities、datasources、imageryLayers都可以使用remove的方法将添加的内容删掉。datasources.add返回的是一个promise。使用then回调就可以删除。
* turf是一个很好的几何体交、并、删、等值线以及单位换算等的计算。且全部用标准的geojson格式。
* kriging算法能通过插值的方式通过点计算面，并返回值
* 获取一个面内的值，可以用turf做计算，但是有些feature是不支持的，可以利用turf自定义。
* nodejs作为服务端，大大的简化了前后端分离的问题，利用js实现全栈编辑。通过ajax和app可以快速交换数据（json，xml等），利用后台计算，返回前端，并通过异步的方式加载，增加前端流畅性。