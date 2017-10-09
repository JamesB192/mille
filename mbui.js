    function click(mine) {
	var count, face, scratch, scratch2, mycard, cardnum;
        if((mode!=0)||(turn!=0)) { return ; } // exit if the game is not running or it is someone elses turn
	console.debug("player "+turn+": entering click()");
	if(dodiscard==1) {
	    return discard("card"+mine);
	  }
        scratch="card"+mine;
	for(count=hands[0].length-1;count>=0;count--) {
	    if(scratch==hands[0][count]) { scratch2=count; }
	  }
	if(scratch2==-1) { return -1; }
	switch(SVGDocument.getElementById(scratch).getAttribute("xlink:href").substr(2)) {
	    case "25":
	    case "50":
	    case "75":
	    case "100":
	    case "200":
	    case "rgo":
	    case "rfuel":
	    case "rtire":
	    case "rcrash":
	    case "scrash":
	    case "sfuel":
	    case "stire":
	    case "sgo":
	        playcard1("card"+mine);
		break;
	    case "hgo":
	    case "hfuel":
	    case "htire":
	    case "hcrash":
	          // FIXME rewrite phase 2
	          dohazard("card"+mine, 1);
	        break;

	    case "unlimit":
	        if(peels[0]["limit"]!="unlimit")
		  {
		    playcard1("card"+mine);
		  }
	        break;
	    case "limit":
	        dohazard("card"+mine, 1);
/*	          if((wars[1][1]=="unlimit")&&(wars[1][9]['row']=="no"))
		    { 
		      wars[1][1].push(hands[0].splice(count,1));
		      wars[1][1]="limit";
		      endturn();
		    }
*/	        break;

	    default:
	      return -1;
	  }

      }

    function repaint() {
	var count, count2, depth=Array(), mycard, mybox, scratch, scratch2;
      
        // Paint the discard pile
        SVGDocument.getElementById('distex').setAttribute("style", "opacity:"+dodiscard);
	for(count=0;count<discards.length;count++) {
	    scratch=discards[count];
	    mycard=SVGDocument.getElementById(scratch);
	    if(mycard.parentElement == G_dump )
	      { G_hid.appendChild(mycard); }
	    G_dump.appendChild(mycard);
	    if(1) { // paint them in a fanned?
		scratch="translate(0,"+(25*count)+")";
		mycard.setAttribute("transform", scratch);
	      } else {
		mycard.removeAttribute("transform");
	      }
	  }

	for(count2=0;count2<players;count2++) {
	  // Paint the players hands
	  scratch="hand"+count2;
	  mybox=SVGDocument.getElementById(scratch);
	  for(count=hands[count2].length-1;count>=0;count--) {
	      scratch=hands[count2][count];
	      mycard=SVGDocument.getElementById(scratch);
	      scratch=190*count;
	      scratch="translate("+scratch+",0)";
	      mycard.setAttribute("transform", scratch);
	      if(mycard.parentElement != mybox )
	        { mybox.appendChild(mycard); }
	    }

	    // Paint the milestones
	    scratch="miles"+count2;
	    mybox=SVGDocument.getElementById(scratch);
	    for(count=4;count>=0;count--)
	      { depth[count]=0; }
	    for(count=wars[count2][2].length-1;count>=0;count--) {
		scratch=wars[count2][2][count];
		mycard=SVGDocument.getElementById(scratch);
		scratch=mycard.getAttribute("xlink:href");
		switch(scratch) {
		    case "#p25":  scratch2=0; break;
		    case "#p50":  scratch2=1; break;
		    case "#p75":  scratch2=2; break;
		    case "#p100": scratch2=3; break;
		    case "#p200": scratch2=4; break;
		    default:
			scratch2=5;
		  }
		  mybox.appendChild(mycard);
		scratch="translate("+(190*scratch2)+","+(25*(depth[scratch2]))+")";
		mycard.setAttribute("transform", scratch);
		depth[scratch2]++;
	      }

	    // Paint the battle piles
	    scratch="bat"+count2;
	    mybox=SVGDocument.getElementById(scratch);
	    for(count=0;count<wars[count2][3].length;count++) {
		scratch=wars[count2][3][count];
		mycard=SVGDocument.getElementById(scratch);
		mycard.removeAttribute("transform");
		if(mycard.parentElement != mybox )
		  { mybox.appendChild(mycard); }
	      }

	    // Paint the limit piles
	    scratch="limit"+count2;
	    mybox=SVGDocument.getElementById(scratch);
	    for(count=0;count<wars[count2][1].length;count++) {
		scratch=wars[count2][1][count];
		mycard=SVGDocument.getElementById(scratch);
		mycard.removeAttribute("transform");
		if(mycard.parentElement != mybox )
		  { mybox.appendChild(mycard); }
	      }

	    // paint the safeties pile
	    scratch="safe"+count2;
	    mybox=SVGDocument.getElementById(scratch);
	    for(count=wars[count2][4].length-1;count>=0;count--) {
		scratch=wars[count2][4][count];
		mycard=SVGDocument.getElementById(scratch);
		if(mycard.parentElement != mybox )
		  { mybox.appendChild(mycard); }
		scratch2=mycard.getAttribute("xlink:href");
		scratch2=scratch2.substr(2);
		if(peels[count2][scratch2]=="yes") { scratch="translate("+(25*count)+","+(25*count)+")"; }
		  else { scratch="translate("+(25*count)+","+(185+25*count)+") rotate(270)"; }
		mycard.setAttribute("transform", scratch);
	      }
	  }
      }


