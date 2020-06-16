/*------------------------------------------------------------------
 * Funktion zum Generieren eines HTML-Notebooks der Klasse .snb
 *------------------------------------------------------------------
 * Diese Funktion ist in einer eigenen closure definiert, die
 * die Muster zum Generieren des Html-Textes beinhaltet. 
 *-------------------------------------------------------------------
 * Ergebnis ist das Notebook als DOM-Objekt, aber noch nicht
 * in den body der Html-Seite integriert.
 *-------------------------------------------------------------------
 * Parameter:
 *   1. Die id des Notebook-Elementes (ein String)
 *   2. Die Lage der tabs des Notebooks ("top","rgt","bot","lft")
 *   3. Optionen zum Aufbau des Notebook-Inhaltes (ein Objekt)
 *-------------------------------------------------------------------
 * Die allesamt nicht notwendigen Optionen des Notebook-Aufbaus:
 *   titles   : [Array der Tabtitel] 
 *   contents : {Mapping der Tabtitel auf die Seiteninhalte}
 *   selpage  : Index oder Titel der selektierten Seite (titles)
 *   indent   : "Einrueckungs-String (primaere Einrueckung)"
 * Defaults sind  [], {}, "" fuer titles, contents und indent.
 * Ist ein Seiteninhalt nicht vorgegeben, wird er mit "" defaultiert.
 * Ist keine Seite selektiert, wird Seite 0 angezeigt.
 *------------------------------------------------------------------
 * Die Seiteninhalte koennen als Text, Htmltext oder DOM-Objekt
 * vorgegeben sein. Sie werden mittels jQuery.append in das 
 * Notebook integriert. Damit koennen auch andere Inhalte der
 * HTML-Seite in das notebook verschoben werden.
 *------------------------------------------------------------------*/
 
var genSNB = (function(){
	var pat = 
	{ snb : `
<div class="snb $[{classes}" id="$[{nbid}" ><div class="snbtabs">
  $[{pages}
</div></div>
`
	, page : 
`<input  id="$[{nbid}rb$[{num}" class="snbsel" type="radio" name="$[{nbid}"$[{checked}><label class="snblabel" for="$[{nbid}rb$[{num}">
	<span id="$[{nbid}tb$[{num}" class="snbtitle">$[{title}</span></label><div class="snbpage"> 
	<div  id="$[{nbid}cp$[{num}" class="snbcontent">
 	</div></div>`
	}
	for ( key in pat)
		pat[key] = pat[key].replace(/\$\[\{/g,"${")
		                   .replace(/\n/g, "\n${indent}");
	

	return function (nbid, tabside, options){
		var options  = options          || {};
		var titles   = options.titles   || [];
		var contents = options.contents || {};
		var indent   = options.indent   || "";
		var tabside  = options.tabside  || "top";
		var selpage  = options.selpage  || 0;
		var css      = options.css;
		
		var tbali    = (tabside=="top" || tabside=="bot") && "hor"  || "ver" ;
		
		var classes  = `${tbali} ${tabside}`;
		
		var pages = [];
		var num,id,checked,title;
		
		for (num=0; num<titles.length; num++){
				title   = titles[num];
				checked = (selpage==num || selpage==title) && " checked" || "";
				pages[num] = eval("`" + pat.page + "`"); 
		}
			
		pages = pages.join(`
		${indent}    `);

		var nb = eval("`" + pat.snb +"`")
		console.log(nb);

		var dummy = document.createElement("div");
			
		$(dummy).html( nb );
		nb = $(dummy).children()
		if (css) nb.css(css);
			
		var content,page;
		for (num=0; num<titles.length; num++){
			id = `#${nbid}cp${num}`;
			title = titles[num];
			content = contents[num] || contents[title] ;
			if (content) {
				page = nb.find(id);
				page.empty();
				page.append(content);
			}
		}
	
		return nb;	
	}
})();