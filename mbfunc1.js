    function drawcard() {
        var scratch, scratch2;
        scratch=Math.floor(Math.random()*undrawn.length);
	scratch2=undrawn[scratch];
	undrawn.splice(scratch,1);
	return scratch2;
      }

      function prepdiscard() {
        dodiscard=1-dodiscard;
	repaint();
      }

    function discard(card) {
        dodiscard=0;
        var scratch, scratch2;
	if(hands[turn].length<1) {
	    console.err("Player "+turn+": Can not discard() -- hand is empty");
	    return -1;
	  }
	if(card.length<5) {
	    console.err("Player "+turn+": Can not discard() -- card = ("+card+")");
	    return -1;
	  }
	scratch2="player "+turn+": discarding card #"+card.substr(4)+" "+SVGDocument.getElementById(card).getAttribute("xlink:href");
	console.info(scratch2)
	scratch2=hands[turn].indexOf(card);
	if(card==hands[turn][scratch2]) {
	        scratch=hands[turn][scratch2];
		discards.push(scratch);
		hands[turn].splice(scratch2,1);
		endturn();
		return 99;
	  }
	return -1;
      }

    function endturn() {
        dodiscard=0;
	fakesafeties();
	repaint();
	assessvictory();
        if(mode!=0)
          { return 99; }
	while((hands[turn].length<6)&&(undrawn.length>0))
	  { hands[turn].push(drawcard()); }
	repaint();
	turn++;
	if(turn>=players)
	  { turn=0; }
	  else 
	    { compmove(); }
//	if(mode==0) {
//	    clock=setTimeout(function(){compmove();},2000)
//	  }
      }

    function fakesafeties() {
	var x;
	for(x=players-1;x>=0;x--) {
		// badly apply safeties to the battle/limit piles
		if((peels[x]['limit']=="limit")		&&(peels[x]['sgo']!="no")) {
		    peels[x]['limit']="unlimit";
		    console.debug("player "+x+":  removing limit");
		  }
		if((peels[x]['battle']=="flat")		&&(peels[x]['stire']!="no")) {
		    peels[x]['battle']="stop";
		    console.debug("player "+x+":  removing flat");
		  }
		if((peels[x]['battle']=="empty")	&&(peels[x]['sfuel']!="no")) {
		    peels[x]['battle']="stop";
		    console.debug("player "+x+":  removing empty");
		  }
		if((peels[x]['battle']=="accident")	&&(peels[x]['scrash']!="no")) {
		    peels[x]['battle']="stop";
		    console.debug("player "+x+":  removing crash");
		  }
		if((peels[x]['battle']=="stop")		&&(peels[x]['sgo']!="no")) {
		    peels[x]['battle']="go";
		    console.debug("player "+x+":  removing stop");
		  }
	  }
      }
function tryextend() {
  if(mode==0) {return -1;}
  if(extended<extensions.length-1) {
      extended++;
      G_hid.appendChild(R_vici);
      mode=0;
      endturn;
    }
}
