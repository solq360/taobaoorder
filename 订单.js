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
	register_aop(filterUrl,true,doHandle);		
	doHandle();
 
 
	function doHandle(){		
 		var body = "",
			count = 0;
		var tableDom = $$(".bought-table-mod__table___3IZVO tr");
		tableDom.each(function(i,dom){
			
			var rowDom = $$(dom);
			if(rowDom.find("td").eq(5).find("p").eq(0).text()!="交易成功"){
 				return;
			}
			var a = rowDom.find("td div.ml-mod__container___CrfGS");
			var titleDoms = a.find("div").eq(1).find("a").eq(0)
			if(!titleDoms){
				return;
			}
			var title = titleDoms.text().trim();
			if(title=="保险服务"){
				return;
			}	 
			
			var img = rowDom.find(".ml-mod__media___3iQpG a img").prop("outerHTML").replace('src="//','src="http://');
			var href = titleDoms.attr("href").replace(/^\/\//,"http://");
			count++;
				body+=formatCsv([
					img,
					href,
					title,
				]);
			 
		 
			
		});//end dom for	
		console.log(body);		
		//console.log("count",count);	
		setTimeout(function(){
		$$(".button-mod__button___2JAs3")[1].click();
		},500);
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


