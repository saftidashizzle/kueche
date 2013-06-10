function Kitchen(canvasId){
	
	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;
	
	// create a new stage object
	this.stage = new Stage(canvasId);
	this.pots = [];
	this.ingredients = [];
	this.platten = [];
	
	var animObj = {
					"image" : 
					{
						"tilewidth": 160,
						"tileHeight": 180,
						"imgWidth": 640,
						"imgHeigth": 360
					},
					"animations":
					{
					"default":{ "seq":[0], "loop":false },
					"cold": {"seq":[0], "loop":false },
					"heating": {"seq":[1,2,3,3,2], "loop":true },
					"cooling": {"seq":[1,1,2,3,2], "loop":true },
					"boiling":{"seq":[4,5,6,7], "loop":true}
					}
				};
	// pot hinzufügen
	
	// hier die groesse des tiles angeben, anstatt bild groesse, außerdem img pfad: sprite grafik und animObj uebergeben
	var p1 = new Pot(this.stage.getContext(), 300, 280, 160, 180, "images/pot_anim.png", 19, true, "pot", animObj);
	this.pots.push(p1);
	this.stage.addToStage(p1);
	
	// zutaten hinzufügen
	
	var i1 = new Ingredient(this.stage.getContext(), 0, 0, 101, 76, "images/nudel.png", 21, true, "nudel");
	this.ingredients.push(i1);
	this.stage.addToStage(i1);	
	var i2 = new Ingredient(this.stage.getContext(), 0, 0, 111, 134, "images/zwiebel.png", 22, true, "zwiebel");
	this.ingredients.push(i2);
	this.stage.addToStage(i2);
	var i3 = new Ingredient(this.stage.getContext(), 200, 200, 141, 142, "images/tomate.png", 23, true, "tomate");
	this.ingredients.push(i3);
	this.stage.addToStage(i3);
	
	// herdplatten und schalter hinzufügen
	
	var platte1 = new Platte(this.stage.getContext(), 440, 470, 242, 85, "images/platte.png", 18, false, "platte");
	this.stage.addToStage(platte1);
	this.platten.push(platte1);
	var knob1 = new Knob(this.stage.getContext(), 530, 550, 58, 58, "images/knob.png", 18, false, "knob", platte1);
	this.stage.addToStage(knob1);			
	var platte2 = new Platte(this.stage.getContext(), 140, 470, 242, 85, "images/platte.png", 18, false, "platte");
	this.stage.addToStage(platte2);
	this.platten.push(platte2);
	var knob2 = new Knob(this.stage.getContext(), 230, 550, 58, 58, "images/knob.png", 18, false, "knob", platte2);
	this.stage.addToStage(knob2);
	// rezept einbinden
	// REF auf ul Element
	var rezeptListElement = document.querySelector('#rezept-list');
	var rezeptDetailsElement = document.querySelector('#rezept-details');
	
	
	Ajax.getJSON('http://localhost/kueche/js/rezepte.json', function(data){
		
		data.rezepte.forEach(function(rezept){
			// li erzeugen
			var rezeptElement = document.createElement('li');
			// text erzeugen
			var rezeptText = document.createTextNode(rezept.Titel);
			// text mit li verknüpfen
			rezeptElement.appendChild(rezeptText);
			// li ins DOM einfügen
			rezeptListElement.appendChild(rezeptElement);
			
			rezeptElement.addEventListener('click', function(){
				// HTML leer machen, damit der Text nicht untereinander angereiht wird
				rezeptDetailsElement.innerHTML = '';
				
				var rezeptDetails = new RezeptDetails(rezeptDetailsElement, rezept);
				rezeptDetails.render();
			
			});
		});
	});

	
	// hier waren methoden vorher 
	
	// event registrieren - auf topf klicken = ausgabe
	
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);

	
	
	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);
	
}	

// function um knobs bei klick 180grad zu drehen
Kitchen.prototype.onClick = function(event){
	
	
};


// bei Klick und Loslassen wird jeweils das event und das ziel in der Konsole ausgegeben
Kitchen.prototype.onClick = function(event) {
	if(event.target instanceof Knob) {
		event.target.changeState();
	}
	console.log(event);
	// ist das losgelassene Objekt ein Pot?
	if(event.target instanceof Pot) {
		// gehe Alle Platten durch und schaue bei jeder
		this.platten.forEach(function(platte) {
			var cx = event.target.getCenter().cx;
			var cy = event.target.getCenter().cy+40;
			var zone = platte.getHitZone();
			//check if center point of pot is over the platte		
			if ((cx > zone.hx && cx < zone.hx + zone.hw) && (cy > zone.hy && cy < zone.hy + zone.hh)) {
				var topfAufPlatteSnd = document.createElement("audio");
				topfAufPlatteSnd.setAttribute("src", "./sound/topfAufPlatteGesetzt.ogg");
				topfAufPlatteSnd.setAttribute("type", "audio/ogg");
				topfAufPlatteSnd.setAttribute("autoplay", "true");
				// topfAufPlatteSnd in body einfuegen oder audio ausgeben
				document.body.appendChild(topfAufPlatteSnd);
				
				platte.pot = event.target;
				//brauchen wir das?
				//event.target.changeState();
				//topf auf platte tun
				platte.potZuweisen(event.target);
				console.log('topf auf eine platte drauf' + platte.pot); // wie spreche ich hier die jeweilige platte an?
			} else {
				if(platte.pot != null){
					platte.potRunter(event.target);
				}
			}
		});
	}
	console.log(event);
	console.log(event.target);
};

Kitchen.prototype.onDragend = function(event) {
	if(event.target instanceof Ingredient) {		
		var kitchen = this;
		this.pots.forEach(function(pot) {
			var cx = event.target.getCenter().cx;
			var cy = event.target.getCenter().cy;
			var zone = pot.getHitZone();
			
			//check if center point of ingredient is over the pot's 
			if ((cx > zone.hx && cx < zone.hx + zone.hw) && (cy > zone.hy && cy < zone.hy + zone.hh)) {
				pot.setIngredient(event.target);
				kitchen.stage.removeFromStage(event.target);
			}
		});
	}
	console.log(event);
	console.log(event.target);
};


/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function(kit) {
	
	// update the objects (Plate, Knob, ...)
	kit.pots.forEach(function(pot) {
			pot.update();
		});	
	// Always render after the updates
	kit.stage.render();
	// keep the loop going
	window.requestAnimationFrame(function(){ kit.run(kit);});
	
};