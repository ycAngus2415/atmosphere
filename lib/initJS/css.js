/*
 * @Author: YangChao 
 * @Date: 2020-02-04 12:04:42 
 * @Last Modified by:   YangChao 
 * @Last Modified time: 2020-02-04 12:04:42 
 */
import {
    TempStat
} from "../echartsJS/tempstat.js";
import {
    SalStat
} from "../echartsJS/salstat.js";
class Css {
    constructor() {
        $(document).mousemove(function (e) {
            if (e.pageY < 50 && e.pageX > 100) {
                $(".topmenu").stop().animate({
                    top: 10
                }, 100)
            }
        });
        $(".topmenu").mouseleave(function () {
            $(".topmenu").stop().animate({
                top: -200
            }, 1000)
        });

        $('#tempState').click(function () {
            if ($('#tempS').length == 0) {
                $('.echartsBar').prepend('<div class="floatdiv" id="tempS"></div><img class="closetemp" id="closetempId1" src="./data/close.png" width=20px height=20px />');

            }
            // $('.echartsBar').css('display','block');
            $('.echartsBar').show(100);
            $('#closetempId1').show(100);
            $('#tempS').show(100);
            new TempStat()
            $('#closetempId1').click(function () {
                // $('.echartsBar').animate({
                //     height:'toggle'
                // });
                // $('.echartsBar').css('display','none');
                $('#closetempId1').hide(100);
                $('#tempS').hide(100);
                $('.echartsBar').hide(100);
            });
        })
        $('#salState').click(function () {
            if ($('#salstat').length == 0) {
                $('.echartsBar').prepend('<div class="floatdiv" id="salstat"></div><img class="closetemp" id="closetempId2" src="./data/close.png" width=20px height=20px />');
            }
            // $('.echartsBar').css('display','block');
            $('.echartsBar').show(100);
            $('#closetempId2').show(100);
            $('#salstat').show(100);
            new SalStat();
            $('#closetempId2').click(function () {
                // $('.echartsBar').animate({
                //     height:'toggle'
                // });
                // $('.echartsBar').css('display','none');
                $('#closetempId2').hide(100);
                $('#salstat').hide(100);
                $('.echartsBar').hide(100);
            });
        })
    }
}
export {
    Css
}