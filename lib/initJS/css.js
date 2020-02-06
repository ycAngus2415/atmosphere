/*
 * @Author: YangChao 
 * @Date: 2020-02-04 12:04:42 
 * @Last Modified by: YangChao
 * @Last Modified time: 2020-02-06 21:27:03
 */

class Css {
    constructor() {
        $(document).mousemove(function (e) {
            if (e.pageY < 50 && e.pageX > 100) {
                TweenMax.to($(".topmenu"),0.5,{top: '10px'});
            }
        });
        $(".topmenu").mouseleave(function () {
            TweenMax.to($(".topmenu"),0.6,{top: '-200px'});
        });
        $('#closetempId1').click(function(){
            TweenMax.to($('#statframleftID'),1,{x: "-=500"});
            TweenMax.to($('#statframrightID'),1,{x: "+=500"});
        });
        $('#closeDraw').click(function(){
            $('#drawId').fadeOut(100);
        });
        
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