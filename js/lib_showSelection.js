function getQuestionNumberByType(questionType){
    var num=0;
    for(v in questionType){
        num=num+questionType[v].length;
    }
    return num;
}
function genSlectionUI(lib,questionType){
    
    var ui="";
    questionType.each(function(v,i){
        ui=ui+
        "<h2>"+String(i+1).toChineseNumber()+"、"+
        v+"("+getQuestionNumberByType(lib[v])+")</h2><ul title="+
        v+">";
        for(var question in lib[v]){
            ui=ui+"<li><label><input type='checkbox' value="+question+" checked='checked' />"+
            question+
            "("+lib[v][question].length+
            ")</label></li>"
        }

        ui=ui+'<button class="selectAll">全选</button> <button class="noSelect">全不选</button>'+
        '<input name='+v+
        ' type="text" value="5" size="5" maxlength="4" />'+
        "</ul>";
        
        //console.log(lib[v])
        //for(var i=0;i<lib)
    });
    return ui;
}
$(function(){

    $(".examSelection").append(genSlectionUI(window.lib,questionType));
    $(".selectAll").click(function(){
        $(this).parent().find("li label input").each(function(){
            $(this).prop("checked",true);
        })
    });
    $(".noSelect").click(function(){
        $(this).parent().find("li label input").each(function(){
            $(this).prop("checked",false);
        })
    }).click();

    // $("#showSelection ul").children("input").focusout(function(){
    //     var val=$(this).val();
    //     if(!/^\d{1,3}$/.test(val)){
    //          $(this).focus().select().css({color:"red"});
    //         external.error("您输入了非数字或数字位数超过３位。\n请输入不超过三位数的数字，以供软件进行出题！");
           
    //     }else{
    //         $(this).css({color:"black"});
    //     }
    // })
})

