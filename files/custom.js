jQuery(document).ready(function(e) {

    $ = jQuery;


    /*返回顶部*/
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover()
    });

    /*城市下拉选择*/
    $(".city-select").on('click', function(evt){
        evt.stopPropagation();
        var input = $(this).find('.str'),
            dropObj = $(this).find('.city-menu'),
            _this = $(this),
            closeBtn = dropObj.find(".closebtn");
        $(this).addClass("current");

        closeBtn.on('click', function(evt){
            evt.stopPropagation();
            _this.removeClass("current");
        });

    });
    $("body").on('click', function(){
        $(".city-select").removeClass("current");
    });


    $("body").on('click', function(){
        $(".city-select").removeClass("current");
    });


    $(".map li a") .click(function(evt){
        $provice = $(this).attr('provice'),
            $name  = $(this).attr('name'),
            //alert($provice);
            $(".provice").val($provice);
        $(".name").val($name);
        $('.citySelect p').html($name);
        evt.stopPropagation();
        $(".city-select").removeClass("current");
    })



    $('#btn-search').click(function () {
        var  provice = $(".provice").val();
        var  key     = $("#areaInput").val();
        var  name    = $(".name").val();
        if($.trim(provice)==""){
            errmsg('请选择省份');
            return false;
        }else if($.trim(key)==""){
            errmsg('请输入企业名称或注册号！');
            return false;
        }else if($.trim(key).length<2){
            errmsg('企业名称至少2个关键字');
            return false;
        }else{
            window.location.href=encodeURI(INDEX_URL+"search?provice="+provice+"&key="+key+"&name="+name);
        }
    });




    /*	个人中心 */
    $(function(){
        var avatar_timer=null;
        $('.nav-user').hover(
            function(event){

                clearTimeout(avatar_timer);

                $('.profile-box').show();

            },function(){
                avatar_timer = setTimeout(function(){
                    $('.profile-box').hide();
                },500);
            });
    });

    /*	应用中心 */
    $(function(){
        var avatar_timer=null;
        $('.nav-app').hover(
            function(event){

                clearTimeout(avatar_timer);

                $('.app-box').show();

            },function(){
                avatar_timer = setTimeout(function(){
                    $('.app-box').hide();
                },500);
            });
    });


    /*微信登录*/
    $(function(){
        var avatar_timer=null;
        $('.cc_btn-weixin').hover(
            function(event){

                clearTimeout(avatar_timer);

                $('.share-dropdown').show();

            },function(){
                avatar_timer = setTimeout(function(){
                    $('.share-dropdown').hide();
                },500);
            });
    });

    //重新认证邮箱
    $(".email2").click(function(){
        //alert($(this).attr('companykey'));
        $.post(INDEX_URL+'/user_changeEmailAction2',function(rs){
            if(rs.success){
                sucdia({content:"重新发送邮件成功，请尽快认证您的邮箱"});
            }else{
                faldia({
                    content: rs.msg,
                });
            }
        },'json');
    });

    $('.btn-guest').click(function () {
        var content = $("#feedModal .content").val();
        var  email     = $(".email").val();
        if($.trim(content)==""){
            $(".contentmsg").text('请输入内容！');
            return false;
        }else if($.trim(email)==""){
            $(".emailmsg").text('请输入邮箱');
            return false;
        }else if(!$(".email").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
            $(".emailmsg").text('邮箱格式不正确');
            return false;
        }else{
            $.ajax({
                type: 'POST',
                url:INDEX_URL+'/guestbook_addAction',
                data:'content='+content+'&email='+email,
                success: function(result){
                    var delay;
                    delay = function(ms, func) {
                        return setTimeout(func, ms);
                    };
                    toastr.options = {
                        positionClass: 'toast-bottom-left'
                    };
                    delay(100, function() {
                        if(result.success){
                            zhugeTrack('提交反馈');
                            return toastr.success('恭喜你，反馈成功！');
                        }else{
                            return toastr.success(result.msg);
                        }

                    });
                    setTimeout(location.reload(),2000);
                }
            });
        }
    });


    //操作错误对话框
    errmsg = function(content){
        var delay;
        delay = function(ms, func) {
            return setTimeout(func, ms);
        };
        toastr.options = {
            positionClass: 'toast-bottom-left'
        };
        delay(10, function() {
            return toastr.error(content);
        });
    }



    //操作失败对话框
    errmsg2  = function(content){
        var provice    =  $("#provice").val();
        var unique     =  $("#unique").val();
        fn = function() {
            location.href = INDEX_URL+"/user_login?back="+INDEX_URL+"/firm_"+provice+"_"+unique;
        };
        var options = {};
        if(typeof(content) == 'string'){
            options.content = content;
            options.fn = fn || function(){};
        }else{
            options = content;
        }
        options.content 	= options.content || '保存失败！';
        options.time		= options.time 	|| 2;
        options.fn			= options.fn 		|| function(){};
        var delay;
        delay = function(ms, func) {
            return setTimeout(func, ms);
        };
        toastr.options = {
            positionClass: 'toast-bottom-left'
        };
        delay(10, function() {
            return toastr.error(options.content);
        });
        setTimeout(options.fn,2000);
    }


    eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$(5(){$(".1").4();$("#i").v(5(){$(".1").4();0 e=$(".9").8();0 f=$("#i").8();0 g=$.k(e+f);3($.j(e)==""){6 7}2 3($.j(f)==""){$(".1").4();6 7}2{$.w({x:\'A\',D:l+\'/m\',n:\'9=\'+e+\'&o=\'+f+\'&p=\'+g,q:5(a){3(a=="s"){$(".t-u").h("网络状态异常");6 7}2{0 b="";0 c=y.z(a);0 d=c.B;3(d){$(".1").C();0 b=r(e,d);$(".1").h(b)}2{$(".1").4()}}}})}})});',40,40,'var|list|else|if|hide|function|return|false|val|provice||||||||html|areaInput|trim|md5|INDEX_URL|gongsi_getList|data|key|token|success|dealInfoToHTML|null|result|msg|keyup|ajax|type|JSON|parse|POST|Result|show|url'.split('|'),0,{}))


    $(function() {
        $("#search-list").hide();
        $("#header-search-list").hide();

        document.onclick=function(e){
            var e=e?e:window.event;
            var tar = e.srcElement||e.target;
            if(tar.id!="searchkey"&&tar.id!="headerKey"){
                $("#search-list").hide();
                $("#header-search-list").hide();
            }
        }
    });

    var mTimeout;
    //搜索
    function searchList(type){
        if(type==1||type==3){
            //加这个是为了防刷，输入完0.5秒后再去请求服务器
            if(mTimeout){
                clearTimeout(mTimeout);
            }
            var flag = type;
            mTimeout = setTimeout(function(){
                if(flag == 1){

                    var list = $("#search-list");
                    var key = $("#searchkey");
                }else{
                    var list = $("#header-search-list");
                    var key = $("#headerKey");
                }
                list.hide();
                var f = key.val();
                if(f.length<2) return;
                var type = $("#index").val();
                if ($.trim(f) == "") {
                    return false
                } else {

                    $.ajax({
                        type: 'POST',
                        url: INDEX_URL + '/gongsi_getList',
                        data: 'key=' + f + "&type="+type,
                        success: function(a) {
                            if (a == "null") {
                                //$(".result-msg").html("网络状态异常");
                                return false
                            } else {
                                var b = "";
                                var c = "";
                                try{
                                    c = JSON.parse(a);
                                }catch(e){
                                    //console.info(e);
                                }

                                var d = c;
                                if (d) {
                                    list.show();
                                    var b = dealInfoToHTML(e, d);
                                    list.html(b)

                                } else {
                                    list.hide()
                                }
                            }
                        }
                    })
                }
            },350);

        }else if(type==2||type==4||type==12||type==13){
            var list;
            var viewType = 1;
            if(type==12){
                var list = $("#search-list");
                viewType = 2;
            }else if(type==13){
                var list = $("#header-search-list");
                viewType = 2;
            }else if(type==2){
                var list = $("#search-list");
            }else{
                var list = $("#header-search-list");
            }
            $.ajax({
                type: 'POST',
                url: INDEX_URL + '/gongsi_getSearchWord',
                data: {viewType:viewType},
                success: function(a) {
                    if(a && (a.view||a.search)){
                        var b = dealHistoryToHTML(a.view, a.search,viewType);
                        list.html(b);
                        if(type==12||type==13){
                            list.find('div.list-group-item').hide();
                        }
                        list.show();

                    }
                }
            })
        }

    }



    /** 搜索结果html**/
    function dealInfoToHTML(provice,companys){
        var html='';
        html=html+"<div class='list-group no-radius alt'>";
        for(var i=0;i<companys.length;i++){
            if(companys[i].Name){
                html=html+"<a class='list-group-item' href='"+INDEX_URL_A+"/firm_"+companys[i].KeyNo+".shtml'><span class='badge bg-primary'>"+companys[i].Reason+"</span>"+companys[i].Name+"</a>";
            }else{
                html=html+"<a class='list-group-item' href='"+INDEX_URL_A+"/firm_"+companys[i].KeyNo+".shtml'>"+companys[i].OperName+"</a>";
            }
        }
        html=html+"</div>";
        return html;
    }

    /** 搜索结果html**/
    function dealHistoryToHTML(coms,keys,viewType){
        var html='';
        html=html+"<div class='list-group no-radius alt'>";
        /*if(keys && keys.length>0){
            html=html+'<div class="list-group-item" ><a class="text-info" href="javascript:;">搜索记录</a></div>';
            // if(keys.length>3){
            // 	keys = keys.splice(0,3);
            // }
            for(var i=0;i<keys.length;i++){
                 html=html+'<a class="list-group-item" href="/search?key='+keys[i].key+'">'+keys[i].key+'</a>';
            }
        }*/
        if(coms && coms.length>0){
            html=html+'<div class="list-group-item" ><a class="text-info" href="javascript:;">浏览记录</a><a class="text-click2 del-cache" style="float: right" href="javascript:;">清除全部</a></div>';
            // if(coms.length>3){
            // 	coms = coms.splice(0,3);
            // }
            for(var i=0;i<coms.length;i++){
                html=html+'<a class="list-group-item" href="'+INDEX_URL_A+'/firm_'+coms[i].key+'.shtml">'+coms[i].name+'</a>';
            }
            html=html+'<div class="list-group-item" ><a class="text-click" href="'+INDEX_URL_A+'/user_visit">更多历史记录</a></div>';
        }

        $('body').on('click', '.del-cache' ,function () {
            $.ajax({
                type: 'get',
                url: INDEX_URL + '/gongsi_delCache',
                data: {viewType:viewType}
            })
        });

        html=html+"</div>";
        return html;
    }

});




//回复评论
function reply(e,u){
    box  = document.getElementById('comm');
    to   = document.getElementById('to');
    to.value = u;
    //alert(u);
    oc = box.value;
    prefix = '@' + e + ' ';
    nc = oc + prefix;
    box.focus();
    box.value = nc;
}


$(function(){
    /**首页点击搜索**/


    $('.search-type').click(function () {
        $(".newlist").hide();
        $('.search-type').removeClass("active");
        $(this).addClass("active");
        //alert();
        var index = $(this).index();
        $("#index").val(index);
        if(index==2){
            $('#searchkey').attr('placeholder','请输入企业名称、注册号或统一社会信用代码，如“小米科技”')
        }else if(index==4){
            $('#searchkey').attr('placeholder','请输入法人名称或股东名称，如“马云”')
        }else if(index==6){
            $('#searchkey').attr('placeholder','请输入高管名称，如“李嘉诚”')
        }else if(index==8){
            $('#searchkey').attr('placeholder','请输入品牌或产品的关键字，如“企查查”')
        }else if(index==10){
            $('#searchkey').attr('placeholder','请输入企业注册地址、联系电话、邮箱或网址，如“苏州工业园区”')
        }else if(index==12){
            $('#searchkey').attr('placeholder','请输入企业经营范围，如“软件”')
        }else{
            $('#searchkey').attr('placeholder','请输入企业名称、人名，产品名等，多个关键词用空格隔开，如“小米 雷军”')
        }
    });


    $('#new-search').click(function () {
        var  key     = $("#newInput").val();
        var  type    = $("#sType").val();
        var msg = $('#newInput').attr('placeholder');
        if($.trim(key)==""){
            errmsg(msg);
            return false;
        }else if($.trim(key).length<2){
            errmsg('至少2个关键字');
            return false;
        }else{
            if(type==0){
                window.location.href=encodeURI(INDEX_URL+"search?"+"key="+key+"&index=name");
            }else if(type==1){
                window.location.href=encodeURI(INDEX_URL+"search?"+"key="+key+"&index=opername");
            }else if(type==2){
                window.location.href=encodeURI(INDEX_URL+"search?"+"key="+key+"&index=address");
            }else if(type==3){
                window.location.href=encodeURI(INDEX_URL+"search?"+"key="+key+"&index=scope");
            }else if(type==4){
                window.location.href=encodeURI(INDEX_URL+"search?"+"key="+key+"&index=featurelist");
            }
        }
    });

    $('#relation-nv a').click(function () {
        $(".newlist").hide();
        var  key     = $("#newInput").val();
        var  type    = $("#sType").val();
        //$(this).addClass("on");
        if(type==1){
            $('#newInput').attr('placeholder','请输入准确的身份证号码')
        }else{
            $('#newInput').attr('placeholder','请输入完整的企业名称')
        }
    });


    $('#relation-search').click(function () {
        var  key     = $("#newInput").val();
        var  type    = $("#sType").val();
        var msg = $('#newInput').attr('placeholder');
        if($.trim(key)==""){
            errmsg(msg);
            return false;
        }else if($.trim(key).length<2){
            errmsg('至少2个关键字');
            return false;
        }else{
            if(type==0){
                window.location.href=encodeURI(INDEX_URL+"relation_search?"+"key="+key);
            }else if(type==1){
                window.location.href=encodeURI(INDEX_URL+"relation_buy?"+"key="+key);
            }
        }
    });

    //快报资讯
    $('#panel-news').hover(
        function(){
            $(this).css("overflow","auto");
        },function(){
            $(this).css("overflow","hidden");
        });

    $('.item-inner').click(function () {
        // alert(123);
        if($(this).children(".item-info").is(':hidden')){
            //alert(123);
            $(".item-info").hide();
            $(this).children(".item-info").show();
        }else{
            $(this).children(".item-info").hide();
        }
    });

})


function selectType(typeIndex) {
    var container = document.getElementById("search-nv");
    var links = container.getElementsByTagName("a");
    if (!links) {
        return
    }
    document.getElementById("sType").value = typeIndex;
    for (i = 0; i < links.length; i++) {
        if (i == typeIndex) {
            links[i].className = "search-type  on"
        } else {
            links[i].className = "search-type "
        }
    }
}


$(function(){
    var btn_timer=null;
    $('.dropdown-submenu').hover(
        function(event){
            clearTimeout(btn_timer);
            $("#hangye .dropdown-menu").hide();
            $(this).children(".dropdown-menu").show();
        },function(){
            btn_timer = setTimeout(function(){
                $(".btn-group .dropdown-menu").hide();
            },500);
        });
});


//阻止冒泡的方法
function stopPP(e){
    var evt = e || window.event;
    //IE用cancelBubble=true来阻止而FF下需要用stopPropagation方法
    evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble=true);
}


//设置cookie  
function setCookie(name,value){
    var exp = new Date();
    exp.setTime(exp.getTime() + 1*60*60*1000);//有效期1小时
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//取cookies函数  
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}

function showDetail(keyNo,tupuUrl,type){
    $(".company-detail").hide();

    if(type && type == 'person'){
        // 已迁移
    } else {
        var url = INDEX_URL+"more_findRelationsDetail";
        $.ajax({
            url: url,
            type: 'GET',
            data: {"keyNo": keyNo},
            dataType: 'JSON',
            success: function (data) {
                if(data.Status!=200){
                    return;
                }
                var companyDetail = $('#company-detail');
                companyDetail.find('.mao-img').attr("src",data.Result.ImageUrl);
                companyDetail.find('.mao-company-name').text(data.Result.Name);
                if(data.Result.ShortStatus){
                    companyDetail.find('.mao-company-status').text(data.Result.ShortStatus||'-');
                    companyDetail.find('.mao-company-status').show();
                }else{
                    companyDetail.find('.mao-company-status').hide();
                }
                
                if(data.Result.Oper&&data.Result.Oper.Name){
                    if(data.Result.Oper.KeyNo){
                        if(data.Result.Oper.KeyNo[0]=='p'){
                            companyDetail.find('.mao-oper').html('<a target="_blank" href="/pl_'+data.Result.Oper.KeyNo+'.html">'+data.Result.Oper.Name+'</a>');
                        }else{
                            companyDetail.find('.mao-oper').html('<a target="_blank" href="/firm_'+data.Result.Oper.KeyNo+'.shtml">'+data.Result.Oper.Name+'</a>');
                        }
                    }else{
                        companyDetail.find('.mao-oper').html('<a target="_blank" href="/people?name='+encodeURI(data.Result.Oper.Name)+'&keyno='+keyNo+'">'+data.Result.Oper.Name+'</a>');
                    }
                    if(data.Result.Oper.OperType==1){
                        companyDetail.find('.mao-oper').prev().text('法定代表人：');
                    }else if(data.Result.Oper.OperType==2){
                        companyDetail.find('.mao-oper').prev().text('执行事务合伙人：');
                    }else if(data.Result.Oper.OperType==3){
                        companyDetail.find('.mao-oper').prev().text('负责人：');
                    }else if(data.Result.Oper.OperType==4){
                        companyDetail.find('.mao-oper').prev().text('经营者：');
                    }else if(data.Result.Oper.OperType==5){
                        companyDetail.find('.mao-oper').prev().text('投资人：');
                    }else if(data.Result.Oper.OperType==6){
                        companyDetail.find('.mao-oper').prev().text('董事长：');
                    }else if(data.Result.Oper.OperType==7){
                        companyDetail.find('.mao-oper').prev().text('理事长：');
                    }
                }else{
                    companyDetail.find('.mao-oper').text('-');
                }

                companyDetail.find('.mao-ziben').text(data.Result.RegistCapi || '-');
                companyDetail.find('.mao-date').text((data.Result.StartDate || ''));
                companyDetail.find('.mao-company-name').attr("href","firm_"+keyNo+".shtml");
                if(!tupuUrl){
                    tupuUrl = 'company_relation';
                }
                companyDetail.find('.mao-tupu-link').attr("href",tupuUrl+"?keyNo="+keyNo+"&name="+encodeURIComponent(data.Result.Name));
                //companyDetail.find('.mao-tupu-link').attr("onclick","zhugeTrack(\'图谱页面-侧边栏企业信息-查看图谱\')");
                companyDetail.find('.close').click(function(){
                    companyDetail.fadeOut();
                });

                var noData = '<div class="mao-noresult"> <p ><img src="/material/theme/chacha/cms/v2/images/nodata.png"></p>暂无信息</div>';

                //股东
                if(data.Result.Partners && data.Result.Partners.length>0){
                    var html = '<table class="table table-bordered mao-table">';
                    html += "<thead><tr><th>名称</th><th>类型</th></tr></thead>";
                    for(var i=0; i<data.Result.Partners.length; i++){
                        html += "<tr>";
                        if(data.Result.Partners[i].KeyNo){
                            if(data.Result.Partners[i].KeyNo[0]=='p'){
                                html += '<td><a onclick="" target="_blank" href="/pl_'+data.Result.Partners[i].KeyNo+'.html">'+data.Result.Partners[i].StockName+'</a></td>';
                            }else{
                                html += '<td><a onclick="" target="_blank" href="/firm_'+data.Result.Partners[i].KeyNo+'.shtml">'+data.Result.Partners[i].StockName+'</a></td>';
                            }
                        }else{
                            if(data.Result.Partners[i].StockName.length>3){
                                html += "<td>"+data.Result.Partners[i].StockName+"</td>";
                            }else{
                                html += '<td><a onclick="" target="_blank" href="/people?name='+encodeURI(data.Result.Partners[i].StockName)+'&keyno='+keyNo+'">'+data.Result.Partners[i].StockName+'</a></td>';
                            }
                        }
                        html += "<td>"+(data.Result.Partners[i].StockType || "-")+"</td>";
                        html += "</tr>";
                    }
                    html+='</table>'

                    companyDetail.find('.gudong-list').html(html);


                }else {
                    companyDetail.find('.gudong-list').html(noData);
                }

                //投资
                if(data.Result.touziList && data.Result.touziList.length>0){

                    var html = '<table class="table table-bordered mao-table">';
                    html += "<thead><tr><th>名称</th></tr></thead>";
                    for(var i=0; i<data.Result.touziList.length; i++){
                        html += "<tr>";
                        html += "<td><a onclick='' href='/firm_"+data.Result.touziList[i].KeyNo+".shtml' target='_blank'>"+data.Result.touziList[i].Name+"</a></td>";
                        html += "</tr>";
                    }
                    html+='</table>';
                    companyDetail.find('.touzi-list').html(html);
                }else {
                    companyDetail.find('.touzi-list').html(noData);
                }

                //成员
                if(data.Result.Employees && data.Result.Employees.length>0){
                    var html = '<table class="table table-bordered mao-table">';
                    html += "<thead><tr><th>名称</th><th>类型</th></tr></thead>";
                    for(var i=0; i<data.Result.Employees.length; i++){
                        html += "<tr>";
                        if(data.Result.Employees[i].KeyNo && data.Result.Employees[i].KeyNo[0]=='p'){
                            html += '<td><a onclick="" target="_blank" href="/pl_'+data.Result.Employees[i].KeyNo+'.html">'+data.Result.Employees[i].Name+'</a></td>';
                        }else{
                            html += '<td><a onclick="" target="_blank" href="/people?name='+encodeURI(data.Result.Employees[i].Name)+'&keyno='+keyNo+'">'+data.Result.Employees[i].Name+'</a></td>';
                        }
                        html += "<td>"+(data.Result.Employees[i].Job||"-")+"</td>";
                        html += "</tr>";
                    }
                    html+='</table>';
                    companyDetail.find('.member-list').html(html);

                }else {
                    companyDetail.find('.member-list').html(noData);
                }

                $("#company-detail").fadeIn();
                companyDetail.find('.mao-tab-content').slimScroll({
                    wheelStep: 1
                });
            },
            error:function(data){
                console.log(data);
            }
        });
    }
}

function launchFullScreen(element) {
    console.log(element.requestFullscreen)
    if(element.requestFullscreen) {
        element.requestFullscreen();
    }else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
function exitFullScreen(){
    if(document.exitFullscreen){
        document.exitFullscreen();
    }
    else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
    }
    else if(document.msExitFullscreen){
        document.msExitFullscreen();
    }
    else if(document.webkitCancelFullScreen){
        document.webkitCancelFullScreen();
    }
}

function isFullScreen(){
    if(document.fullscreen){
        return true;
    }else if(document.mozFullScreen){
        return true;
    }else if(document.webkitIsFullScreen){
        return true;
    }else if(document.msFullscreenElement){
        return true;
    }else{
        return false;
    }
}

function setFullScreenListener(fullScreenChange){
    document.addEventListener('fullscreenchange', function(){ fullScreenChange() });
    document.addEventListener('webkitfullscreenchange', function(){ fullScreenChange()});
    document.addEventListener('mozfullscreenchange', function(){ fullScreenChange()});
    document.addEventListener('MSFullscreenChange', function(){ fullScreenChange()});
}

function animatieChart(myChart,targetX,targetY){
    targetX = targetX||0;
    targetY = targetY||0;
    var centerX = myChart.getZrender().getWidth()/2;
    var centerY = myChart.getZrender().getHeight()/2;
    var layer = myChart.getZrender().painter._layers[1];
    var animation = myChart.getZrender().animation;
    layer.scale = [0.2,0.2,centerX,centerY];
    layer.rotation = [0,centerX,centerY];
    layer.position = [targetX,targetY];
    myChart.getZrender().render();
    animation.animate(layer).when(400, {
        scale: [1,1,centerX,centerY]
    }).start('spline').done(function(){
        layer.scale[2] = 0;
        layer.scale[3] = 0;
    }).during(function(){
        myChart.getZrender().render();
    });
}


// 获取url中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

//截图
function jietuChart(myChart){
    var type = 'png';
    var imgdata = myChart.getConnectedDataURL(type);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    var fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
    //将图片保存到本地
    var saveFile = function (data, filename) {
        var link = document.createElement('a');
        link.href = data;
        link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
    var filename = new Date().toLocaleDateString() + '.' + type;
    saveFile(imgdata, filename);
}

function download(canvas,type) {
    if(!!window.ActiveXObject || "ActiveXObject" in window){
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, new Date().toLocaleDateString() + '.png');
        return;
    }
    type = 'png';
    //设置保存图片的类型
    var imgdata = canvas.toDataURL(type);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    var fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
    //将图片保存到本地
    var saveFile = function (data, filename) {
        var link = document.createElement('a');
        link.href = data;
        link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
    var filename = new Date().toLocaleDateString() + '.' + type;
    saveFile(imgdata, filename);
}


var ICON={
    ICON_OPEN:'data:image/png;base64,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',
    ICON_CLOSE:'data:image/png;base64,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'

}

