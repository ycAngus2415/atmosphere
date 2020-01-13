//--
var numUp=new Array();
var numUpTime=new Array();
var dataNum_0=0;
var dataNum_1=0;
var dataNum_2=0;
var dataNum_3=0;
function transport_02Fun(){
	for(i=0;i<4;i++){
	  numUp[i]=0;
	  numUpTime[i]=0;
	}
	clearInterval(numUpTime[0]);
	clearInterval(numUpTime[1]);
	clearInterval(numUpTime[2]);
	clearInterval(numUpTime[3]);
	dataNum_0=Number($('#num1').attr('dataNum'));
	dataNum_1=Number($('#num2').attr('dataNum'));
	dataNum_2=Number($('#num3').attr('dataNum'));
	dataNum_3=Number($('#num4').attr('dataNum'));
	numUpTime[0] = setInterval("numUpfun1()",200);
	numUpTime[1] = setInterval("numUpfun2()",200);
	numUpTime[2] = setInterval("numUpfun3()",200);
	numUpTime[3] = setInterval("numUpfun4()",200);
	}
function numUpfun1(){
	numUp[0]=numUp[0]+Math.ceil(dataNum_0/10);
	$('#num1').html(numUp[0]);
	if(numUp[0]>=dataNum_0){
		$('#num1').html(dataNum_0);
		clearInterval(numUpTime[0]);
		}
	}
function numUpfun2(){
	numUp[1]=numUp[1]+Math.ceil(dataNum_1/10);
	$('#num2').html(numUp[1]);
	if(numUp[1]>=dataNum_1){
		$('#num2').html(dataNum_1);
		clearInterval(numUpTime[1]);
		}
	}
function numUpfun3(){
	numUp[2]=numUp[2]+Math.ceil(dataNum_2/10);
	$('#num3').html(numUp[2]);
	if(numUp[2]>=dataNum_2){
		$('#num3').html(dataNum_2);
		clearInterval(numUpTime[2]);
		}
	}
function numUpfun4(){
	numUp[3]=numUp[3]+Math.ceil(dataNum_3/10);
	$('#num4').html(numUp[3]);
	if(numUp[3]>=dataNum_3){
		$('#num4').html(dataNum_3);
		clearInterval(numUpTime[3]);
		}
	}