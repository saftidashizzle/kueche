function Tuer(context, sx, sy, w, h, imgPath, zOrder, draggable, name, animObj) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder, animObj); // richtiges erben
	this.name = name;
	this.setDraggable(draggable);

}

Tuer.prototype = new VisualRenderObject();	// richtiges erben
Tuer.prototype.constructor = Tuer;			// richtiges erben

Tuer.prototype.changeVisibility = function(){
	/*	funktion die die Tür von halbtransparent auf den transparent sprite setzt
	*	löscht tür
	* bei mouseout wird tür neu erstellt
	*/
};