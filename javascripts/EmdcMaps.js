var $emdcMap = (function(window, $, BMap) {
    
       //地图对象
       var map = null;
    
       //当前地图容器
       var mapContainer = null; 
   //马拉松标注管理器
   var stationsManager = {
       add: function(stations) {
           var key = stations.name;
           //拒绝重复添加
          if (key in this) {
              return;
          };
           var _icon = new BMap.Icon('images/mapIcon.png', new BMap.Size(40, 40), {
               imageOffset: new BMap.Size(-120, -120)
           });
           var labelStyles = [{
               "padding": "3px 5px",
               "border-color": "#026135",
               "color": "#026135",
               "background-color": "#fff"
           }, {
               "padding": "3px 5px",
               "border-color": "#026135",
               "color": "#fff",
               "background-color": "#026135"
           }];
           //坐标转换
          /* var locations = volunteers.location.split(",");
           var Xcoordinate = parseFloat(locations[1]);
           var Ycoordinate = parseFloat(locations[0]);
           console.log(Xcoordinate);
           console.log(Ycoordinate);*/
            
           var marker = new BMap.Marker(new BMap.Point(stations.Xcoordinate,stations.Ycoordinate),{icon:_icon});
           //设置弹出窗口
           var infoWindow = new BMap.InfoWindow((function(stations) {
               var infoHtml = '<div class="info-window-content" style="width:300px;height:auto;">';
    
               infoHtml += '<div class="info-window-left" style="width:100%">';
               infoHtml +='</br><span class="info-window-label" style="margin-left:0;">医生</span></br>';
               for (var i = 0; i < stations.person.length; i++) {
                   if(stations.person[i].pType=="doctor"){
                       stations.person[i].pName && (infoHtml += '<span>姓名：</span><span>' + stations.person[i].pName + '</span><span style="display:inline-block;width:30px;"></span>');
                       stations.person[i].pPhone && (infoHtml += '<span>TEL：</span><span>' + stations.person[i].pPhone + '</span><span class="info-window-label">呼叫电话</span></br>');
                   };
    
               };
               infoHtml +='</br><span class="info-window-label" style="margin-left:0;">护士</span></br>';
               for (var i = 0; i < stations.person.length; i++) {
                   if(stations.person[i].pType=="nurse"){
                       stations.person[i].pName && (infoHtml += '<span>姓名：</span><span>' + stations.person[i].pName + '</span><span style="display:inline-block;width:30px;"></span>');
                       stations.person[i].pPhone && (infoHtml += '<span>TEL：</span><span>' + stations.person[i].pPhone + '</span><span class="info-window-label">呼叫电话</span></br>');
                   }
               };
               infoHtml +='</br><span class="info-window-label" style="margin-left:0;">车辆</span></br>'
               for (var i = 0; i < stations.ambulence.length; i++) {
                   stations.ambulence[i].ambName &&(infoHtml +='</span><span>司机：' + stations.ambulence[i].ambName + '</span>');
                   stations.ambulence[i].ambLicense && (infoHtml += '<span style="font-weight:blod;padding-right:5px;display:inline-block;margin-left:34px;">车牌：'+ stations.ambulence[i].ambLicense +'</span>');
                   stations.ambulence[i].ambPhone && (infoHtml += '<br/><span>TEL：</span><span>' + stations.ambulence[i].ambPhone + '</span><span class="info-window-label" style="margin-left:112px">呼叫电话</span><span style="width:100%;height:1px;border-bottom:1px dashed #d6d6d6;display:inline-block;"></span>');
                    
               };
               infoHtml += '</div>';
    
               infoHtml += '</div>';
    
               return infoHtml;
           })(stations), {
               title: '<div class="info-window-header">' + stations.name +'</div>',
               offset: new BMap.Size(0, -20)
           });
           //设置标签
           var label = new BMap.Label(stations.name, {
               offset: new BMap.Size(0, 40)
           });
           label.setStyle(labelStyles[0]);
           marker.setLabel(label);
           //鼠标点击事件
           marker.addEventListener('click', function() {
               this.openInfoWindow(infoWindow);
           });
           //鼠标移入事件
           marker.addEventListener('mouseover', function() {
               this.setTop(true);
               this.getLabel().setStyle(labelStyles[1]);
           });
           //鼠标移出事件
           marker.addEventListener('mouseout', function() {
               this.setTop(false);
               this.getLabel().setStyle(labelStyles[0]);
           });
           this[key] = marker;
           map.addOverlay(marker);
           this.length++;
       },
       clear:function(stations){
           for (var i = 0; i < stations.length; i++) {
               this.remove(stations[i]);
           }
       },
       remove: function(stations) {
                var newStationsObj = {};
                for (var i = 0; i < stations.length; i++) {
                   newStationsObj[stations[i].name] = stations[i];//name属性数组集合
                };
                for (var key in newStationsObj) {
                    //新列表中为要删除的志愿者  如果在地图上 ，则删除
                    if (this[key] instanceof BMap.Marker){
                        map.removeOverlay(this[key]);
                        delete this[key];
                        this.length--;       
                    }
                       
                };
           },
       addAll:function(stations){
            var newStationsObj = {};
            for (var i = 0; i < stations.length; i++) {
               newStationsObj[stations[i].name] = stations[i];//name属性数组集合
            };
            for (var key in newStationsObj) {
                this.add(newStationsObj[key]);
            }
       },
    
   };
   /*//车辆轨迹管理器
   var ambPathManager = {
       lushu: null,// 实例化一个驾车导航用来生成路线
       drv  new BMap.DrivingRoute('北京', {
           onSearchComplete: function(res) {
               if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                   var plan = res.getPlan(0);
                   var arrPois =[];
                   for(var j=0;j<plan.getNumRoutes();j++){
                       var route = plan.getRoute(j);
                       arrPois= arrPois.concat(route.getPath());
                   }
                   map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'}));
                  // map.setViewport(arrPois);
                    
                   lushu = new BMapLib.LuShu(map,arrPois,{
                   defaultContent:"",//"从天安门到百度大厦"
                   autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                   icon  : new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
                   speed: 4500,
                   enableRotation:true,//是否设置marker随着道路的走向进行旋转
                   landmarkPois: [
                      {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},
                      {lng:116.315391,lat:39.974429,html:'高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>',pauseTime:3},
                      {lng:116.381476,lat:39.894073,html:'肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>',pauseTime:2}
                   ]});          
               }
           }
       });
       //清除轨迹
      clear: function() {
           this.lushu = null;
           map.clearOverlays();
       }
   };*/
        
    
   return {
    
       //初始化地图
       init: function(domContainerId, lng, lat, level) {
   /*            ak = _ak;
           currentCity = cityName;*/
           mapContainer = $('#' + domContainerId);
           // 地图对象,禁用POI点击事件
           map = new BMap.Map(domContainerId, {
               mapType: BMAP_NORMAL_MAP,
               enableMapClick: false,
               minZoom: 6,
               maxZoom: 18
           });
    
           map.enableScrollWheelZoom(true); //允许滚轮缩放
           map.disableDoubleClickZoom(); // 禁止双击缩放
           // 地图样式
           // map.setMapStyle({
           //     style: 'grassgreen'
           // });
           map.centerAndZoom(new BMap.Point(lng, lat), 14); //设置中心点和缩放级别
    
           // 添加比例尺控件
           map.addControl(new BMap.ScaleControl());
    
           // 添加缩略图控件  
           map.addControl(new BMap.OverviewMapControl({
               size: new BMap.Size(300, 200),
               anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
               isOpen: true
           }));
           //地图点击事件
           function showInfo(e){
               $("#lng").val(e.point.lng);
               $("#lat").val(e.point.lat);
           };
           map.addEventListener("click", showInfo);
    
            // 定义一个控件类,即function
           function ZoomControl(){
             // 默认停靠位置和偏移量
             this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
             this.defaultOffset = new BMap.Size(0, 0);
           };
           // 通过JavaScript的prototype属性继承于BMap.Control
           ZoomControl.prototype = new BMap.Control();
           ZoomControl.prototype.initialize = function(map){
             // 创建一个DOM元素
             var div = document.createElement("div");
             // 添加文字说明
             div.appendChild(document.createTextNode("厦门国际马拉松竞赛2017"));
             // 设置样式
             div.style.fontSize = "30px";
             div.style.border = "1px solid #011e43";
             div.style.color = "#fff";
             div.style.width = "100%";
             div.style.height = "70px";
             div.style.lineHeight = "70px";
             div.style.paddingLeft = "30px";
             div.style.opacity = "0.8";
             div.style.backgroundColor = "#3e78c3";
             // 绑定事件,点击一次放大两级
             div.onclick = function(e){
               map.setZoom(map.getZoom() + 2);
             }
             // 添加DOM元素到地图中
             map.getContainer().appendChild(div);
             // 将DOM元素返回
             return div;
           };
           // 创建控件
           var myZoomCtrl = new ZoomControl();
           // 添加到地图当中
           map.addControl(myZoomCtrl);
    
    
           /*var polyline = new BMap.Polyline([
             new BMap.Point(121.441957,31.217516),
             new BMap.Point(121.441634,31.218033),
             new BMap.Point(121.44211,31.218242)
           ], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
           map.addOverlay(polyline);*/
       },
        
       //添加马拉松站点标注
       addMarathonMarkers: function(stations) {
         console.log("stations",stations);
           stationsManager.addAll(stations);
    
       },
       addMarathonPointsMarkers: function(points){
           var start = new BMap.Point(118.188356,24.477287);
           var end = new BMap.Point(118.080631,24.469127);
    
           var newOptionsObj = {};
           var point = [];
           for (var i = 0; i < points.length; i++) {
               var pX = points[i].Xcoordinate;
               var pY = points[i].Ycoordinate;
               newOptionsObj[i] = new BMap.Point(pX,pY);
               point.push(newOptionsObj[i]);
           };
           //console.log(point);           
           /*var driving = new BMap.DrivingRoute(map,{renderOptions:{map: map, autoViewport: true}});
           driving.search(start, end,{waypoints:""});//waypoints表示途经点
           var pts = driving.search(start, end,{waypoints:""});//waypoints表示途经点    //通过驾车实例，获得一系列点的数组
           var polyline = new BMap.Polyline(point, {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});     
           map.addOverlay(polyline);*/
    
            //添加轨迹
           /*map.addOverlay(new BMap.Polyline(
               point, {
                   strokeWeight: 5,
                   strokeColor: 'orange',
                   strokeOpacity: 0.8
               }
           ));*/
           //路书
           var lushu;
           var driving = new BMap.DrivingRoute('厦门', {
               onSearchComplete: function(res) {
                   if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                       var plan = res.getPlan(0);
                       var arrPois =[];
                       for(var j=0;j<plan.getNumRoutes();j++){
                           var route = plan.getRoute(j);
                           arrPois= arrPois.concat(route.getPath());
                       }
                       map.addOverlay(new BMap.Polyline(arrPois, {
                           strokeWeight: 7,
                           strokeColor: 'green',
                           strokeOpacity: 0.8
                       }));
                   }
               }
           });
           driving.search(start, end,{waypoints:point});
       },
       clearStations:function(stations){
           stationsManager.remove(stations);
       }
    
    
   }//return
   })(window, jQuery, BMap);