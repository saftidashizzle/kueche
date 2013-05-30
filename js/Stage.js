/**
 * 
 * Medieninformatik 2
 * (c) 2012 Bremen, Germany
 * Author: Yvonne Z�llner <yvonne.zoellner@hs-bremen.de>
 * Version 0.5
 * Changelog
 * V0.4: _checkTransparency: calling now draw method of VisualRenderObject/VisualAnimationObject, added some q&d moves
 * V0.5: layerX, layerY are deprecated. New function _calculateMousePos added to get mousePosition within the canvas 
 * 
 */
/**
 * The stage object. Renders the VisualRenderObject to the canvas, provides back buffer, and
 * handles mouse events in the canvas
 * Dragging is performed naturally by the stage, just add the VisualRenderObject to the stage. However the 
 * VisualRenderObject needs the "isDraggable()" function propery.
 * To other events register through "registerEvent". The registered objects must have the 
 * property: "on<Eventname>" (onDragstart, onMouseup,..), which will be called if the event occurs.
 * Provided Events:
 *'click','dragstart', 'dragend','dragging', 'mousedown', 'mouseup', 'mousemove'
 * 
 * @param canvasId - the id of the canvas element in the DOM
 */
function Stage(canvasId){
	// get the canvas element from the DOM
	this.theCanvas = document.getElementById(canvasId);
	this.context = this.theCanvas.getContext('2d');
	
	// set stage size
	this.stageWidth = this.theCanvas.width;
	this.stageHeight = this.theCanvas.height;	
	
	// create buffer canvas to prevent flickering. 
	// We draw into the buffer and then draw the buffer to the visible canvas
	this.buffer = document.createElement('canvas');
	this.buffer.width = this.stageWidth;
	this.buffer.height = this.stageHeight;
	this.bufferContext = this.buffer.getContext('2d');
	
	// make fake canvas element for checking transparent pixel on image
	// (for mouse actions: only react if user clicks at the img, not the graphic rect)
	this.tmpCanvas = document.createElement('canvas');
	//document.body.appendChild(this.tmpCanvas);
	this.tmpCxt = this.tmpCanvas.getContext('2d');
	
	// only in Gecko 1.9.2
	this.theCanvas.mozImageSmoothingEnabled = false;	
	
	// holds all the objects to render on the stage
	this.renderObjects = [];
	
	// dragging state
	this.dragging = false;
	// object on which an event occurred 
	this.currentMouseObj = null;
	// obervers are notices if the event occurs
	this.eventObservers = {'click':[],'dragstart':[], 'dragend':[],'dragging':[], 'mousedown':[], 'mouseup':[], 'mousemove':[]};
	
	
	
	// var needed for closures
	var stage = this;
	// add eventListener to the parent (positioned!) div
	this.theCanvas.parentNode.addEventListener('mousedown', function(e){
		
		// get the mouse position within the canvas
		var mousePos = stage._calculateMousePos(e.clientX, e.clientY);
		
		// check if mouse is over object
		stage.currentMouseObj = stage._getMouseObject(mousePos);
		// check if clicked pixel is is transparent, if so then nothing to do 
		if(stage._checkTransparency(mousePos)) return;
		
		// set dragging true if it is a draggable object
		if(stage.currentMouseObj != null && stage.currentMouseObj.isDraggable()){
			stage.dragging = true;
			stage.currentMouseObj.setDragPosition(mousePos);
			//e target is canvas parent div
			e.target.style.cursor = 'pointer';
			// notify registered objects about 'dragstart'
			stage.eventObservers['dragstart'].forEach( function(element, index, arr){
						
				// We use here "duck typing":
				// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
				// so check if "onDragstart" is a function
				//console.log(typeof(element.onDragstart));
				if(typeof(element.onDragstart) === "function"){
					element.onDragstart({'eventType':'dragstart','target':stage.currentMouseObj,'mouse':mousePos});
				}
					
			});
			
		}
		
		// get the normal mousedown event
		stage.eventObservers['mousedown'].forEach( function(element, index, arr){
						
			// We use here "duck typing":
			// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
			// so check if "onMousedown" is a function
			if(typeof(element.onMousedown) === "function"){
				element.onMousedown({'eventType':'mousedown','target':stage.currentMouseObj,'mouse':mousePos});
			}
					
		});
		
	
	} );
	
	this.theCanvas.parentNode.addEventListener('click', function(e){
		// get the mouse position within the canvas
		var mousePos = stage._calculateMousePos(e.clientX, e.clientY);
		// check if mouse is over object
		stage.currentMouseObj = stage._getMouseObject(mousePos);
		// check if clicked pixel is is transparent, if so then nothing to do 
		if(stage._checkTransparency(mousePos)) return;
		// notify registered objects about 'dragstart'
		stage.eventObservers['click'].forEach( function(element, index, arr){
				
			// We use here "duck typing":
			// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
			// so check if "onClick" is a function
			if(typeof(element.onClick) === "function"){
				element.onClick({'eventType':'click','target':stage.currentMouseObj,'mouse':mousePos});
			}
				
		});
	});
	
	this.theCanvas.parentNode.addEventListener('mousemove', function(e){
		// get the mouse position within the canvas
		var mousePos = stage._calculateMousePos(e.clientX, e.clientY);
		// if we are dragging some object, update position
		if(stage.dragging){
			stage.currentMouseObj.updateDragPosition(mousePos);	
			// notify registered objects about 'mouseup'
			stage.eventObservers['dragging'].forEach( function(element, index, arr){
					
				// We use here "duck typing":
				// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
				// so check if "onDragging" is a function
				if(typeof(element.onDragging) === "function"){
					element.onDragging({'eventType':'dragging','target':stage.currentMouseObj,'mouse':mousePos});
				}
					
			});

			
		}
		
		// notify registered objects about 'mousemove'
		stage.eventObservers['mousemove'].forEach( function(element, index, arr){
				
			// We use here "duck typing":
			// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
			// so check if "onMousemove" is a function
			if(typeof(element.onMousemove) === "function"){
				element.onMousemove({'eventType':'mousemove','target':stage.currentMouseObj,'mouse':mousePos});
			}
				
		});
		
	});
	
	this.theCanvas.parentNode.addEventListener('mouseup', function(e){
		
		// get the mouse position within the canvas
		var mousePos = stage._calculateMousePos(e.clientX, e.clientY);
		// check if clicked pixel is is transparent, if so then nothing to do 
		if(stage._checkTransparency(mousePos)) return;
		if(stage.dragging){
			stage.dragging = false;
			stage.currentMouseObj.updateDragPosition(mousePos);
			//e target is canvas parent div
			e.target.style.cursor = 'default';
			
			// notify registered objects about 'dragend'
			stage.eventObservers['dragend'].forEach( function(element, index, arr){
				
			// We use here "duck typing":
			// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
			// so check if "onDragend" is a function
			if(typeof(element.onDragend) === "function"){
				element.onDragend({'eventType':'dragend','target':stage.currentMouseObj,'mouse':mousePos});
			}
				
			});
			
		}		
		// notify registered objects about 'mouseup'
		stage.eventObservers['mouseup'].forEach( function(element, index, arr){
				
			// We use here "duck typing":
			// If it walks like a duck, and quacks like a duck, for all intents and purposes it's a duck. 
			// so check if "onMouseup" is a function
			if(typeof(element.onMouseup) === "function"){
				element.onMouseup({'eventType':'mouseup','target':stage.currentMouseObj,'mouse':mousePos});
			}
				
		});
	
	});
	
	
}

