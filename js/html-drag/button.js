
//==============================================================
// Button click functions
//==============================================================
$(document).ready( function(){
    //initail autoHidingNavbar
    $(".navbar-fixed-top").autoHidingNavbar();

    //initial Clipboard
    CLIPBOARD = new Clipboard( document.getElementById('clipboard') );
    CLIPBOARD.on('success', function(e) {
        alert("\n\n此次模擬結果網址：\n\n"+$("#clipboard").attr("data-clipboard-text")+"\n\n此網址已複製到剪貼簿。\n\n");
    });
    CLIPBOARD.on('error', function(e) {
        alert("製造網址時產生錯誤，敬請見諒。\n\n建議使用Chrome進行作業。");
    });

    //initial Scrollbar
    $("#Scrollbar").mCustomScrollbar({
        axis:"y",
        theme:"minimal-dark"
    });
    var amount=Math.max.apply(Math,$("#HorizontalScrollbar li").map(function(){return $(this).outerWidth(true);}).get());
    $("#HorizontalScrollbar").mCustomScrollbar({
        axis:"x",
        theme:"minimal-dark",
        advanced:{
            autoExpandHorizontalScroll:true
        },
        snapAmount: amount,
    });

    //load history if exist
    if( $.url("?record") ){
        parseUploadJson( LZString.decompressFromEncodedURIComponent( $.url("?record") ) );
    }else{
        newRandomPlain();
    }

    MAIN_STATE = "count";
    closeCanvas();
    resetTimeDiv();
    setComboShow();
    setHistoryShow();
});

function newRandomPlain(){
    resetColors();
    initialTable();
    initialColor();

    autoCheckDropGroups();

    if( $("#optionalPanel").text() == "版面製作中" ){
        $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    }else{
        nextMoveWave();
    }
}
function newOptionalPlain(){
    $("#optionalPanel").text("版面製作中");
    $("#optionalPanel").closest("button").attr("onclick","endOptionalPlain()");
    $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    MAIN_STATE = "create";
    AUTO_REMOVE = false;
    resetMoveTime();
    stopDragging();
}
function endOptionalPlain(){
    $("#optionalPanel").text("開始自選版面");
    $("#optionalPanel").closest("button").attr("onclick","newOptionalPlain()");
    $("#dragContainment tr td").unbind("mousedown");
    $("#panelControl button").css('background','');
    CREATE_COLOR = null;
    returnMainState();
    returnAutoRemove();
    nextMoveWave();

}
function setColor(color, n){
    CREATE_COLOR = color;
    $("#mouseImg").remove();
    $("#panelControl button").css('background','');
    $("#panelControl button").eq(n).css('background','lightgray');
}
function setElementByOption(e){
    if( CREATE_COLOR != null ){
        $(e).find("img").remove()
        $(e).append( newElementByItem(CREATE_COLOR) );
    }
}

function toggleFreeDrag(){
    if( $("#freeDrag").text() == "自由移動" ){
        $("#freeDrag").text("一般移動");
        MAIN_STATE = "count";
    }else{
        $("#freeDrag").text("自由移動");
        MAIN_STATE = "freeDrag";
    }
}
function returnMainState(){
    if( $("#freeDrag").text() == "自由移動" ){
        MAIN_STATE = "freeDrag";
    }else{
        MAIN_STATE = "count";
    }
}
function toggleTimeLimit(){
    if( $("#timeLimit").text() == "限制時間" ){
        $("#timeLimit").text("無限時間");
        $("#timeRange").hide();
        TIME_IS_LIMIT = false;
    }else{
        $("#timeLimit").text("限制時間");
        $("#timeRange").show();
        TIME_IS_LIMIT = true;
        TIME_LIMIT = 5;
    }
}
function toggleAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        $("#autoRemove").text("保持待機");
        AUTO_REMOVE = false;
    }else{
        $("#autoRemove").text("自動消除");
        AUTO_REMOVE = true;
        checkGroups();
    }
}
function returnAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        AUTO_REMOVE = true;
    }else{
        AUTO_REMOVE = false;
    }
}
function toggleDropable(){
    if( $("#dropable").text() == "取消落珠" ){
        $("#dropable").text("隨機落珠");
        DROPABLE = true;
        resetColors();
    }else{
        $("#dropable").text("取消落珠");
        DROPABLE = false;
    }
}
function toggleAudio(){
    if( $("#playAudio").text() == "播放音效" ){
        $("#playAudio").text("關閉音效");
        AUDIO = false;
    }else{
        $("#playAudio").text("播放音效");
        AUDIO = true;
    }
}

