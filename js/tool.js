function genBrTimes(strLen,charNum){
    var lineNum=Math.ceil(strLen/charNum);
    //alert(lineNum)
    if(lineNum>13){
        lineNum=13;
    }
    if(lineNum<3){
        lineNum=3;
    }

   // return "<br />";
    var br="";
    for(var i=0;i<lineNum;i++){
        br=br+"<br />"
    }
    return br;
}
Array.prototype.shuffle=function(num){
	//算法很简单：1打乱数组。2先前num个。
	var sf = function(){ return 0.5 - Math.random(); }
    this.sort(sf);//这是用来生成了乱序
	return this;
}
//查找v，在数组里的位置。
//v可以是一个字符串或数组，找不到的，返回null
Array.prototype.genIndex=function(v){
    if(typeof(v)=="string"){
        for(var i=0;i<this.length;i++){
            if(this[i]==v){
                return i;
            }
        }
    }
    if(typeof(v)=="object"){
        var indexs=[];
        for(var i=0;i<v.length;i++){
            for(var j=0;j<this.length;j++){
                if(v[i]==this[j]){
                    indexs.push(j);
                }
            }
        }
        return indexs;
    }
}
Array.prototype.each=function(func){
    for(var i=0;i<this.length;i++){
        func(this[i],i);
    }
    return this;
}
Array.prototype.map=function(func){
    for(var i=0;i<this.length;i++){
        this[i]=func(this[i],i);
    }
    return this;
}
String.prototype.toAlphabet=function(){
    return String.fromCharCode(64+parseInt(this,10));
}
//产生多少个换行；方便问答题加换行数
function genBrTimes(strLen,charNum){
    var lineNum=Math.ceil(strLen/charNum);
    //alert(lineNum)
    if(lineNum>13){
        lineNum=13;
    }
    if(lineNum<3){
        lineNum=3;
    }

   // return "<br />";
    var br="";
    for(var i=0;i<lineNum;i++){
        br=br+"<br />"
    }
    return br;
}
function remove_ie_header_and_footer(){
    var hkey_path;
    hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
    try {
      var RegWsh = new ActiveXObject("WScript.Shell");
      RegWsh.RegWrite(hkey_path + "header", "");
      var d=new Date();
      RegWsh.RegWrite(hkey_path + "footer", "海口飞行部安技室数据化小组　　　　　　　　　　　　　　　　"+d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日出卷");
    } catch(e) {
    }
  }

/*
    工具包
*/
var Utils={
    /*
        单位
    */
    units:'个十百千万@#%亿^&~',
    /*
        字符
    */
    chars:'零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串            
    */
    numberToChinese:function(number){
        var a=(number+'').split(''),s=[],t=this;
        if(a.length>12){
            throw new Error('too big');
        }else{
            for(var i=0,j=a.length-1;i<=j;i++){
                if(j==1||j==5||j==9){//两位数 处理特殊的 1*
                    if(i==0){
                        if(a[i]!='1')s.push(t.chars.charAt(a[i]));
                    }else{
                        s.push(t.chars.charAt(a[i]));
                    }
                }else{
                    s.push(t.chars.charAt(a[i]));
                }
                if(i!=j){
                    s.push(t.units.charAt(j-i));
                }
            }
        }
        //return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等
            b=t.units.indexOf(d);
            if(b!=-1){
                if(d=='亿')return d;
                if(d=='万')return d;
                if(a[j-b]=='0')return '零'
            }
            return '';
        }).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){
            return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m];
        }).replace(/([亿万])([一-九])/g,function(m,d,b,c){
            c=t.units.indexOf(d);
            if(c!=-1){
                if(a[j-c]=='0')return d+'零'+b
            }
            return m;
        });
    }
};
String.prototype.toChineseNumber=function(){
    var num=parseInt(this,10);
    return Utils.numberToChinese(num);
}