/**
 * Get the object on which the mouse event happened. Checks also if the mouse is over a draggable object.
 * @param mousePos Object - the actual mouse position
 * @return VisualRenderObject - the object on which the mouse event occurred
 */
Stage.prototype._getMouseObject = function(mousePos){
	var len = this.renderObjects.length;
	
	// renderObjects is sorted by zOrder with 'deepest' layer at index 0, and 'highest' layer at array.length-1
	// so we have check for object to drag from the highest layer to the deepest layer
	for(var i=len;i--;){
		
		// if no obj continue to next
		if(this.renderObjects[i] == null) continue;
		
		var objPos = this.renderObjects[i].getPosition();
		if((mousePos.x > objPos.x && mousePos.x < objPos.x + objPos.w) && (mousePos.y > objPos.y && mousePos.y < objPos.y + objPos.h)) {
			//console.log('mouseX:' + mousePos.x + ' mouseY:' + mousePos.y);
			//console.log('objX:' + objPos.x + ' objY:' + objPos.y);
			//console.log(this.renderObjects[i]);
			return this.renderObjects[i];
		}
			
	}
	return null;

};


/**
 * calculate the mouseposition within the canvas
 * @param screenX - the x position of the mouse in the browser 
 * @param screenY - the y position of the mouse in the browser
 * @return object - the x and y position { x:<xpos>, y:<ypos>}
 */ 
 Stage.prototype._calculateMousePos = function(screenX, screenY){
	// get the position of the canvas element within the browser window	
	var rect = this.theCanvas.getBoundingClientRect();
	// parseInt because some of the browser calculate half pixel
	var cx = parseInt(screenX - rect.left);
	var cy = parseInt(screenY - rect.top);
	
	return { x:cx, y:cy };
 
 };


/**
 * Checks the clicked object pixels alpha value. 
 * @param object mousePos - the position of the mouse on the canvas
 * @return boolean - true if pixel is transparent, false if pixel is opaque
 */
