$(function(){
	$('.down ul').find('li .name span').hover(function(){
      $(this).parents('li').find('.intro').show();
    },function(){
      $(this).parents('li').find('.intro').hide();
    });

    $('.down ul').find('li .intro').hover(function(){
      $(this).show();
    },function(){
      $(this).hide();
    });


	//--
	$('.foot').find('.link').find('a:last').css('background','none');
	//--
	$('.listHover').find('li').hover(
	  function(){
		  $(this).addClass('on');
		  },
	  function(){
		  $(this).removeClass('on');
		  }
	)
	$('.Businesslist').find('li').hover(
	  function(){
		  $(this).addClass('on');
		  },
	  function(){
		  $(this).removeClass('on');
		  }
	)

	$('.down .listHover').find('li a').hover(
	  function(){
		  $(this).addClass('on');
		  $(this).parents('li').addClass('on');
		  },
	  function(){
		  $(this).removeClass('on');
		  $(this).parents('li').removeClass('on');
		  }
	)

    //
	//$(".jcs7 a").mouseover(function(){
    //
	//	$(this).css('background','#1280e1' );
	//});



	$('.jcs7 a').hover(
		function(){
			$(this).css('background','#1280e1');
			$(this).css('color','#fff');
		},
		function(){
			$(this).css('background','none');
			$('.jcs7 li>a').css('color','#1280e1');
			$('.jcs7 dd>a').css('color','#666');
		}
	)



	$('.jcs7 li').hover(
		function(){
			$(this).css('border','1px  #1280e1 solid');

		},
		function(){
			$(this).css({border:"none"});
		}
	)

	$('.jcs4 a').hover(
		function(){
			$(this).css('background','#1280e1');
			$(this).css('color','#fff');
		},
		function(){
			$(this).css('background','none');
			$('.jcs4 li>a').css('color','#1280e1');
			$('.jcs4 dd>a').css('color','#666');
		}
	)

	$('.jcs4 li').hover(
		function(){
			$(this).css('border','1px  #1280e1 solid');

		},
		function(){
			$(this).css({border:"none"});
		}
	)




/*	$('.Bann .btn .a-0').hover(
		function(){
			$(this).css('background','-webkit-gradient(linear, 0 8, 0 bottom, from(#fff), to(#76bdfc))');
$(this).css('color','1280e1');
		},
		function(){
			$(this).css('background','#fff');

		}
	)

8/
	$('.Bann .btn .a-1').hover(
		function(){
			$(this).css('background','-webkit-gradient(linear, 0 20, 0 bottom, from(#2595f8), to(#a4cff5))');

		},
		function(){
			$(this).css('background','none');

		}
	)


	$('.btn .ffa').hover(
		function(){
			$(this).css('background','-webkit-gradient(linear, 0 8, 0 bottom, from(#7fd5dd), to(#cbf3f7))');
			

		},
		function(){
			$(this).css('background','#a8edf3');$(this).css('color','#fff');

		}
	)


	$('.btn .ffa2').hover(
		function(){
			$(this).css('background','-webkit-gradient(linear, 0 8, 0 bottom, from(white), to(#a2dce1))');

		},
		function(){
			$(this).css('background','white');

		}
	)
*/


	//--
	$('.topA').click(function(){
		$('body,html').stop(true,true).animate({scrollTop: 0}, 500);
		})
	var prevTop = 0,
        currTop = 0;
	$(window).scroll(function(){
		if($(window).scrollTop()>600){
			$('.sideBar').fadeIn(300);
			}else{
				$('.sideBar').fadeOut(300);
				}
		//--
		/*if($(window).scrollTop()>100){
			$('.headDiv').addClass('fixed');
			$('.sNavD').addClass('fixed');
			}else{
				$('.headDiv').removeClass('fixed');
				$('.sNavD').removeClass('fixed');
				}
		currTop = $(window).scrollTop();
		if(currTop < prevTop) {
			$('.headDiv').addClass('fixedShow');
			$('.sNavD').addClass('fixedShow');
			}else{
				$('.headDiv').removeClass('fixedShow');
				$('.sNavD').removeClass('fixedShow');
				}
		setTimeout(function(){prevTop = currTop},100);*/
		//--
		if($('.pageNav2D').length>0){
		if($(window).scrollTop()>$('.pageNav2D').offset().top-$('.headDiv').height()){
			$('.pageNav2').addClass('on');
			}else{
				$('.pageNav2').removeClass('on');
				}
		}
		if($('.pageBanner').find('.list').length>0){
		if($(window).scrollTop()>$('.pageBanner').offset().top+317-$('.headDiv').height()){
			$('.pageBanner').find('.list').addClass('on');
			}else{
				$('.pageBanner').find('.list').removeClass('on');
				}
		}
		//
		})
	//--
	$('.sNav').find('.list').find('a').each(function(i){
		$(this).hover(
		   function(){
			   $('.sNav').find('.list').find('a').removeClass('on');
			   $(this).addClass('on');
			   $('.sNav').find('.list2').hide();
			   $('.sNav').find('.list2').eq(i).show();
			   },
		   function(){}
		)
		})
		
		
	$('.sNav').find('.list-2Div').each(function(){
		var _this=$(this);
		_this.find('.list1').find('a').each(function(ii){
			$(this).hover(
			   function(){
				   _this.find('.list1').find('a').removeClass('on');
				   $(this).addClass('on');
				   _this.find('.list3').hide();
				   _this.find('.list3').eq(ii).show();
				   },
			   function(){}
			)
			})
		})	
		
		
		
	//--
	// $('.sNavA').each(function(i){
	// 	$(this).hover(
	// 	   function(){
	// 	   		$('.sNavD').eq(i).addClass('on');
	// 		   },
	// 	   function(){
	// 		   $('.sNavD').removeClass('on');
	// 		   }
	// 	)
	// 	$('.sNavD').eq(i).hover(
	// 	   function(){
	// 		   $('.sNavA').eq(i).addClass('on1');
	// 		   $(this).addClass('on');
	// 		   },
	// 	   function(){
	// 		   $('.sNavA').eq(i).removeClass('on1');
	// 		   $(this).removeClass('on');
	// 		   }
	// 	)
	// 	})

	$('.listnav').hover(function(){
			var cWidth = document.body.clientWidth || document.documentElement.clientWidth;//页面可视区域宽度
			var iWidth = window.innerWidth;//浏览器窗口大小
			//console.log(iWidth - cWidth);//打印滚动条宽度
			var iWidth= iWidth - cWidth;
		   	var index = $(this).index();
		   		$('.sNavD:eq('+(index)+')').addClass('on');
		   		$('.body').addClass('on');//禁止body出现滚动条
		   		$(".body").attr("id","body");							
		   		document.getElementById("body").style.padding="0 "+iWidth+"px 0 0";
			   },
		   function(){
			   $('.sNavD').removeClass('on');
			   $('.body').removeClass('on');
			   document.getElementById("body").style.padding="0";
		   $(".body").attr("id","");
	})
	$('.sNavD').hover(
	   function(){
	   		var cWidth = document.body.clientWidth || document.documentElement.clientWidth;//页面可视区域宽度
			var iWidth = window.innerWidth;//浏览器窗口大小
			//console.log(iWidth - cWidth);//打印滚动条宽度
			var iWidth= iWidth - cWidth;
		   $(this).addClass('on');
		   $('.body').addClass('on');//禁止body出现滚动条
		   $(".body").attr("id","body");							
		   document.getElementById("body").style.padding="0 "+iWidth+"px 0 0";
		   },
	   function(){
		   $(this).removeClass('on');
		   $('.body').removeClass('on');		   							
		   document.getElementById("body").style.padding="0";
		   $(".body").attr("id","");
		   }
	)
	//--
	$('.infomation_02').find('h2:first').css('background','none');
	$('.infomation_02').find('.btn').find('li').each(function(i){
		$(this).click(function(){
			$('.infomation_02').find('.btn').find('li').removeClass('on');
			$(this).addClass('on');
			$('body,html').stop(true,true).animate({scrollTop: $('.infomation_02').find('h2').eq(i).offset().top}, 500);
			})
		})
	//--
	$('.jobClass').find('dl').find('dd:last').css('background','none');
	$('.job').find('tr').hover(
	  function(){
		  $(this).addClass('on');
		  },
	  function(){
		  $(this).removeClass('on');
		  }
	)
	//--
	$('.news').find('li:last').addClass('liLast');
	$('.newSide_01').find('li').hover(
	  function(){
		  $('.newSide_01').find('li').removeClass('on');
		  $(this).addClass('on');
		  },
	  function(){}
	)
	$('.newSide_02').find('li:last').css('border','0px');
	//--
	$('.select').each(function(i){
		$(this).find('select').change(function(){
			$('.select').eq(i).find('span').html($(this).val());
			})
		})
	//--
	$('.downSide').find('li').each(function(i){
		$(this).find('.name').click(function(){
			if($('.downSide').find('li').eq(i).hasClass('on')){
				$('.downSide').find('li').removeClass('on');
				}else{
					$('.downSide').find('li').removeClass('on');
					$('.downSide').find('li').eq(i).addClass('on');
					}
			})
		})
	//--
	$('.sideBar').find('.liI').each(function(i){
		$(this).find('a').click(function(){
			$('.sideBar').find('.liI').find('a').removeClass('on');
			$(this).addClass('on');
			$('body,html').stop(true,true).animate({scrollTop: $('.pageSection').eq(i).offset().top-100}, 500);
			})
		})
	//
	//
	//
	$('.sNavD').find('a').hover(function(){
		$(this).find('.img2').show();
		$(this).find('.img1').hide();
	},function(){
		$(this).find('.img2').hide();
		$(this).find('.img1').show();
	})

	$('.listHover').find('.list_show10').hover(function(){
		$(this).find('.layer').show();
		$(this).find('.name').hide();
	},function(){
		$(this).find('.layer').hide();
		$(this).find('.name').show();
	})
	// $('.listHover').find('.li_01').hover(function(){
	// 	$('.listHover').find('.li_01').show();
	// 	$(this).hide();
	// },function(){
	// 	$('.listHover').find('.li_01').hide();
	// 	$(this).show();
	// })
	$('#pageTag').find('a').each(function(i){
		$(this).click(function(){
			$('#pageTag').find('a').removeClass('on');
			$(this).addClass('on');
			$('body,html').stop(true,true).animate({scrollTop: $('.pageTag').eq(i).offset().top-100}, 500);
			})
		})
	if($('#pageTag').length>0){
		$(window).scroll(function(){
			$('.pageTag').each(function(i){
				if($(window).scrollTop()>$(this).offset().top-$(window).height()/2){
					$('#pageTag').find('a').removeClass('on');
					$('#pageTag').find('a').eq(i).addClass('on');
					}
				})
			})
		}
		$('.pSelect').each(function(){
		var _this=$(this);
		var _thisHtml='<dl>';
		_this.find('option').each(function(i){
			_thisHtml=_thisHtml+'<dd>'+$(this).val()+'</dd>';
			})
		_thisHtml=_thisHtml+'</dl>';
		_this.find('.layer').html(_thisHtml);
		_this.find('dd').each(function(i){
			$(this).click(function(){
				_this.find('dd').removeClass('on');
				$(this).addClass('on');
				_this.find('span').html($(this).html());
				_this.find('option').attr("selected",false);
				_this.find('option').eq(i).attr("selected",true);
				})
			})
		})

	})