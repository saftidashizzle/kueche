function Knob(context, sx, sy, w, h, imgPath, zOrder, draggable, name, platte) {
	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder); // richtiges erben
	this.name = name;
	this.setDraggable(draggable);
	this.AUS = 0;
	this.ERSTESTUFE = 1;
	this.ZWEITESTUFE = 2;
	this.DRITTESTUFE = 3;
	this.status = this.AUS;
	this.platte = platte;
}
Knob.prototype = new VisualRenderObject();	// richtiges erben
Knob.prototype.constructor = Knob;			// richtiges erben

//function ändert den Status, die Rotation des Knobs und informiert ihre Platte den Status zu ändern
Knob.prototype.changeState = function() {
	//switch um den status des Knobs zu steuern
	
	//bei erster Switch abfrage ist status nicht auslesbar deswegen wird default ausgeführt... HURENKIND
	switch(this.status){
		case this.AUS:this.status=this.ERSTESTUFE;
		break;
		case this.ERSTESTUFE:this.status=this.ZWEITESTUFE;
		break;
		case this.ZWEITESTUFE:this.status=this.DRITTESTUFE;
		break;
		case this.DRITTESTUFE:this.status=this.AUS;
		break;
		default:this.status=this.AUS;
	}
	this.setRotation(90+this.getRotation());
	this.platte.changeState();
	console.log('knob.changestate:' + this.status);
};