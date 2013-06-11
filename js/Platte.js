function Platte(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder); // richtiges erben
	this.name = name;
	this.setDraggable(draggable);
	this.AUS = 0;
	this.ERSTESTUFE = 1;
	this.ZWEITESTUFE = 2;
	this.DRITTESTUFE = 3;
	this.status = this.AUS;
	this.pot = null;
}

Platte.prototype = new VisualRenderObject();	// richtiges erben
Platte.prototype.constructor = Platte;			// richtiges erben

Platte.prototype.potZuweisen = function(pot) {
	//prüfen ob platte beim zeitpunkt vom rauftun an ist und dann pot erhitzen
	this.pot = pot;
	if(this.status != this.AUS){
		this.pot.platteTemp=this.status;
		this.pot.changeState(this.pot.HEATING1);
	}
}
Platte.prototype.potRunter = function(pot) {
	this.pot.changeState(this.pot.COOLING);
	this.pot.platteTemp = this.AUS;
	this.pot = null;
}
Platte.prototype.changeState = function() {
	//switch um den status der Platte zu steuern
		switch(this.status){
			case this.AUS:this.status=this.ERSTESTUFE;
				if(this.pot!=null){
					this.pot.changeState(this.pot.HEATING1);
				}
			break;
			case this.ERSTESTUFE:this.status=this.ZWEITESTUFE;
				if(this.pot!=null){					
					//plattentemp übergeben, problem mit zu schnell erhitzen in erhitzen oder vor dem switch regeln
					//this.pot.platteTemp = this.ZWEITESTUFE ?!
				}
			break;
			case this.ZWEITESTUFE:this.status=this.DRITTESTUFE;
				if(this.pot!=null){
					//plattentemp übergeben
				}
			break;
			case this.DRITTESTUFE:this.status=this.AUS;
				if(this.pot!=null){
					//plattentemp übergeben
					this.pot.changeState(this.pot.COOLING);					
				}
			break;
			default: ;
		}
	console.log('platte.changestate:' + this.status);
};


