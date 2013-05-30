function Ingredient(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {

	// erben - aufruf von konstruktor funktion von visualRenderObject
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder); // richtiges erben
	this.name = name;
	this.setDraggable(draggable);
	

}

Ingredient.prototype = new VisualRenderObject();	// richtiges erben
Ingredient.prototype.constructor = Ingredient;			// richtiges erben