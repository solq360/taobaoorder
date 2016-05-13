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
 	var tableOwner = "div .index-mod__order-container___1ur4-";
	var titleOwner = ".ml-mod__container___1zaKJ:not(.production-mod__production___3ZePJ .uborder-mod__production___3WebF)"
	var dateOwner = ".bought-wrapper-mod__checkbox-label___2rAxv span";
	var linkOwner = "a.production-mod__pic___2Wuak";
	var priceOwner = "strong";
	var subPriceOwner = ".price-mod__price___3Un7c p";
	var stateOwner = "td span.text-mod__link___36nmM:not(.text-mod__hover___t2aVK)";
	var orderOwner = ".bought-wrapper-mod__head-info-cell___3dMW3 span";
	
	var nextBntOwner = ".pagination-options-go";
	var nextInputOwner = ".pagination-options input";
	var lastPageOwner = ".pagination-item:last";
	
 	//var nextInputDom = $$(nextInputOwner);
	//var lastPageDom = $$(lastPageOwner);	
	var pageCount = parseInt($$(lastPageOwner).text());
	//拦截XHR
	register_aop(filterUrl,true,doHandle);		
	
	/*
	for(var i = 1 ;i<= pageCount; i++){
		$$(nextInputOwner)[0].value=i;
		$$(nextBntOwner).click();
		doHandle();
	}*/
	
	
	function doHandle(){		
 		var body = "",
			count = 0;
		var tableDom = $$(tableOwner);
		tableDom.each(function(i,dom){
			
			var rowDom = $$(dom);
			
			var titleDoms = rowDom.find(titleOwner).not(":contains('保险服务')").not(":contains('增值服务：全国联保')") ;
			var dateDom = rowDom.find(dateOwner);
			var priceDom = rowDom.find(priceOwner);
			var stateDom = rowDom.find(stateOwner);
			//var orderDom = rowDom.find(orderOwner);
			
			if(debugFlag){			
				console.log("row",i);
				console.log("dateText",dateDom.text());
				console.log("priceText",priceDom.text());
				//console.log("orderText",orderDom.text());
				console.log("stateText",stateDom.text());			
			}
			
			titleDoms.each(function(i,dom){
				var rootRt = $$(dom).closest("tr");
				var titleText = $$(dom).find("p:first");
				var subPriceText = rootRt.find("td:eq(1)").find(subPriceOwner);
				var linkDom = rootRt.find(linkOwner);
				
				if(debugFlag){
					console.log("titleText",titleText.text());	
					console.log("===",subPriceText.text());
					console.log("linkText",linkDom.attr("href"));		
				}
				count++;
				body+=formatCsv([
					dateDom.text(),
					titleText.text().replace("[交易快照]","").trim(),
					
					subPriceText.text(),
					priceDom.text(),
					stateDom.text(),
					urlRoot + linkDom.attr("href")
				]);
			});
			
		});//end dom for	
		console.log(body);		
		console.log("count",count);	
		/*
		 	var nextPage = parseInt($$(nextInputOwner)[0].value) + 1;
			if(nextPage > pageCount){
				return;
			}
			$$(nextInputOwner)[0] = nextPage;
			$$(nextBntOwner).click();
		*/
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



