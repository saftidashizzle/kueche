function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name, animObj) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderAnimation.call(this, context, sx, sy, w, h, imgPath, zOrder, animObj); // richtiges erben
	this.name = name;
	this.ingredients = [];
	this.setDraggable(draggable);

	this.raumKaelte = 0.015;
	this.platteTemp = 0; // stufe
	this.MIN_TEMP = 8;
	this.MAX_TEMP = 100;
	this.temp = this.MIN_TEMP;
	
	// min und max temp waren fuer die animation, alles ueber min und unter max temp war heating, darueber 
	// boiling, darunter kalt
	this.COLD = this.MIN_TEMP;
	this.HEATING1 = 8;
	this.HEATING2 = 50;
	this.BOILING = 95;
	this.COOLING = 20; // wenn die temperatur erreicht ist setze topf auf kalt und anim weg
	this.status = this.COLD;
	this.topfKochtSnd = new Audio('sound/kochendesWasser.ogg');
	this.topfAufPlatteSnd = new Audio('./sound/topfAufPlatteGesetzt.ogg');
	
	
}

// topf auf platte, platte an:
// status des topfs auf heating1
// ich geh in die update: switch (laeuft immer, nur bei cold passiert nix da)
// rufe methode auf erhitzen()
// in erhitzen(): wenn temperatur (heating2) erreicht ist: status = heating 2
// wenn der switch merkt, status = heating2 dann rufe methode erhitzen2() auf
// erhitzen2: macht das gleiche, wechselt dann aber status zu boiling

// wenn ich topf runternehme, oder knopf auf aus: status auf cooling setzen



Pot.prototype = Object.create(VisualRenderAnimation.prototype);	// richtiges erben
Pot.prototype.constructor = Pot;			// richtiges erben

Pot.prototype.setIngredient = function(ingredient) {
	this.ingredients.push(ingredient);
};

//statt changeState etwas bauen wo der Status des Topfes geändert wird. plattentemp ruhig einfach in der Platte ändern
Pot.prototype.changeState = function(targetStatus) {
	/*switch (this.status) {
		case this.COLD: this.status=this.HEATING1;
			this.changeAnimSequence("heating");
			topfKochtSnd.play();
			break;
		case this.HEATING1: this.status=this.HEATING2;
			this.changeAnimSequence("heating");
			break;
		case this.HEATING2: this.status=this.BOILING;
			this.changeAnimSequence("boiling");
			break;
		case this.BOILING: this.status=this.COOLING;
			this.changeAnimSequence("cooling");
			break;
		case this.COOLING: this.status=this.COLD;
			break;
		default:;
	}*/
	this.status=targetStatus;
	this.platteTempFaktor = this.platteTemp/60;
	console.log('Plattentemp: ' + this.platteTempFaktor);	
	console.log('topfhitze: ' + this.temp);	
	console.log('Pot.changeState, Status: ' + this.status);
	
	/*
	 * 	this.platteTempFaktor = platteTemp/60;
	console.log('Plattentemp: ' + this.platteTempFaktor);	
	console.log('topfhitze: ' + this.temp);	
//console.log('Zutat #1: ' + this.ingredients[0].name);
	if(this.platteTempFaktor<=0){
		if(this.temp>this.MIN_TEMP){
			this.temp = this.temp-this.raumKaelte;
		}
	}
	if(this.temp<100){
		this.temp = this.temp+this.platteTempFaktor;
	}
	//console.log('stufe: ' + this.temp);
	// in der kitchen fuer jeden pot einmal aufrufen - passiert dann 60 mal pro sekunde
	// In der
	//	update Methode des Pots, wird je nach Status (kalt, am Erhitzen,...) entschieden, ob die
	//	aktuelle Temperatur um 1 Grad erhöht oder verringert wird oder nichts passieren soll
	
	if((this.temp>=this.KALT+2)&&(this.temp<this.WARM)&&(this.status!=this.KALT)){
		
		this.changeAnimSequence("cold");
		this.status=this.KALT;
	}
	if((this.temp>this.WARM)&&(this.temp<this.HEISS)&&(this.status!=this.WARM)){
		// sound abspielen
		topfKochtSnd.play();
		this.changeAnimSequence("cooling");
		this.status=this.WARM;			
	}
	if((this.temp>this.HEISS)&&(this.temp<this.KOCHEN)&&(this.status!=this.HEISS)){
		topfKochtSnd.pause();
		this.changeAnimSequence("heating");
		this.status=this.HEISS;
	}
	if((this.temp>this.KOCHEN)&&(this.status!=this.KOCHEN)){
		this.changeAnimSequence("boiling");
		this.status=this.KOCHEN;
	}*/
	
};


			// methode aufrufen: heating()
			// hier wird der topf waermer, was vorher in der update war
			// wenn der schnittpunkt erreicht ist, dann wird status = boiling gesetzt
			
			// update ruft im switch erhitzen, bzw die andern auf (methode
			// in erhitzen: ist eine if (temperatur<20>
			// status ändern
			// die ruft die naechste methode auf
			
Pot.prototype.update = function() {

//zähler bauen damit nur bei jedem 5ten oder noch mehr durchgang gefragt wird (tempo drosseln)
	switch(this.status) {
		case this.HEATING1: this.erhitzen1();			
			break;
		case this.HEATING2: this.erhitzen2();			
			break;
		case this.COOLING: this.kuehlen();			
			break;			
		default: ;
	}	
};

Pot.prototype.erhitzen1 = function() {
	if(this.temp<=this.HEATING2){
		this.temp = this.temp+this.platteTempFaktor;
	} else{
		//in changestate animation und sound ändern (switch)
		this.changeState(this.HEATING2);
	}
};
Pot.prototype.erhitzen2 = function() {
	if(this.temp<=this.BOILING){
		this.temp = this.temp+this.platteTempFaktor;
	} else{
		//in changestate animation und sound ändern (switch)
		this.changeState(this.BOILING);
	}
};
Pot.prototype.kuehlen= function() {
	if(this.temp>=this.COOLING){
		this.temp = this.temp-this.platteTempFaktor;
	} else{
		//in changestate animation und sound ändern (switch)
		this.changeState(this.COLD);
	}
};
