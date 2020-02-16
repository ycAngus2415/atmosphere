/*
 * @Author: YangChao 
 * @Date: 2020-02-03 21:57:59 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-12 23:12:41
 */

class init {
  constructor() {
    this.viewer = init.initCesium();

    this.viewer.scene.debugShowFramesPerSecond = true;
    // this.viewer.scene.globe.baseColor = new Cesium.Color(0/255,0/255,0/255,0.01);
    this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    this.show3DCoordinates(this.viewer);
    this.createMenu();
  }
  static initCesium() {
    var options = {
      baseLayerPicker: false,
      geocoder: false,
      infoBox: true,
      animation: false,
      timeline: false,
      shouldAnimate: true,
      fullscreenElement: 'cesiumContainer',
      scene3DOnly: true,
      imageryProvider: Cesium.createTileMapServiceImageryProvider({
        url: '/data/arcgis_word',
        layers: 'tile:arcgis',
      }),
    };
    return new Cesium.Viewer('cesiumContainer', options);
  }

  /*
   * 显示地图当前坐标
   */
  show3DCoordinates(viewer) {
    //地图底部工具栏显示地图坐标信息
    var elementbottom = document.createElement("div");
    $(".cesium-viewer").append(elementbottom);
    elementbottom.style.width = "90%";
    elementbottom.style.height = "30px";
    elementbottom.style.background = "rgba(0,0,0,0.5)";
    elementbottom.style.position = "absolute";
    elementbottom.style.bottom = "0px";
    elementbottom.style.cursor = "default";

    var coordinatesDiv = document.getElementById("map_coordinates");
    if (coordinatesDiv) {
      coordinatesDiv.style.display = "block";
    } else {
      coordinatesDiv = document.createElement("div");
      coordinatesDiv.id = "map_coordinates";
      coordinatesDiv.style.zIndex = "50";
      coordinatesDiv.style.bottom = "1px";
      coordinatesDiv.style.height = "29px";
      coordinatesDiv.style.position = "absolute";
      coordinatesDiv.style.overflow = "hidden";
      coordinatesDiv.style.textAlign = "center";
      coordinatesDiv.style.left = "10px";
      coordinatesDiv.style.lineHeight = "29px";
      coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
      $(".cesium-viewer").append(coordinatesDiv);
      var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler3D.setInputAction(function (movement) {
        var pick = new Cesium.Cartesian2(movement.endPosition.x, movement.endPosition.y);
        if (pick) {
          var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
          if (cartesian) {
            //世界坐标转地理坐标（弧度）
            var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            if (cartographic) {
              //海拔
              var height = viewer.scene.globe.getHeight(cartographic);
              //视角海拔高度
              var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
              var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
              //地理坐标（弧度）转经纬度坐标
              var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
              if (!height) {
                height = 0;
              }
              if (!he) {
                he = 0;
              }
              if (!he2) {
                he2 = 0;
              }
              if (!point) {
                point = [0, 0];
              }
              coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>视角高度:" + (he - he2).toFixed(2) + "米&nbsp;&nbsp;&nbsp;&nbsp;海拔高度:" + height.toFixed(2) + "米&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6) + "</span>";
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }

  createMenu() {
    //add menu
    var menu = $(`<div class="topmenu">
        <table class="menu">
            <tr>
              <th scope="col" class="tit">气象要素</th>
              <th scope="col" class="tit">地形要素</th>
              <th scope="col" class="tit">工具</th>
              <th scope="col" class="tit">测试内容</th>
              <th scope="col" class="tit">数据统计</th>
              <th scope="col" class="tit">关于</th>
            </tr>
            <tr valign="top">
              <td>
                <div class="option" id="rain"><label>雨显示</label></div>
                <div class="option" id="snow"><label>雪显示</label></div>
                <div class="option" id="heat"><label>热力图显示</label></div>
                <div class="option" id="wind"><label>风显示</label></div>
                
              </td>
              <td>
                <div class="option" id="wind"><label>等高线显示</label></div>
                <div class="option" id="limitId"><label>地形裁剪</label></div>
                <div class="option" id="distancemeasure"><label>测量</label></div>
              </td>
              <td>
                <div class="option" id="drawMenuId"><label>绘制</label></div>
                <div class="option"><label id="flyId">航线规划</label></div>
                <div class="option" id="insert"><label>添加图层</label></div>
                <div class="option" id="temp"><label>大面插值</label></div>
                <div class="option"><label>插入对象</label></div>
                <div class="option" id='arrowMenu'><label>箭头标绘</label></div>
              </td>
              <td>
                <div class="option" id="temp"><label>断面分析</label></div>
                <div class="option" id="meshVisualId"><label>体渲染</label></div>
                <div class="option" "><label>数据量渲染</label></div>
                <div class="option" id="performance"><label>性能检测</label></div>
              </td>
              <td>
                <div class="option" id="StatFrame"><label>统计界面</label></div>
                <div class="option" id="flow"><label>人口流动图</label></div>
              </td>
              <td>
                <div class="option" id="about"><label>关于我们</label></div>
                <div class="option" id="example"><label>实例</label></div>
              </td>
            </tr>
            
        </table>
        </div>`);

    //add option
    var option = $(`<div id="toolbar">
        <div id='insetImagery' class="menuOption">
          <center><div class='Title'>添加单个图层</div>
          </center><label class="option" id="closeInsert" style="position:absolute;right:10px;top:5px;float:right">关闭</label>
          <table>
            <tr>
              <td>经度开始：<input type="range" min="-180" max="180" step="1" data-bind="value: startLat, valueUpdate: 'input'">
              <input type="text" size="2" data-bind="value: startLat"></td>
              <td>
              经度结束：<input type="range" min="-180" max="180" step="1" data-bind="value: endLat, valueUpdate: 'input'">
              <input type="text" size="2" data-bind="value: endLat">
              </td>
            </tr>
            <tr>
              <td>
                纬度开始：<input type="range" min="-90" max="90" step="1" data-bind="value: startLon, valueUpdate: 'input'">
                <input type="text" size="2" data-bind="value: startLon">
              </td>
              <td>
                纬度结束：<input type="range" min="-90" max="90" step="1" data-bind="value: endLon, valueUpdate: 'input'">
                <input type="text" size="2" data-bind="value: endLon">
              </td> 
            </tr>
          </table>
          <button name="fileToUpload" id="file" data-bind="click: change" >打开文件</button>
          <input type="file" name="fileToUpload" id="fileToUpload" hidden>
        </div>
        <div id='limitOptionId' class="menuOption">
          <center><div class='Title'>裁剪地球</div>
          </center><label class="option" id="closeLimit" style="position:absolute;right:10px;top:5px;float:right">关闭</label>
          <table>
            <tr>
              <td>经度开始：<input type="range" min="-180" max="180" step="0.00001" data-bind="value: leftLon, valueUpdate: 'input'">
              <input type="text" size="2" style="width:60px" data-bind="value: leftLon"></td>
              <td>
              经度结束：<input type="range" min="-180" max="180" step="0.00001" data-bind="value: rightLon, valueUpdate: 'input'">
              <input type="text" size="2" style="width:60px" data-bind="value: rightLon">
              </td>
            </tr>
            <tr>
              <td>
                纬度开始：<input type="range" min="-90" max="90" step="0.00001" data-bind="value: leftLat, valueUpdate: 'input'">
                <input type="text" size="2" style="width:60px" data-bind="value: leftLat">
              </td>
              <td>
                纬度结束：<input type="range" min="-90" max="90" step="0.00001" data-bind="value: rightLat, valueUpdate: 'input'">
                <input type="text" size="2" style="width:60px" data-bind="value: rightLat">
              </td> 
            </tr>
          </table>
          <input id="limitCheck" type="checkbox"> <span>是否保留裁剪</span>
        </div>
        <div id='flyOptionId' class="menuOption">
          <center class='Title'>飞行控制</center>
          <label class="option" id="closeId2" style="position:absolute;right:10px;top:0px;float:right">关闭</label>
          <table>
            <tr>
              <td><button id="startfly" >开始</button></td>
              <td><button id="pouse" >暂停</button></td>
              <td><button id="foward" >前进</button></td>
              <td><button id="back" >后退</button></td>
              <td><button id="tracked" >跟踪</button</td>
              <td><button id="custom" >自定义</button></td>
            </tr>
          </table>
        </div>
        <div id='flowId' class="menuOption">
          <div class='Title'>人口流动图</div>
          <label class="option" id="closeFlow">关闭</label>
        </div>
        <div id='drawgeometryId' class="menuOption">
          <div class='Title'>多边形绘制</div>
          <label class="option" id="closeDraw" style="position:absolute;right:10px;top:0px;float:right">关闭</label>
          <table>
            <tr>
              <td><button id="rectId“>正方形</button></td>
              <td><button id="triId">三角形</button></td>
              <td><button id="polyId">多边形</button></td>
              <td><button id="cirId">圆</button></td>
              <td><button id="cubeId”>正方体</button></td>
              <td><button id="cylinId">圆柱体</button></td>
              <td><button id="ellipId">椭圆体</button></td>
            </tr>
          </table>
        </div>
        <div id='draw1id'></div>
        
        <div id='tempId' class="menuOption">
          <div class='Title'>插值温度图</div>
          <label class="option" id="closeTemp">关闭</label>
        </div>
        <div id='windId' class="menuOption" style="right:260px;">
          <div class='Title'>风场图</div>
          <label class="option" id="closewind">关闭</label>
        </div>
        <div id='rainId' class="menuOption">
          <div class='Title'>降雨</div>
          <label class="option" id="closerain">关闭</label>
        </div>
        <div id='snowId' class="menuOption">
          <div class='Title'>降雪</div>
          <label class="option" id="closesnow">关闭</label>
        </div>
        <div id='heatId' class="menuOption">
          <div class='Title'>热力图</div>
          <label class="option" id="closeheat">关闭</label>
        </div>
        <div id='measureId' class="menuOption">
          <center><div class='Title'>测量线面</div></center>
          <label class="option" id="removemeasure" style="position:absolute;right:10px;top:0px;float:right">关闭</label>
          <table>
            <tr>
              <td>
                <button id="point">画点</button>
              </td>
              <td>
                <button id="line">长度测量</button>
              </td>
              <td>
                <button id="polygon">面积测量</button>
              </td>
              <td>
                <button id="elevation">量高</button>
              </td>
            </tr>
          </table>
        </div>
        <div id="arrowId" class="menuOption">
          <button id="straightArrow">直线箭头</button>
          <button id="attackArrow">攻击箭头</button>
          <button id="pincerArrow">钳击箭头</button>
          <button id="clear">删除</button>
          <button id="save">保存</button>
          <button id="show">展示</button>
          <button id="clearall">全部删除</button>
        </div>
        <div id="meshOptionId" class="menuOption">
          <input id="wireCheck" type="checkbox"> <span>是否显示渲染框架</span>
        </div>
      </div>`);

    var sfleft = $(`<div id='statframleftID' class='sfClass' style="left:-500px">
      <table class="sfTable">
        <tr>
          <td>
            <div class="floatdiv" id="tempS"></div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="floatdiv" id="weatherFutureId"></div>
          </td>
        </tr>
      </table>
      <img class="closetemp" id="closetempId1" src="./data/close.png" width=20px height=20px />
      </div>`);
      var sfright = $(`<div id='statframrightID' class='sfClass' style="right:-500px">
      <table class="sfTable">
        <tr>
          <td>
            <div class="floatdiv" id="rainFallId"></div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="floatdiv" id="weatherId"></div>
          </td>
        </tr>
      </table>
      </div>`);
    var log = $('<div id="logging"></div>');
    var me = `<div class="test" id="toolbar2">
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
    $(".cesium-viewer").append(sfleft);
    $(".cesium-viewer").append(sfright);
    $(".cesium-viewer").append(menu);
    $(".cesium-viewer").append(option);
    $(".cesium-viewer").append(log);
    
  }
}
export {
  init
};