
$(function(){
    var timer;
    //$("#time").stopAtTop();
    //使用了windows的状态栏来显示了。
    $(".genExamAgain").click(function(){
        $(window).scrollTop(0);
        $("#examShowSelection").slideDown();
        $("#examPage").css("display","none");
        $("#examResult").css("display","none");
    });
    $("#genExam").click(function(){
        $(window).scrollTop(0);
        $("#examShowSelection").slideUp("slow",function(){
        });
        $("#question").html("");
        $("ul").each(function(){
            var num=parseInt($(this).children("input").val(),10);
            var lib=window.lib;
            var questionType=$(this).attr("title");
            var examLib=[];
            var ui="";
            $(this).find("input:checked").each(function(){
                var questionChapter=$(this).val();//如，单选里，是 APU的，那些系统题。
                questionChapter=lib[questionType][questionChapter];
                examLib=examLib.concat(questionChapter);
            });
            if(examLib.length==0){
                return;//如果，没有选项被选，那么，也就没有必要去显示了。
            }
            examLib=examLib.shuffle().slice(0,num);//乱中，取一定的，就是随机了。 
            var is_need_shuffle=$("#shuffle").prop("checked");
            if(!is_need_shuffle){
                examLib.sort(function(a,b){
                    return a.问题.localeCompare(b.问题);
                });
            }

             /*
             由于是为了出卷，然后打印
             所以，根据题型的不同，使用了不同的方法去显示。
             */
            examLib.each(function(v,i){
                ui=ui+"<div title="+questionType+" class='question'>";
                ui=ui+"<b>"+(i+1)+"："+v.问题+"</b><br />";
                if(questionType=="单选题"){
                    v.选项.each(function(val,index){
                        var name=v.问题;
                        ui=ui+"<label><input type='radio' value='"+val+"' name='"+name+"' />"+val+"</label>";
                    });  
                    ui=ui+"<span class='rightResult'></span><span class='rightSelection'>"+v.答案+"</span><span class='mySelection'></span><br /></div>" ;                
                }else if(questionType=="判断题"){
                    var name=v.问题;
                    ui=ui+"<label><input type='radio' value='对'name='"+name+"' />对</label>"+
                    "<label><input type='radio' value='错' name='"+name+"' />错</label>";
                    ui=ui+"<span class='rightResult'></span><span class='rightSelection'>"+v.答案+"</span><span class='mySelection'></span><br /></div>";
                }else if(questionType=="多选题"){
                    v.选项.each(function(val,index){
                        var name=v.问题;
                        ui=ui+"<label><input type='checkbox' value='"+val+"' name='"+name+"' />"+val+"</label>";
                    });  
                    ui=ui+"<button class='makeSelection'>确定选择</button><span class='rightResult'></span><span class='rightSelection'>"+v.答案+"</span><span class='mySelection'></span><br /></div>" ;                
                      
                }else{//只有上面三种题型，才可以做到在线改卷。客观题，都是行的。
                    //换成了，问答题，就不好说了。
                    ui=ui+"<button class='lookAnswer'>查看答案</button><br /><span class='rightAnswer'>"+v.答案+"</span><br /></div>";
                }
            });
            $("#question").append("<h2 title='"+questionType+"'>"+questionType+"</h2>").append(ui);
        });
        //这是为了给每一个题型一个序号，如：一、
        var questionType=$("#question h2");
        if(questionType.size()>1){
            var i=1;
            questionType.each(function(){
                $(this).prepend(String(i).toChineseNumber()+"、");
                i++;
            })
        } 
        $(".question input:radio").click(function(){//这是 单选题，判断题的结果处理
            var my_selection=$(this).val().split("")[0];//就是选项 A B C
            $(this).parent().parent().find(".mySelection").text(my_selection);

            if($(this).parent().parent().find(".mySelection").text()
            ==$(this).parent().parent().find(".rightSelection").text()){
                $(this).parent().parent().find(".rightResult").text("✔");
            }else{
                $(this).parent().parent().find(".rightResult").text("✖")
            }
        })
        $(".question input:checkbox").click(function(){//这是 多选题的结果处理
            var my_selections=[]
            $(this).parent().parent().find("input:checked").each(function(){
                var my_selection=$(this).val().split("")[0];//就是选项 A B C
                my_selections.push(my_selection);
                my_selections.sort();
            })
            $(this).parent().parent().find(".mySelection").text(my_selections.join(""));
        })
        $("button.makeSelection").click(function(){
            if($(this).parent().find(".mySelection").text()
            ==$(this).parent().find(".rightSelection").text()){
                $(this).parent().find(".rightResult").text("✔");
            }else{
                $(this).parent().find(".rightResult").text("✖")
            }            
        });
        $("button.lookAnswer").click(function(){
            $(this).parent().find(".rightAnswer").slideDown("slow");
        });
        $("#examPage").slideDown("slow");
    });
    $("#postExam").click(function(){
        $("#examPage").css("display","none");
        $("#examResult").css("display","block");
        
        $("#question h2").each(function(){
            $("#examResult .miss").html("<h2>忘做题</h2>");
            $("#examResult .wrong").html("<h2>做错题</h2>");
            $("#examResult .conclusion").html("");

            var ui="";
            var questionType=$(this).attr("title");
            if(!(questionType=="单选题"||questionType=="多选题"||questionType=="判断题")){
                return;
            }
           // $("#examResult .conclusion").append("<h2>"+$(this).text()+"</h2>");//单选题、多选题
           // console.log($(this).parent().html()) 
           var index=1;//题号
           var rightAnswer=0;
           var wrongAnswer=0;
            $(this).parent().find("div[title="+questionType+"]").each(function(){
                var result=$(this).find("span");
                var rightSelection=result.eq(1).text();
                var mySelection=result.eq(2).text();
                if(rightSelection==mySelection){
                    rightAnswer++;

                }else{
                    //为空，说明忘做了！
                    if(mySelection==""){
                        $("#examResult .miss").append($(this).html()).append("<div>正确答案为："+rightSelection+"</div>");
                    }else{
                        $("#examResult .wrong").append($(this).html()).append("<div>正确答案为："+rightSelection+"</div>")
                    }
                    wrongAnswer++;
                }
                index++;
            });
            var total=index-1;
            var conclusion="<b>共有："+total+" 题　　做对："+rightAnswer+" 题　　做错："+wrongAnswer+"题</b>";
            ui=ui+conclusion;
            $("#examResult .conclusion").append(ui+"<br /><br />");
            $(window).scrollTop(0);
            //console.log($("#examResult").html())
        })
     })
})