define(['jquery',],function(jquery){
    $(document).mousemove(function (e) {
        if(e.pageY<50){
            $(".topmenu").stop().animate({
                top:0
            },100)
        }
    });
    $(".topmenu").mouseleave(function () {
        $(".topmenu").stop().animate({
            top:-200
        },1000)
    });
    $("#contour").click(function(){
      $("#contourmenu").fadeIn();
      $("#closeId1").click(function(){
        $("#contourmenu").fadeOut();
      })
      // $("#contourmenu").fadeToggle();
    });

    $('#tempState').click(function(){
        if($('#tempS').length==0){
            $('.echartsBar').prepend('<div class="floatdiv" id="tempS"></div><img class="closetemp" id="closetempId1" src="./data/close.png" width=20px height=20px />');
            
        }
        // $('.echartsBar').css('display','block');
        $('.echartsBar').show(100);
        $('#closetempId1').show(100);
        $('#tempS').show(100);
        requirejs(['tempstat']);
        $('#closetempId1').click(function(){
            // $('.echartsBar').animate({
            //     height:'toggle'
            // });
            // $('.echartsBar').css('display','none');
            $('#closetempId1').hide(100);
            $('#tempS').hide(100);
            $('.echartsBar').hide(100);
        });
    })
    $('#salState').click(function(){
        if($('#salstat').length==0){
            $('.echartsBar').prepend('<div class="floatdiv" id="salstat"></div><img class="closetemp" id="closetempId2" src="./data/close.png" width=20px height=20px />'); 
        }
        // $('.echartsBar').css('display','block');
        $('.echartsBar').show(100);
        $('#closetempId2').show(100);
        $('#salstat').show(100);
        requirejs(['paral']);
        $('#closetempId2').click(function(){
            // $('.echartsBar').animate({
            //     height:'toggle'
            // });
            // $('.echartsBar').css('display','none');
            $('#closetempId2').hide(100);
            $('#salstat').hide(100);
            $('.echartsBar').hide(100);
        });
    })
    
    
})