function initialPlain(){
    backInitColor();
    nextMoveWave();
}
function finalPlain(){
    backFinalColor();
    nextMoveWave();
}
function replay(){
    $("#randomPanel").closest("button").prop("disabled", true);
    $("#optionalPanel").closest("button").prop("disabled", true);
    $("#initial").closest("button").prop("disabled", true);
    $("#final").closest("button").prop("disabled", true);
    $("#replay").closest("button").prop("disabled", true);

    MAIN_STATE = "review";
    AUTO_REMOVE = false;
    COLOR_RANDOM = HISTORY_RANDOM;
    loadSkillVariable(HISTORY_SKILL_VARIABLE);
    backInitColor();
    resetComboStack();
    replayHistory();
}
function endReplayHistory(){
    returnMainState();
    returnAutoRemove();
    $("#randomPanel").closest("button").prop("disabled", false);
    $("#optionalPanel").closest("button").prop("disabled", false);
    $("#initial").closest("button").prop("disabled", false);
    $("#final").closest("button").prop("disabled", false);
    $("#replay").closest("button").prop("disabled", false);
    $("#review").text("顯示軌跡");
    closeCanvas();;
    endMoveWave();
}
function toggleReviewPath(){
    if( $("#review").text() == "顯示軌跡" ){
        $("#review").text("隱藏軌跡");
        MAIN_STATE = "review";        
        AUTO_REMOVE = false;
        resetCanvas();
        drawPath();
    }else{
        $("#review").text("顯示軌跡");
        returnMainState();
        returnAutoRemove();
        closeCanvas();
        nextMoveWave();
    }
}

function showResult(){
    console.log(HISTORY);
    console.log(INITIAL_PANEL);
}
function showTime(now){    
    var timeFraction = ( TIME_LIMIT - ( now - START_TIME ) )/TIME_LIMIT;
    $("#timeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeBack").css("width"))*timeFraction+"px,"+
        parseInt($("#timeBack").css("height"))+"px, 0px)" );
}
function setHistoryShow(){    
    $("#historyNum").text( HISTORY_SHOW );
}
function setComboShow(){    
    $("#comboNum").text( COMBO_SHOW );
}
function resetComboBox(){
    $("#comboBox").children().remove();
    $("#comboBox").attr("wave",-1);
}
function makeComboSet(setArr){
    var set_stack = [];
    for(var id of setArr){
        if( $("#dragContainment tr td").eq(id).children().length != 0 ){
            var src = $("#dragContainment tr td").eq(id).find("img.over").attr("src");
            var item = src.split('/')[src.split('/').length-1].split('.')[0];
            var img = newElementByItem(item)[0].removeClass("draggable over").addClass("comboBox");
            set_stack.push(img);
        }
    }
    return set_stack;
}
function addComboSet(comboSet){
    if( parseInt( $("#comboBox").attr("wave") ) < 0 ){
        $("#comboBox").attr("wave",DROP_WAVES);
        $("#comboBox").append( $("<div align=\"center\">首消</div><hr>").addClass("comboLabel") );
    }else if( parseInt( $("#comboBox").attr("wave") ) == 0 && DROP_WAVES > 0 ){
        $("#comboBox").attr("wave",DROP_WAVES);
        $("#comboBox").append( $("<div align=\"center\">落消</div><hr>").addClass("comboLabel") );
    }
    var div = $("<div>").addClass("imgComboSet");
    for(var e of comboSet){
        div.append(e);
    }
    $("#comboBox").append(div.append("<hr>"));

    $("#Scrollbar").mCustomScrollbar("update");
}
function addColorIntoBar(){
    if( CREATE_COLOR != null ){
        var id = parseInt( $("#optionalColors").attr("IDmaker") );
        $("#optionalColors").attr("IDmaker", id+1);
        var element = $("<img>").attr("src", mapImgSrc(CREATE_COLOR) );
        element.attr("color",CREATE_COLOR).attr("onclick","removeSelfColor("+id+")");
        var li = $("<li></li>").attr("id","li_"+id).append(element);
        $("#optionalColors li").eq(-1).before(li);

        $("#HorizontalScrollbar").mCustomScrollbar("update");
        setOptionalColors();
    }
}
function removeSelfColor(id){
    $("#li_"+id).remove();
    setOptionalColors();
}
function setOptionalColors(){
    COLORS = [];
    $("#optionalColors li").each(function(){
        if( $(this).find("img").length > 0 ){
            COLORS.push( $(this).find("img").attr("color") );
        }
    });
    resetColors();
}

function scroll_top(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
};
function scroll_bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
};
function hide_navbar(){
    $('.navbar-fixed-top').autoHidingNavbar('hide');
}

