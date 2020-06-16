requireCSS("nb.css");
	
var nextTabsDir =
  { top : "ver rgt"
	, rgt : "hor bot"
	, bot : "ver lft"
	, lft : "hor top"
	};


$(document).ready(function(){
	$("body").on("click", ".nb > .tabs > .tab", selPage);
})

function selPage(){
	var tab = $(this);
  if (tab.hasClass("sel")) return;
	
	var pageid = "#"+tab.attr("for");
	
	$(pageid).siblings(".sel").removeClass("sel");
	$(pageid).addClass("sel");
	
	tab.siblings(".sel").removeClass("sel");
  tab.addClass("sel");
}

function rotateTabs (event){
	event.stopPropagation();
	
	var me = $(this);
  var nb = me.parent();
	var currdir = 
	    nb.hasClass("top") && "top"
	 || nb.hasClass("rgt") && "rgt"
	 || nb.hasClass("bot") && "bot"
	 || nb.hasClass("lft") && "lft"
	 
  var newClasses = nextTabsDir[currdir];
	
	nb.removeClass("ver hor top lft bot rgt")
	  .addClass(newClasses);

}

/****************************************************************/
/*  Funktionen zum Generieren und Fuellen von note-Books        */
/****************************************************************/
function genNBTab(nbID, pageID){}
function genNBPage(pageID){}

function genNB (nbID, pageTitles, options ){
	var options  = options          || {};
	var contents = options.contents || {};
	var indent   = options.indent   || "";
	var tbdir    = options.dir      || "top";
	var selpage  = options.page     || 0
	
	var tbali    = (tbdir=="top" || tbdir=="bot") && "hor"  || "ver" ;
	
	var nbclass = `nb ${tbali} ${tbdir}`;
	
	var tabs  = [];
	var pages = []
	var i,id,clt,clp,sel,title;
	
	for (i=0; i<pageTitles.length; i++){
		id = `"${nbID}P${i}"`;
		title = pageTitles[i];
		sel = selpage==i || selpage==title;
		clt =  `"tab${sel && " sel" || ""}"`;
		clp = `"page${sel && " sel" || ""}"`;
		
		tabs[i]  = `><label class=${clt} for=${id}>${title}</label`;
		pages[i] = `<div id=${id} class=${clp}>
${indent}      Seite: ${title}
${indent}    </div>`
	};
	
	tabs = tabs.join(`
${indent}    `);
  pages = pages.join(`
${indent}    `);

	var nb = `${indent}<div id="${nbID}" class="${nbclass}">
${indent}  <div class="tabs"
${indent}    ${tabs}>
${indent}  </div>
${indent}  <div class="pages">
${indent}    ${pages} 
${indent}  </div>
${indent}</div>`
console.log(nb);

	var dummy = document.createElement("div");
	
	$(dummy).html( nb );
	nb = $(dummy).children()
	
	var content;
	for (i=0; i<pageTitles.length; i++){
		id = `#${nbID}P${i}`;
		title = pageTitles[i];
		content = contents[i] || contents[title] ;
		if (content!=undefined) 
			nb.find(id).empty().append(content);
	}
	
  return nb;	
}
