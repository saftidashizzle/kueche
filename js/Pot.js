function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name, animObj) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderAnimation.call(this, context, sx, sy, w, h, imgPath, zOrder, animObj); // richtiges erben
	this.name = name;
	this.ingredients = [];
	this.setDraggable(draggable);

	this.raumKaelte = 0.015;
	this.platteTemp = 0;
	this.MIN_TEMP = 8;
	this.MAX_TEMP = 100;
	this.temp = this.MIN_TEMP;
	this.KALT = this.MIN_TEMP;
	this.WARM = 20;
	this.HEISS = 50;
	this.KOCHEN = 90;
	this.status = this.KALT;
}

Pot.prototype = Object.create(VisualRenderAnimation.prototype);	// richtiges erben
Pot.prototype.constructor = Pot;			// richtiges erben

Pot.prototype.setIngredient = function(ingredient) {
	this.ingredients.push(ingredient);
};

Pot.prototype.changeState = function(platteTemp) {
	this.platteTemp = platteTemp/60;
	console.log('Plattentemp: ' + this.platteTemp);	
	console.log('topfhitze: ' + this.temp);	
	console.log('Zutat #1: ' + this.ingredients[0].name);
};

Pot.prototype.update = function() {
	if(this.platteTemp<=0){
		if(this.temp>this.MIN_TEMP){
			this.temp = this.temp-this.raumKaelte;
		}
	}
	if(this.temp<100){
		this.temp = this.temp+this.platteTemp;
	}
	//console.log('stufe: ' + this.temp);
	// in der kitchen fuer jeden pot einmal aufrufen - passiert dann 60*/s
	// In der
//	update Methode des Pots, wird je nach Status (kalt, am Erhitzen,...) entschieden, ob die
//	aktuelle Temperatur um 1 Grad erhöht oder verringert wird oder nichts passieren soll.
	
	if((this.temp>=this.KALT+2)&&(this.temp<this.WARM)&&(this.status!=this.KALT)){
		this.changeAnimSequence("cold");
		this.status=this.KALT;
			
	}
	if((this.temp>this.WARM)&&(this.temp<this.HEISS)&&(this.status!=this.WARM)){
		this.changeAnimSequence("cooling");
		this.status=this.WARM;
	}
	if((this.temp>this.HEISS)&&(this.temp<this.KOCHEN)&&(this.status!=this.HEISS)){
		this.changeAnimSequence("heating");
		this.status=this.HEISS;
	}
	if((this.temp>this.KOCHEN)&&(this.status!=this.KOCHEN)){
		this.changeAnimSequence("boiling");
		this.status=this.KOCHEN;
	}
};


// animobj uebergeben