let loadingDom=`<div class="loading-wrap" id="loading-wrap">
            <img src="./img/loading.gif" alt>
       </div>
</div>`;

function loadingDomFn(){
	let wrapDom=document.createElement("div")
	wrapDom.innerHTML=loadingDom;
	document.querySelector("body").appendChild(wrapDom);
	this.wrapDom=document.querySelector("#loading-wrap");
	this.event();

};
loadingDomFn.prototype.event=function(){
	this.wrapDom.ontouchstart=function(e){
		e.preventDefault();
	}
};
loadingDomFn.prototype.hide=function(){
	this.wrapDom.style.cssText = "opacity:0";
	if("ontransitionend" in window){
		this.wrapDom.addEventListener("transitionend",()=>{
			this.wrapDom.style.cssText = "display:none";
		});
	}
	else if("onwebkittransitionend" in window){
		this.wrapDom.addEventListener("webkittransitionend",()=>{
			this.wrapDom.style.cssText = "display:none";
		});
	}
	else{
		this.wrapDom.style.cssText = "display:none";
	}
	
};

loadingDomFn.prototype.none=function(){
	this.wrapDom.style.cssText = "display:none";
}

export default new loadingDomFn();
