/*
对lib里的题库进行转换，以方便以后的处理。
转换后的：
lib={
    单选题={
        APU=[{
            问题=,//string
            答案=,//[] or string
            选项=
        }],
        燃油=[],
        ...
    },
    多选题...
}

lib=[
['多选题','APUx','ALL 320-232，滑油温度超过[    ]会有琥珀色ECAM信息','2','高于165℃','165℃超过15分钟','高于150℃'],
['单选题','APU','ALL 320-232,起动机的最大工作时间是多少？','3 个连续循环：每个最长可持续 2 min ，第3 个循环为 1 min','4 个连续循环，每个最长可持续 2 min','三个连续循环：每个个2分钟的'],
['单选题','APU','ALL 320-232,起动机冷却时间要求是：','3 次起动尝试或 4 min 连续冷转后的冷却时间：30 min 。','四个2分钟的循环后冷却15分钟','四个8分钟的循环后冷却12分钟'],
["简答题","非正常程序","当观察到两个或者两个下述表现，则 飞行机组可以怀疑发动机损坏，请列出可能的现象？","‐ EGT 快速增加超过红线 <br /> ‐ 转子速度明显不相符，或者没有转动 <br /> ‐ 飞机振动，或者抖震或者振动和抖震明显增加 <br /> ‐ 液压系统失去 <br /> ‐ 发动机失速反复出现或无法控制 <br /> "],

];
*/
lib=(function(lib){
    var Qlib={};
    lib.each(function(question){
        if(!Qlib[question[0]]){
            Qlib[question[0]]={};
        }
        if(!Qlib[question[0]][question[1]]){
            Qlib[question[0]][question[1]]=[];
        }
        var title=question[2];
        if(question[0]=="多选题"){
            var answer=parseInt(question[3],10);
            answer=question.slice(4,4+answer);
            var option=question.slice(4);
        }else{
            var answer=question[3];//3 也是答案的
            var option=question.slice(3);//从index 3到尾，都是选项
            //单选题，判断题，是有选项的。问答题，简答题，可以认识答案本身，就是选项。
        }
        var topic={};
        topic["问题"]=title; 
        if(question[0]=="多选题"){
            option.shuffle();
            var indexs=option.genIndex(answer);
            indexs.map(function(v,i){
                return (String(v+1).toAlphabet());
            }).sort();
             option.map(function(v,i){
                v=String(i+1).toAlphabet()+"："+v;
                return v;
            });   
            answer="";
            indexs.each(function(v,i){
                answer=answer+v;
            });    
            topic["答案"]=answer;
            topic["选项"]=option;
        }else if(question[0]=="单选题"){
            option.shuffle();
            var index=option.genIndex(answer);
            answer=String(index+1).toAlphabet();//变成ABCD
            option.map(function(v,i){
                v=String(i+1).toAlphabet()+"："+v;
                return v;
            });
            topic["答案"]=answer;
            topic["选项"]=option;
        }else if(question[0]=="判断题"){
            topic["答案"]=answer;
            //判断题，跟问题题是一样的。不需要选项的
            //topic["选项"]=option.shuffle();//打乱一下就可。
        }else{
            topic["答案"]=answer;
        }
        Qlib[question[0]][question[1]].push(topic);
    });
    return Qlib;
})(lib);
/*
如果很想保持 题型的顺序，
目前来看，谁先出现，就排前面。
万一，有变化，那么，可以在这里，先打印出所有的题型，然后，手工改了：questionType，就可以了。
因为，生成界面时，使用了questionType的。！
*/
var questionType=[];
for (qType in lib) {
    if (lib.hasOwnProperty(qType)) {
        questionType.push(qType);
    }
}
//console.log(lib)