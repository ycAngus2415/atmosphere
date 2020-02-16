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

# 2020.1.30

* MIT license 是最简单最方便的许可证，通过github能直接添加各样的许可证。
* 许可证是一种授权，版权属于自己，使用别人的授权代码，别人是有版权的。当然，别人使用自己的也需要这种许可证。若是没有许可证，别人是不能使用自己的代码的。
* 有些许可证是可以商业闭源的，有些是不可以的。
* 现在的浏览器很多都不支持es6的语法，或者仅仅是部分支持，比如你用.360浏览器，你会发现它支持let却不支持箭头函数等。babel就承担了“翻译”的角色，把es6的写法转换成es5的写法。 但是有些人可能在一个项目中单独安装完babel，并成功生成了新的文件后，发现导入这个文件到浏览器中却报错了。其中很有可能被误导的是 import这个关键词。实际上babel转换后的代码是遵循commonJS规范的，而这个规范，浏览器并不能识别。因此导入到浏览器中会报错，而nodeJS是commonJS的实现者，所以在babel转换后的代码是可以在node中运行的。为了将babel生成的commonJS规范的es5写法能够在浏览器上直接运行，我们就借住了webpack这个打包工具来完成，因为webpack本身也是遵循commonJS这个规范的
* 总会有人把es6的export和commonJS的module.exports拿来做比较，他们是完全不同的东西。至于在网上看到的代码，有一些用export有一些用module.exports区别只是在于他们有没有用es6的规范来写，完整的流程是 es6->es5(commonJS规范)->浏览器可执行代码。重点只在于他们是直接用es5写还是用es6写，用es6的话就多了一个转换的步骤.
* 那么我们应该如何利用webpack完成一整个步骤呢？即用es6写法直接生成浏览器可识别的代码，而不用单独用babel指令生成代码再转换。webpack为我们提供了一系列的方案。
* 打包的全局变量用window
* jquery 这种全局的变量，可以用插件ProvidePlugin直接引入。
* webpack.ProvidePlugin使用的第三方模版，应该是commonJS规范导出的。
* amd 规范，requirejs使用异步导入模块，异步有异步的好处，当然也有一定缺陷，好处是页面更流程，缺点就是逻辑不明确。为了，逻辑，还是牺牲一些流畅性吧。后面再来找有没有更好的方式。

# 2020.2.3
* echarts确实还是简单，把数据放进去就可以了的样子。
* 但是要将其放到地球中，还需要对坐标轴编码，可能得自己写,叫基于cesium的数据统计三维可视化吧。
* CSS 有动画，但是有很多框架已经做了，这一块需要一个人专门来做。比较难。

# 2020.2.10
* 几何体完全可以用primitive添加，entity虽然也可以，但是性能没有primitive高。
* geometry类是一个描述类，geometryinstances是geometry的实体类，primitive 可以直接添加geometryinstances类
* primitive添加的geometryinstances 可以通过设置appearance来渲染材质和纹理
* entity 可以使用property属性，利用callbackproperty刷新实体的属性，但是primitive我还不知道怎么弄。找了好久，发现了一个update函数，但是不知道怎么用。
* cesium.knockout可以进行绑定，将ui和cesium做成响应式交互。vue应该更好

# 2020.2.17
* geometry 可以通过设置点的局部坐标得到任何几何体，通过设置点的索引，将其渲染为三角网，
* 局部坐标的实体，通过modelmatrix转换成世界坐标，并放在世界坐标系中。
* 局部坐标系中的几何体可以设置color属性，这样，每个点都可以有不同的颜色属性，比起实体中的颜色，更具有自定义特性。
* 本来计划使用贴图的方式，先在cavas中生成渐变色的几何体，然后贴图到几何体中，但是，这又涉及到坐标转化，而且试验后效果并不好。
* towireframe函数可以将实体转换成三角网。
* primitive的属性geometry直接更新是做不到的，不知道怎样才能做到geometry属性的更新。目前只能重新渲染一个新的primitive来实现更新。