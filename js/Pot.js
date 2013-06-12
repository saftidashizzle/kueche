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
	this.COOLING = 9; // wenn die temperatur erreicht ist setze topf auf kalt und anim weg
	this.status = this.COLD;
	this.topfKochtSnd = new Audio('./sound/kochendesWasser.ogg');
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
	this.status=targetStatus;
	switch (this.status) {
		case this.COLD: 
			this.changeAnimSequence("cold");
			break;
		case this.HEATING1:;
			this.changeAnimSequence("heating");
			this.topfKochtSnd.play();
			break;
		case this.HEATING2:
			this.changeAnimSequence("heating");
			break;
		case this.BOILING: 
			this.changeAnimSequence("boiling");
			break;
		case this.COOLING:
			this.changeAnimSequence("cooling");
			this.topfKochtSnd.pause();
			break;
		default:;
	}
	console.log('Status: ' + this.status + ' Temperatur: ' + this.temp);	
	
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
	this.platteTempFaktor = this.platteTemp/30;
	if(this.temp<=this.HEATING2){
		this.temp = this.temp+this.platteTempFaktor;
	} else{
		this.changeState(this.HEATING2);
	}
};
Pot.prototype.erhitzen2 = function() {
	if(this.temp<=this.BOILING){
		this.temp = this.temp+this.platteTempFaktor;
	} else{
		this.changeState(this.BOILING);
	}
};
Pot.prototype.kuehlen = function() {
	if(this.temp>=this.COOLING){
		this.temp = this.temp-this.platteTempFaktor;
		
	} else{
		this.changeState(this.COLD);
		console.log('setze changeState auf cold');
	}
};