function Tuer(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder); // richtiges erben
	this.name = name;
	this.setDraggable(draggable);

}

Tuer.prototype = new VisualRenderObject();	// richtiges erben
Tuer.prototype.constructor = Tuer;			// richtiges erben