function inot(evt) {

 var foo,Rppad,style,offsets=[[10,10],[10,710],[10,1410],[1800,10],[1800,710],[1800,1410]];
 Rppad=[{'y':0,'rx':11,'ry':11,'width':182,'height':254,'style':'stroke:white;stroke-width:2;fill:none'},{'x':-5,'y':-5,'rx':11,'ry':11}];
 var i,x=2;
 style=['fill:green;opacity:0.3','fill:red;opacity:0.3','fill:red;opacity:0.3','fill:red;opacity:0.3','fill:red;opacity:0.3','fill:red;opacity:0.3','fill:red;opacity:0.3']
 for(i=0;x>i;i++){
 foo=['g',{'transform':'translate('+offsets[i][0]+','+offsets[i][1]+')','id':'player'+i},['g',{'transform':'translate(10,329)','id':'safe'+i},['rect',Rppad[1],{'width':339,'height':339,'style':style[i]}]],['g',{'transform':'translate(400,329)','id':'miles'+i},['rect',Rppad[1],{'width':955,'height':365,'style':style[i]}],['rect',Rppad[0],{'x':0}],['rect',Rppad[0],{'x':190}],['rect',Rppad[0],{'x':380}],['rect',Rppad[0],{'x':570}],['rect',Rppad[0],{'x':760}]],['g',{'transform':'translate(400,10)','id':'hand'+i},['rect',Rppad[1],{'width':1145,'height':264,'style':style[i]}],['rect',Rppad[0],{'x':0}],['rect',Rppad[0],{'x':190}],['rect',Rppad[0],{'x':380}],['rect',Rppad[0],{'x':570}],['rect',Rppad[0],{'x':760}],['rect',Rppad[0],{'x':950}]],['g',{'transform':'translate(10,10)','id':'bat'+i},['rect',Rppad[1],{'width':379,'height':264,'style':style[i]}],['rect',Rppad[0],{'x':0}],['rect',Rppad[0],{'x':190}],['g',{'transform':'translate(187,0)','id':'limit'+i}]]];
    document.getElementById('hub').appendChild(jqmlsvg(foo));
  }
 init(evt);
 return 5;
 jqmlsvg([]);
}
