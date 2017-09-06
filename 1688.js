(function(){
var debugFlag = false;
var urlRoot = "https:";
var url = "https://code.jquery.com/jquery-1.12.3.min.js";
var filterUrl = "https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8";
window.embed_script = embed_script;
window.register_aop = register_aop;
//执行主程序
embed_script(url,Main);

function Main(){
	if(typeof(jQuery)  ==  'undefined'){
		console.log("deley");
		setTimeout(Main,500);
		return;
	}
	console.log("loaded");
	if(typeof($$)  ==  'undefined'){
		var $$ = jQuery;
		window.$$=$$;
	}
 	
 	//拦截XHR
	//register_aop(filterUrl,true,doHandle);		
	doHandle();
 
	
 
	function doHandle(){		
 		var body = "",
			count = 0;
		var tableDom = $$(".goods-image");
		var infoDom = $$(".unit-sku");
		var priceDom = $$(".unitprice em");
	 
		tableDom.each(function(i,dom){
			
			var price = priceDom.eq(count);
			var info = infoDom.eq(count);
			
			var rowDom = $$(dom);
 
			var a = rowDom.find(".img-vertical a");
  			var img = a.html()//.replace("src=","t=").replace("lazyload=","src=")
			.replace("src=\"//","src=\"http://")
			.replace("alt=\"([\w\W]*)\"","");
			
				body+=formatCsv([
					img,
					a.attr("href"),
					a.find("img").attr("alt"),
					
					price.text(),
					
					info.text().replace(/\r|\n/g,'').trim(),
				]);
			 
			count++;
			
		});//end dom for	
		console.log(body);		
		//console.log("count",count);	
	 
	}
	
}


/**
格式化csv数据
*/
function formatCsv(ar){
	var tr = "";
	for(var i in ar){
		tr+=ar[i]+"	";
	}
	return tr+"\r\n";
}
//////////////////////////////////////////////////////////////////////////////////////////
/**
嵌入script
*/
function embed_script(url ,cb){
 	var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);    
	document.getElementsByTagName('head')[0].appendChild(script);
	script.onload= cb;
}

var AOP_DATA = {
	after : {},
	before : {}
};
window.AOP_DATA = AOP_DATA;

function register_aop(url,flag,cb){
	if(flag){
		AOP_DATA.after[url]=cb;
	}else{
		AOP_DATA.before[url]=cb;
	}
}
/**
重写 XMLHttpRequest http 进行拦截
*/
if(typeof(XMLHttpRequest.prototype.aopXHR) == "undefined"){
	XMLHttpRequest.prototype.aopXHR = true;
	var oriXOpen = XMLHttpRequest.prototype.open; 
	XMLHttpRequest.prototype.open = function(method,url,asncFlag,user,password) { 
		var beforeCb = AOP_DATA.before[url];
		var afterCb = AOP_DATA.after[url];

		if(beforeCb!=null || afterCb != null){			
			var cb = this.onreadystatechange;
			this.onreadystatechange = function(){
				if(beforeCb!=null) beforeCb(); 
				if(cb!=null) cb(); 
				if(afterCb!=null) afterCb(); 
 			}
		}	
		oriXOpen.call(this,method,url,asncFlag,user,password);
	};
	/**
	var oriXSend = XMLHttpRequest.prototype.send; 
	XMLHttpRequest.prototype.send = function(args) {	
		oriXSend.call(this,args); 	
	};
	*/
}

})();


