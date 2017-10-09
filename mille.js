    var XLINKns="http://www.w3.org/1999/xlink";
    var SVGns="http://www.w3.org/2000/svg";
    var SVGDocument;
    var G_dump, G_hid;
    var decksize=0, mode, lastcard;
    var players=2;
    var turn;
    var dodiscard=0, discards=new Array();
    var hands=new Array();
    var undrawn=new Array();
    var extensions=new Array(700, 1000);
    var extended;
    var clock;
    var R_vici;
    var disambu=new Array(Array("prcrash", "prfuel", "prtire", "prgo",	"punlimit"),
			  Array("phcrash", "phfuel", "phtire", "phgo",	"plimit"),
			  Array("pscrash", "psfuel", "pstire", "psgo",	"psgo"),
			  Array("crash", "empty", "flat", "stop", "speed limit"));
//    var cards=new Array(new Array(10, 10, 10, 0, 0, 6, 6, 6, 14, 6, 3, 3, 3, 5, 4, 0, 0, 0, 0),
    var cards=new Array(new Array(10, 10, 10, 12, 4, 6, 6, 6, 14, 6, 3, 3, 3, 5, 4, 1, 1, 1, 1),
                 new Array("p25", "p50", "p75", "p100", "p200", 
		           "prcrash", "prfuel", "prtire", "prgo", "punlimit",
			   "phcrash", "phfuel", "phtire", "phgo", "plimit",
			   "pscrash", "psfuel", "pstire", "psgo"));
    var wars=[],peels=[]; // array of objects [player][prevscore/distance/state of {limit,battle,distance,safety} piles]
    /* wars first dimension players
    // second dimension columns
    // [1] stack of limits
    // [2] stack of miles
    // [3] stack of roll/battle cards
    // [4] stack of safety cards
    */


      function init(evt) {
         SVGDocument = evt.target.ownerDocument;
	 G_dump=SVGDocument.getElementById("dump");
	 G_hid=SVGDocument.getElementById("hide");
	 R_vici=SVGDocument.getElementById("vici");

	 for(count=0;count<cards[0].length;count++) {
	     scratch="#"+cards[1][count];
	     for(count2=0;count2<cards[0][count];count2++) {
	         scratch2="card"+decksize;
		 undrawn[decksize]=scratch2;
	         mycard=SVGDocument.createElementNS(SVGns, "use");
		 mycard.setAttributeNS(XLINKns, "xlink:href", scratch);
		 mycard.setAttribute("class", cards[1][count]);
		 mycard.setAttribute("id", scratch2);
//		 scratch2="translate(0,"+(25*decksize)+")";
//		 mycard.setAttribute("transform", scratch2);
		 G_hid.appendChild(mycard);
		 scratch2="click("+decksize+");";
		 mycard.setAttribute("onclick", scratch2);
	         decksize++;
	       }
	   }

	 set();
      }
    function reset() {
        var whom, phase, inner, mycard;
	console.log("beginning new round");
	G_hid.appendChild(R_vici);
        for(whom=0;whom<players;whom++) {
	    
	    peels[whom]={'sgo':'no','stire':'no','sfuel':'no','scrash':'no'
			,'oldscore':peels[whom].oldscore
			,'distance':0,'limit':'unlimit','battle':'stop'};
	    for(phase=4;phase>0;phase--) {
	        while(wars[whom][phase].length>0) {
		   inner=wars[whom][phase][0];
		   undrawn.push(inner);
		   wars[whom][phase].splice(0,1);
		   mycard=SVGDocument.getElementById(inner);
		   G_hid.appendChild(mycard);
		  }
	      }
	    while(hands[whom].length>0) {
		inner=hands[whom][0];
		undrawn.push(inner);
		hands[whom].splice(0,1);
		mycard=SVGDocument.getElementById(inner);
		G_hid.appendChild(mycard);
	      }
	  }
	while(discards.length>0) {
	    inner=discards[0];
	    undrawn.push(inner);
	    discards.splice(0,1);
	    mycard=SVGDocument.getElementById(inner);
	    G_hid.appendChild(mycard);
	  }

	 for(whom=0;whom<players;whom++) {
	     hands[whom]=[];
	     while((hands[whom].length<6)&&(undrawn.length>0))
		{ hands[whom].push(drawcard()); }
	   }

	repaint();
	turn=0;
	mode=0;
	extended=0;
	lastcard="";
	
      }
    function set() {
         var count, count2, mycard, scratch, scratch2;
	 
	 for(count=0;count<players;count++) {
	    peels[count]={'sgo':'no','stire':'no','sfuel':'no','scrash':'no'
			,'oldscore':0
			,'distance':0,'limit':'unlimit','battle':'stop'};
	     wars[count]=[,[],[],[],[]];
	   }

	 for(count=0;count<players;count++) {
	     hands[count]=new Array();
	     while((hands[count].length<6)&&(undrawn.length>0))
		{ hands[count].push(drawcard()); }
	   }

	repaint();
	lastcard="";
	turn=0;
	mode=0;
	extended=0;
      }
    function playcard1(card) {
        var scratch, scratch2, scratch3, mycard;
	scratch2=hands[turn].indexOf(card);
	if(card!=hands[turn][scratch2]) { return -1; }
	mycard=SVGDocument.getElementById(card);
	scratch=mycard.getAttribute("xlink:href");
	scratch=scratch.substr(2);
	switch(scratch) {
	    case "25":
	    case "50":
	    case "75":
	    case "100":
	    case "200":
	      scratch=parseInt(scratch);
	      if((peels[turn].battle=="go")&&(peels[turn].distance<=extensions[extended]-scratch)) {
			scratch3=0;
			if(scratch==200) { //count 200 distances
			    scratch2=wars[turn][2].length-1;
			    while(scratch2>=0) {
				if(SVGDocument.getElementById(wars[turn][2][scratch2]).getAttribute("xlink:href")=="#p200")
				  { scratch3++; }
				scratch2--
			      }
			    if(scratch3>=2) { return -1; }
			  }
			if((peels[turn].limit!='unlimit')&&(scratch>50))
			{ return -1; }
			console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
			scratch2=hands[turn].indexOf(card);
			scratch3=hands[turn][scratch2];
			wars[turn][2].push(scratch3);
			hands[turn].splice(scratch2,1);
			peels[turn].distance+=scratch;
			lastcard=scratch;
			endturn();
			return 99;
		  } else { return -2; }
	      break;
	     case "rgo":
	     case "rfuel":
	     case "rtire":
	     case "rcrash":
	       scratch3='s'+scratch.substr(1);
	       if(peels[turn][scratch3]!="no") { return -2; }
	       scratch3=peels[turn].battle;
	       scratch3=disambu[3].indexOf(scratch3);
	       if(scratch3<0) { return -3; }
	       scratch3=disambu[0][scratch3];
	       if(scratch3==mycard.getAttribute("xlink:href").substr(1)) {
		   console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
		   scratch3=hands[turn][scratch2];
		   wars[turn][3].push(scratch3);
		   hands[turn].splice(scratch2,1);
		   if(scratch=="rgo") { peels[turn].battle="go"; }
		     else { peels[turn].battle="stop"; }
		   lastcard=scratch;
		   endturn();
		 }
	       break;
	    case "sgo":
	    case "stire":
	    case "sfuel":
	    case "scrash":
	      if(peels[turn][scratch]!="no") { return -2; }
	      console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
	      scratch3=hands[turn][scratch2];
	      wars[turn][4].push(scratch3);
	      hands[turn].splice(scratch2,1);
	      peels[turn][scratch]="yes";
	      fakesafeties();
	      lastcard=scratch;
	      endturn();
	      break;
	    case "unlimit":
	      if(peels[turn].limit=="unlimit")
	        { return -1; }
	      console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
	      scratch3=hands[turn][scratch2];
	      wars[turn][1].push(scratch3);
	      hands[turn].splice(scratch2,1);
	      peels[turn].limit="unlimit";
	      lastcard=scratch;
	      endturn();
	      break;
	  }
      }
    function dohazard(card, vict) {
        var scratch, scratch2, scratch3, mycard, href;
	scratch2=hands[turn].indexOf(card);
	if(card!=hands[turn][scratch2]) { return -1; }
	mycard=SVGDocument.getElementById(card);
	scratch=mycard.getAttribute("xlink:href");
	scratch=scratch.substr(2);
	switch(scratch) {
	    case "hgo":
	    case "hfuel":
	    case "htire":
	    case "hcrash":
	       scratch3='s'+scratch.substr(1);
	       if(peels[vict][scratch3]!="no") { return -2; }
	       if(peels[vict].battle!="go") { return -1; }
	       href=disambu[1].indexOf("p"+scratch);
		   console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
		   scratch3=hands[turn][scratch2];
		   wars[vict][3].push(scratch3);
		   hands[turn].splice(scratch2,1);
		   peels[vict].battle=disambu[3][href];
		   lastcard=disambu[3][href]; // stop crash empty flat
		   trycoup(vict);
		   endturn();
		   return 99;
	       break;
	    case "limit":
	       // foo()
	       if((peels[vict].limit!="unlimit")||(peels[vict].sgo!="no"))
	           { return -1; }
		   console.log("player "+turn+": playing card #"+card.substr(4)+" "+scratch);
		   scratch3=hands[turn][scratch2];
		   wars[vict][1].push(scratch3);
		   hands[turn].splice(scratch2,1);
	           peels[vict].limit="limit";
		   endturn();
	           return 99;
	       break;
	  }
      }
      
    function assessvictory() {
        var x;
	for(x=players-1;x>=0;x--) { 
	    if(peels[x].distance==extensions[extended]) {
		SVGDocument.getElementById("player"+turn).appendChild(R_vici);
		mode=5;
	      }
	  }
    }
    function doscore() {
        var x, y=0, z, b, card, scratch;
	for(x=players-1;x>=0;x--) { if(peels[x].distance==extensions[extended]) { scratch++; z=x; } }
        if(scratch==0) {
	    return;
	  }
	scratch="player"+z;
	scratch="player "+z+"  -- claim victory";
	console.log(scratch);
	for(x=players-1;x>=0;x--) {
		// 1 point/mile
		peels[x].oldscore+=peels[x].distance;
		console.log("Player "+x+":  adding "+peels[x].distance+" points for distance -- newscore "+peels[x].oldscore);

		b=0;
		// FIXME rewrite into a loop and lint expresions
		// peels[x][disabmu[2][scratch].substr(1)]
		for(y=0;y<4;y++) {
		    scratch=disambu[2][y]
		    scratch=scratch.substr(1);
		    if(peels[x][scratch]=="yes") { b++; peels[x]['oldscore']+=100; console.log("Player "+x+":  adding 100 points for playing a safety ("+scratch+") -- newscore "+peels[x]['oldscore']); } 
		      else if(peels[x][scratch]=="coup") { b++; peels[x]['oldscore']+=400; console.log("Player "+x+":  adding 400 points for getting a luck stroke ("+scratch+") -- newscore "+peels[x]['oldscore']); }
		  }

		// 300 points for getting all safeties
		if(b==4) {
		  peels[x]['oldscore']+=300;
		  console.log("Player "+x+":  adding 300 points for getting 4 safeties -- newscore "+peels[x]['oldscore']);
		}

		if(peels[x]['distance']==extensions[extended]) {
		    // for winning the round
		    peels[x]['oldscore']+=400;
		    console.log("victor "+x+":  adding 400 points for winning the round -- newscore "+peels[x]['oldscore']);

		    // 300 points if completed after draw pile exhausted
		    if(undrawn.length==0) {
		        peels[x]['oldscore']+=300;
		        console.log("victor "+x+":  adding 300 points for delayed action -- newscore "+peels[x]['oldscore']);
		      }

		    // if completed after extension
		    if((extended==1)&&(peels[x]['distance']==extensions[1])) {
		        peels[x]['oldscore']+=200;
		        console.log("victor "+x+":  adding 200 points for extension -- newscore "+peels[x]['oldscore']);
		    }

		    // 500 points if no one else has played distance
		    b=0;
		    for(z=players-1;z>=0;z--) { b+=peels[z]['distance']; }
		    if(b==peels[x]['distance']) {
		        peels[x]['oldscore']+=500;
		        console.log("victor "+x+":  adding 500 points for shut out -- newscore "+peels[x]['oldscore']);
		      }

		    // 300 points if no 200 distance played
		    b=0;
		    for(z=scratch=wars[x][2].length-1;z>=0;z--) {
			scratch=wars[x][2][z];
			card=SVGDocument.getElementById(scratch);
			scratch=card.getAttribute("xlink:href");
			if(scratch=="#p200") {b++;}
		      }
		    if(b==0) {
			peels[x]['oldscore']+=300;
			console.log("victor "+x+":  adding 300 points for safe trip -- newscore "+peels[x]['oldscore']);
		      }
		  }
	  }
	reset();
      }
    function trycoup(me) {
	var handdump=[],x,y,z;
	for(count=0;count<hands[me].length;count++) {
	    x=hands[me][count];
	    y=SVGDocument.getElementById(x);
	    z=y.getAttribute("xlink:href");
	    handdump[count]=z.substr(2);
	  }
	switch(lastcard) { //try for a Coup-fourré
	    case "stop":
	    case "crash":
	    case "flat":
	    case "empty":
	      x=disambu[1].indexOf(lastcard);  // get effect# of lastcard
	      y=handdump.indexOf(disambu[2][x]); // get safety# from effect#
	      z=handdump.indexOf(y); // look for safety card place in hand 
	      if(handdump[z]==y) {  // do we have the safety in this hand?
		  wars[me][4].push(hands[1].splice(count,1));
		  peels[me][scratch]="coup";
		  lastcard=scratch;
		  done=1;
	        }
	}
      }
    function compmove() {
        var count, scratch, scratch2, done, x, handdump=new Array;

	if(mode!=0) { return -4; } // exit if the game is not running
	x="player "+turn+": entering compmove()";
	console.log(x);
	while((hands[turn].length<6)&&(undrawn.length>0))
	  { hands[turn].push(drawcard()); }
        repaint();
	x="";
	for(count=0;count<hands[turn].length;count++) {
	    scratch=hands[turn][count];
	    scratch2=SVGDocument.getElementById(scratch);
	    scratch=scratch2.getAttribute("xlink:href");
	    handdump[count]=scratch.substr(2);
	    x=x+" "+scratch.substr(2);
	  }
	done=0;
	console.log("player "+turn+": hand ["+x+" ]");
//	if(done==0) {  // if we didn't get a Coup-fourré
	scratch=peels[turn]['battle'];
	switch(scratch) { // and if we're stuck then try to get unstuck
		case "stop":
		case "crash":
		case "flat":
		case "empty":
		  scratch=disambu[3].indexOf(scratch); // get effect# of battle pile
		  scratch2=disambu[2][scratch].substr(1);  // get the safety from the effect
		  scratch2=handdump.indexOf(scratch2);  // get card place in hand from safety
		  if(scratch2>=0) { 
		      playcard1(hands[turn][scratch2]);
		      return;
		    } else {
		      scratch2=disambu[0][scratch].substr(1);  // get the remedy from the effect
		      scratch2=handdump.indexOf(scratch2);  // get card place in hand from remedy
//		      scratch=handdump.indexOf(disambu[0][scratch2]);
		      if(scratch2>=0) {
			  playcard1(hands[turn][scratch2]);
			  return;
			}
		    }
		  break;
	      }
//	    }

	// if computer is speed limited
	// try playing right-of-way or unlimit
	if(peels[turn]['limit']!="unlimit") {
	    scratch2=disambu[2][4].substr(1);
	    scratch2=handdump.indexOf(scratch2);
	    if(scratch2>=0) {
		playcard1(hands[turn][scratch2]);
		return;
	      } else {
		scratch2=disambu[0][4].substr(1);
		scratch2=handdump.indexOf(scratch2);
		if(scratch2>=0) {
		     playcard1(hands[turn][scratch2]);
		     return;
		  }
	      }
	  }

  // play random safeties
  for(count=disambu[2].length-1;count>=0;count--) {
      scratch=disambu[2][count].substr(1);
      if(peels[turn][scratch]=="no") {
	  scratch2=handdump.indexOf(scratch);
	  if(scratch2>=0) {
	      playcard1(hands[turn][scratch2]);
	      return;
	    }
	}
    }

        // Play the miles if we can go
        if(peels[turn]['battle']=="go") {
	    if(peels[turn]['limit']=="unlimit") {
	        scratch2=200;
	      } else {
		scratch2=peels[turn]['limit'];
		scratch2=parseInt(scratch2);
	      }
	    for(count=4;count>=0;count--) {
	        scratch=cards[1][count].substr(1);
		x=parseInt(scratch);
		if(((x+peels[turn]['distance'])<=extensions[extended])&&(scratch2>=x)) {
		    x=handdump.indexOf(scratch);
		    if(x>=0) {
		        if(playcard1(hands[turn][x])==99)
			{ return; }
		      }
		  }
	      }
          }

        if(peels[0]['battle']=="go") { // try to play some hazards
            for(count=0;count<5;count++) {
	        scratch=disambu[1][count];
		scratch=scratch.substr(1);
	        scratch=handdump.indexOf(scratch);
		scratch2=disambu[2][count];
		scratch2=scratch2.substr(1);
	        if((scratch>=0)&&(peels[0][scratch2]=="no")) {
		    if(dohazard(hands[1][scratch], 0)==99) {
		        return 99;
		      } else {
		        console.log("player "+turn+":  failed to hazard player 0");
		      }
		  }
	      }
	  }

  // discard remedies for played safeties
  for(count=disambu[2].length-1;count>=0;count--) {
      scratch=disambu[2][count].substr(1);
      if(peels[turn][scratch]!="no") {
	  scratch=disambu[0][count].substr(1);
	  scratch2=handdump.indexOf(scratch);
	  if(scratch2>=0) {
	      discard(hands[turn][scratch2]);
	      return;
	    }
	}
    }


  // discard hazarda for enemy played safeties
  for(count=disambu[2].length-1;count>=0;count--) {
      scratch=disambu[2][count].substr(1);
      if(peels[0][scratch]!="no") {
	  scratch=disambu[turn][count].substr(1);
	  scratch2=handdump.indexOf(scratch);
	  if(scratch2>=0) {
	      discard(hands[turn][scratch2]);
	      return;
	    }
	}
    }


	discard(hands[turn][0]);
	return;
      }
