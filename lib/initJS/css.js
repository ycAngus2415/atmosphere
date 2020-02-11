import {  Linear } from "../gsap.min.js";

/*
 * @Author: YangChao 
 * @Date: 2020-02-04 12:04:42 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-11 21:59:42
 */

class Css {
    constructor() {
        $(document).mousemove(function (e) {
            if (e.pageY < 50 && e.pageX > 100) {
                TweenMax.to($(".topmenu"),0.5,{top: '10px'});
            }
            if ( e.pageX < 20) {
                TweenMax.to($("#toolbar2"),0.5,{left: '0px'});
            }
        });
        $(".topmenu").mouseleave(function () {
            TweenMax.to($(".topmenu"),0.6,{top: '-200px'});
        });
        $(".test").mouseleave(function () {
            TweenMax.to($("#toolbar2"),0.6,{left: '-300px'});
        });
        $('#closetempId1').click(function(){
            TweenMax.to($('#statframleftID'),1,{x: "-=500"});
            TweenMax.to($('#statframrightID'),1,{x: "+=500"});
        });
        $('#closeDraw').click(function(){
            $('#measureId').fadeOut(100);
        });
        $("#remove").click(function(){
            $('#measureId').fadeOut(100);
        })
        $("#about").click(function(){
            window.location.href = './CesiumMeshVisualizer-master/index.html';
        });
        $("#example").click(function(){
            window.location.href = './Cesium-1.55/index.html';
        });
        $("#performance").click(function(){
            $(".cesium-performanceDisplay-defaultContainer").toggle();
        })
    }
    static animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)
    
        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)
    
            if (typeof callback === 'function') callback()
        }
    
        node.addEventListener('animationend', handleAnimationEnd)
    }
}
export {
    Css
}