$("#file").change(function (){
    if( $(this).val() !== '' ){
        upload();
    }
});
$('#timeRange').change(function (){
    $(this).val( Math.max( parseInt($(this).attr("min")), 
        Math.min( parseInt($(this).attr("max")), parseInt($(this).val()) ) ) );
    TIME_LIMIT = $(this).val();
});
$('#speedSelect').change(function (){
    REPLAY_SPEED = parseInt($(this).val());
});
$('#colorSelect').change(function (){
    var colorArr = $(this).val().split(",");
    for(var i = 0; i < colorArr.length; i++){
        $("#panelControl button").eq(i).attr("onclick","setColor('"+colorArr[i]+"',"+i+")");
        $("#panelControl button img").eq(i).attr("src",mapImgSrc(colorArr[i]));
    }
});
$("#dropColorSelect").change(function (){
    if( $(this).val() == "optional" ){

        $("#optionalColors li img").closest("li").remove();
        var id = 0;
        for(var c of ["w", "f", "p", "l", "d", "h"]){
            var element = $("<img>").attr("src", mapImgSrc(c) );
            element.attr("color",c).attr("onclick","removeSelfColor("+id+")");
            var li = $("<li></li>").attr("id","li_"+id).append(element);
            $("#optionalColors li").eq(-1).before(li);
            id++;
        }
        $("#optionalColors").attr("IDmaker", id);

        $("#HorizontalScrollbar").show();
        setOptionalColors();
    }else{
        $("#HorizontalScrollbar").hide();
        COLORS = $(this).val().split(",");
        resetColors();
    }
});
$("#teamLeftSelect").change(function (){
    TEAM_LEADER_LEFT = $(this).val();
    console.log(TEAM_LEADER_LEFT);
    if( TEAM_LEADER_LEFT == "COUPLE-f" || TEAM_LEADER_LEFT == "COUPLE-p" ){
        TEAM_COLORS_CHANGEABLE = false;
        resetColors();
    }
    if( TEAM_LEADER_LEFT == "COUPLE-f" ){
        GROUP_SIZE['f'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT == "COUPLE-p" ){
        GROUP_SIZE['p'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f"  && TEAM_LEADER_RIGHT != "COUPLE-f" ){
        GROUP_SIZE['f'] = 3;
    }
    if( TEAM_LEADER_RIGHT != "COUPLE-p" && TEAM_LEADER_LEFT != "COUPLE-p"  ){
        GROUP_SIZE['p'] = 3;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f" && TEAM_LEADER_RIGHT != "COUPLE-f" &&
        TEAM_LEADER_LEFT != "COUPLE-p" && TEAM_LEADER_RIGHT != "COUPLE-p" ){
        GROUP_SIZE['h'] = 3;
        TEAM_COLORS_CHANGEABLE = true;
        resetColors();
    }
});
$("#teamRightSelect").change(function (){
    TEAM_LEADER_RIGHT = $(this).val();
    if( TEAM_LEADER_RIGHT == "COUPLE-f" || TEAM_LEADER_RIGHT == "COUPLE-p" ){
        TEAM_COLORS_CHANGEABLE = false;
        resetColors();
    }
    if( TEAM_LEADER_RIGHT == "COUPLE-f" ){
        GROUP_SIZE['f'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_RIGHT == "COUPLE-p" ){
        GROUP_SIZE['p'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f"  && TEAM_LEADER_RIGHT != "COUPLE-f" ){
        GROUP_SIZE['f'] = 3;
    }
    if( TEAM_LEADER_RIGHT != "COUPLE-p" && TEAM_LEADER_LEFT != "COUPLE-p"  ){
        GROUP_SIZE['p'] = 3;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f" && TEAM_LEADER_RIGHT != "COUPLE-f" &&
        TEAM_LEADER_LEFT != "COUPLE-p" && TEAM_LEADER_RIGHT != "COUPLE-p" ){
        GROUP_SIZE['h'] = 3;
        TEAM_COLORS_CHANGEABLE = true;
        resetColors();
    }
});



function autoCheckDropGroups(){
    resetBase();
    resetColorGroupSet();
    resetDropStack();
    countColor();
    countGroup();

    var times = 0;
    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
    }
    while( num > 0 && times < MAX_AUTO_DROP_TIMES ){
        for(var i = TD_NUM*TR_NUM-1; i >= 0; i--){
            if( REMOVE_STACK.indexOf(i) >= 0 ){ continue; }
            var isSet = inGroup(i);
            if( isSet ){
                var setArr = Array.from(isSet);
                for(var id of setArr){
                    REMOVE_STACK.push(id);
                    $("#dragContainment tr td").eq(id).find("img").remove();
                    $("#dragContainment tr td").eq(id).append( newElementByID(id) );
                }
            }
        }

        resetColorGroupSet();
        resetDropStack();
        countColor();
        countGroup();

        num = 0;
        for(var color in GROUP_SETS){
            num += GROUP_SETS[color].length;
        }

        times++;
    }
}