Stage.prototype._checkTransparency = function(mousePos){

	if(this.currentMouseObj == null) return;
	// clear and resize	
	this.tmpCanvas.width = this.currentMouseObj.width;
	this.tmpCanvas.height = this.currentMouseObj.height;
	
	if(this.currentMouseObj.img == null) return; // no image - no image data. View may be form....
	
	// down here goes dirty 
	// better: draw method need the context as param, so we could use the render function
	// properly and don't have to cheat like this
	// so context ist not given to the constructor function, but only to draw
	// -> maybe next version
	
	
	// set new context
	this.currentMouseObj.context = this.tmpCxt;
	
	// get the current x and y of the objects in the canvas
	var x=this.currentMouseObj.x;
	var y=this.currentMouseObj.y;
	
	this.currentMouseObj.x = 0;
	this.currentMouseObj.y = 0;
	// draw the object in the tmp canvas (with which we want to find out, if pixel ist transparent)
	this.currentMouseObj.draw();
	// reset the original x and y
	this.currentMouseObj.x = x;
	this.currentMouseObj.y = y;
	// reset context
	this.currentMouseObj.context = this.getContext();
	
	
	
	//this.tmpCxt.drawImage(this.currentMouseObj.img, 0, 0);
	var imageData = this.tmpCxt.getImageData(0,0, this.tmpCanvas.width, this.tmpCanvas.height);
	// translate the canvas mouse position to the pos on the image 
	var objx = mousePos.x - this.currentMouseObj.x;
	var objy = mousePos.y - this.currentMouseObj.y;
	// imageData.data: array with 4 values per Pixel: 0:R, 1:G, 2:B, 3: Alpha (all: values 0-255)
	// if img is 10 x 8px -> Array has 80px x 4 = 320 Entries, -1 because array index starts at 0;
	// get the index of the pixel
	var spot = ((objx + objy * this.currentMouseObj.width) * 4)-1;
	
	this.tmpCxt.clearRect(0, 0, this.currentMouseObj.width, this.currentMouseObj.height);
	return imageData.data[spot] === 0;

};

/**
 * Render the whole stage. The objects to be rendered had to be added 
 * to the stage by the function "addToStage" 
 *
 */
Stage.prototype.render = function(){
	
	// clear buffer and stage before rendering all the objects
	this.bufferContext.clearRect(0, 0, this.stageWidth, this.stageHeight);
	this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
	
	var len = this.renderObjects.length;
	if(len < 1) return;	// no objects to render
	
	for(var i=0; i<len;i++){
		if(this.renderObjects[i] == null) continue;
		// draw each element in the canvas by calling the view's draw method
		this.renderObjects[i].draw();
	}
	
	// draw the buffer canvas
	this.context.drawImage(this.buffer, 0, 0);
};
	
/**
 * Return the context object
 * @return the context 2D object (buffer)
 */
Stage.prototype.getContext = function(){
	return this.bufferContext;
};


/**
 * Reorder the objects to render on the stage. 
 * Objects are ordered by their zOrder property
 */
Stage.prototype.reorderRenderObjects = function(){
	var compare = function(a, b) {  
      if (a.zOrder < b.zOrder)  
         return -1;  
      if (a.zOrder > b.zOrder)  
         return 1;  
      // a must be equal to b  
      return 0;  
    };  
	
	// sort 
	this.renderObjects.sort(compare);
};


/**
 * Add a object to render to the stage
 * @param VisualRenderObject: the Object to be rendered
 */
Stage.prototype.addToStage = function(objToRender){
	// sorty by zOrder (0 down, higher up)	
	this.renderObjects.push(objToRender);
	
	// sort function to sorty by zOrder
	var compare = function(a, b) {  
      if (a.zOrder < b.zOrder)  
         return -1;  
      if (a.zOrder > b.zOrder)  
         return 1;  
      // a must be equal to b  
      return 0;  
    };  
	
	// sort 
	this.renderObjects.sort(compare);
	
};

/**
 * remove object to render from the stage
 * @param VisualRenderObject - the object to remove
 */
Stage.prototype.removeFromStage = function(objToRemove){
	var len = this.renderObjects.length;
	var tmp = [];
	
	for(var i=0;i<len;i++){
		if(!(objToRemove === this.renderObjects[i])){
			tmp.push(this.renderObjects[i]);
		}
	}
	
	this.renderObjects = tmp;

};

/**
 * register to an specific event. Observer object will be noticed when event occurs
 * @param String eventType - the type of the Event 
 * 				('click','dragstart', 'dragend','dragging', 'mousedown', 'mouseup')
 * @param object objToRegister - the object to receive the event message
 * @return boolean - true, if obj could be registered to eventType, false otherwise
 */
Stage.prototype.registerEvent = function(eventType, objToRegister){
	
	if(this.eventObservers.hasOwnProperty(eventType)){
		this.eventObservers[eventType].push(objToRegister);
		
		return true;
	}
	return false;
};



/**
 * unregister an object to a specific event
 * @param String eventType - the type of the Event 
 * 				('click','dragstart', 'dragend','dragging', 'mousedown', 'mouseup')
 * @param object objToRegister - the object to receive the event message
 * @return boolean - true, if obj could be unregistered to eventType, false otherwise
 */
Stage.prototype.unregisterEvent = function(eventType, objToUnregister){
	
	if(!this.eventObservers.hasOwnProperty(eventType)) return false;
	
	var len = this.eventObservers[eventType].length;
	var tmp = [];
	
	for(var i=0;i<len;i++){
		if(!(objToUnregister === this.eventObservers[i])){
			tmp.push(this.eventObservers[i]);
		}
	}
	
	this.eventObservers[evenType] = tmp;
	// nothing changed? then return false
	return (len == tmp.length) ? false : true;
};

