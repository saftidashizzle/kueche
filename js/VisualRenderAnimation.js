function VisualRenderAnimation(context, sx, sy, w, h, imgPath, zOrder, animObj){
	
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	
	this.animations = animObj;
	this.tileWidth = this.animations.image.tileWidth || w;
	this.tileHeight = this.animations.image.tileHeight || h;
	
	// max colums of tiles in the sprite image
	// needed to calculate x,y of the tile
	this.maxCols = this.animations.image.imgWidth / this.tileWidth || 1;
	
	// current animation to run
	this.currentAnimation = this.animations.animations["default"].seq || [0];
	// actual index of the current animation array
	this.currentAnimIndex = 0;
	
	// indicates if animation has to be looped
	this.loop = this.animations.animations["default"].loop || false;
	
	// animation interval in milliseconds
	this.animInterval = 120;
	// last time tile hast changed
	this.lastTileUpdateTime = 0;
}

VisualRenderAnimation.prototype = Object.create(VisualRenderObject.prototype);
// alle sachen die von visual render object erben muessen auch statt new object.create machen

VisualRenderAnimation.prototype.constructor = VisualRenderAnimation;

// draw funktion von visual render objekt überschreiben

VisualRenderAnimation.prototype.draw = function() {

	// in which col and row is te tile to draw
	var row = parseInt(this.currentAnimation[this.currentAnimIndex] / this.maxCols);
	var col = this.currentAnimation[this.currentAnimIndex] % this.maxCols;
	
	// calculate x, y, position of the tile
	var imgX = col * this.tileWidth;
	var imgY = row * this.tileHeight;
	
	// draw tile
	this.context.drawImage(this.img, imgX, imgY, this.tileWidth, this.tileHeight, this.x, this.y, this.width * 1, this.height * 1);
	
	var delta = Date.now() - this.lastTileUpdateTime;
	if(delta > this.animInterval) {
		this.nextAnimTile();
		this.lastTileUpdateTime = Date.now();
	}
};

/**
*	Calculate the next tile to draw
*
*/

VisualRenderAnimation.prototype.nextAnimTile = function() {
	if(this.currentAnimIndex + 1 < this.currentAnimation.length) {
		this.currentAnimIndex++;
	} else {
		if (this.loop){
			this.currentAnimIndex = 0;
		}
	}
};

/**
* change th curent animation sequence
* @param String seqName - name of the anim sequence
*/

VisualRenderAnimation.prototype.changeAnimSequence = function(seqName) {
	try {
		this.currentAnimation = this.animations.animations[seqName].seq;
		this.loop = this.animations.animations[seqName].loop;
		this.currentAnimIndex = 0;
	} catch (ex) { 
		console.log("No such animation sequence: " + seqName);
	}
};
