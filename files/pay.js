
function getWxPayStatus(){
    if (wxOrderStatus == 0 && wxOrderCode != '' && isModalShow) {
        $.ajax({
            url: INDEX_URL+'/order_payStatus',
            type: "GET",
            dataType:"json",
            data: {'id':wxOrderCode},
            success: function (result) {
                if (result.success) {
                    wxOrderStatus = 1;
                    window.top.location.href = INDEX_URL+'user_vip';
                }
            },
            error: function () {
                console.log("请求订单状态出错");
            }
        });
    }
}

function changeYear(goods_id,year,price,dom){
    clearPay();
    $(dom).siblings().removeClass('active');
    $(dom).addClass('active');
    cGoods_id = goods_id;
    cYear = year;
    cPrice = price;
    $('#vipModal #payYear').text('¥' + cPrice + '.00');
    $("#vipModal input[name='goods_id']").val(cGoods_id);
    getcouponlist(cGoods_id);
    window.zhuge.track(cYear + '年VIP会员');
}

function checkPay(payType){
    if(isPayShow){
        $('#vipModal .pay-type-wx').removeClass('active');
        $('#vipModal .pay-type-ali').removeClass('active');
        cPayType = payType;
        $("#vipModal input[name='pay_type']").val(cPayType);
        if(cPayType==1){
            $('#vipModal .pay-type-ali').addClass('active');
            aliPayAction();
        }else{
            $('#vipModal .pay-type-wx').addClass('active');
            wxPayAction();
        }
    }
}


function checkCoupon(dPrice,name,code){
    clearPay();
    if($('#vipModal #coupon_'+code).hasClass('active')){
    	$('#vipModal #coupon_'+code).removeClass('active');
    	$('#vipModal #couponText').text('不使用优惠券');
    	$('#vipModal #payYear').text('¥' + (cPrice) + '.00');
    	$("#vipModal input[name='coupon_code']").val('');
    }else{
    	$('#vipModal .coupon-item').removeClass('active');
    	$('#vipModal #coupon_'+code).addClass('active');
	    $('#vipModal #couponText').text(name+' - ¥'+dPrice+'');
	    if(cPrice-dPrice<0){
	        $('#vipModal #payYear').text('¥0.10');
	    }else{
	        $('#vipModal #payYear').text('¥' + (cPrice-dPrice) + '.00');
	    }
	    $("#vipModal input[name='coupon_code']").val(code);
    }

    if(isModalShow){
        checkPay(cPayType);
    }
}

function wxPayAction(){
    if(!wxpayLoad){
        $('#vipModal .wx_pay_box .pay-load').show();
        $.ajax({
            type:'post',
            url:INDEX_URL + 'order_pay',
            data:$('#pay-form').serialize(),
            success:function(res){
                if(res.success){
                    $('#vipModal #wx_pay_img').empty();
                    wxOrderCode = res.orderCode;
                    var qrcode = new QRCode('wx_pay_img', {
                        text: res.codeUrl,
                        width: 160,
                        height: 160,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                    wxpayLoad = true;
                }
                $('#vipModal .wx_pay_box .pay-load').hide();
            }
        });
        
    }
    $('#vipModal .ali_pay_box').hide();
    $('#vipModal .wx_pay_box').show();
}

function aliPayAction(){
    if(!alipayLoad){
        $('.ali_pay_box').empty();
        $('.ali_pay_box').append('<img class="pay-load" src="./preloader.gif">');

        $('#vipModal .ali_pay_box').append('<iframe width="160px" height="160px" id="ali_pay_frame" class="ali_pay_frame" src="about:blank" name="aliPayFrame" scrolling="no" frameborder="no"></iframe>');
        $('#vipModal .packages-btn').click();
        $('#vipModal .ali_pay_box .pay-load').show();
        // $("#vipModal #ali_pay_frame").load(function(e){
        $("#ali_pay_frame").load(function(e){
            $('#vipModal .ali_pay_box .pay-load').hide();
            if(alipayLoad){
                window.top.location.href = INDEX_URL+'user_vip';
            }
            alipayLoad = true;
        });
    }
    $('#vipModal .ali_pay_box').show();
    $('#vipModal .wx_pay_box').hide();
}



function clearPay(){
    wxpayLoad = false;
    alipayLoad = false;
    $('#vipModal #wx_pay_img').empty();
    $('#vipModal .ali_pay_box').hide();
    $('#vipModal .wx_pay_box').hide();
    $('#vipModal #ali_pay_frame').remove();
    wxOrderCode = '';
    $('#vipModal #couponText').text('暂无优惠券');
}

function getcouponlist(goods_id){
    $.ajax({
        url:INDEX_URL+'vip_getcouponlist',
        data:{
            goods_id:goods_id,
        },
        dataType:'html',
        success:function(html){
            if($.trim(html)!=''){

                $('#vipModal #couponList').html(html);
                $('#vipModal #couponList').parents(".coupon-drop").show();
                if(!$(html).hasClass("checkCouponRun")){
                    checkPay(cPayType);
                }
            } else {
                checkPay(cPayType);
                $('#vipModal #couponList').parents(".coupon-drop").hide();
                //$('#couponList').parent().parent().parent().hide();
            }
        }
    })
}
