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
	
	// animObjekt fuer sprite vom topf erstellen
	
	var animObj = {
					"image" : 
					{
						"tilewidth": 250,
						"tileHeight": 199,
						"imgWidth": 1000,
						"imgHeigth": 597
					},
					"animations":
					{
					"default":{ "seq":[0], "loop":false },
					"cold": {"seq":[0], "loop":false },
					"heating": {"seq":[4,5,6], "loop":true },
					"cooling": {"seq":[1,2,3], "loop":true },
					"boiling":{"seq":[6,7,8,9,10,11], "loop":true}
					}
				};
	// pot hinzufügen
	
	// hier die groesse des tiles angeben, anstatt bild groesse, außerdem img pfad: sprite grafik und animObj uebergeben
	var p1 = new Pot(this.stage.getContext(), 300, 280, 250, 199, "images/potAnim.png", 19, true, "pot", animObj);
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
	var taskListElement = document.querySelector('#task-list');
	
	var taskDetailsElement = document.querySelector('#task-details');
	
	// ruft ajax auf und uebergibt funktion
	/*
	Ajax.getJSON('http://localhost/kueche/js/tasks.json', function(data){
		data.tasks.forEach(function(task){
			//li erzeugen
			var taskElement = document.createElement('li');
			//text erzeugen
			var taskText = document.createTextNode(task.Titel);
			//text mit li verknüpfen
			taskElement.appendChild(taskText);
			//li ins DOM einfügen
			taskListElement.appendChild(taskElement);
			
			taskElement.addEventListener('click', function(){
					taskDetailsElement.innerHTML = '';
					var taskDetails = new TaskDetails(taskDetailsElement, task ) ;
					taskDetails.render();
			});
		});
	});*/	
	
	var rezeptListeElement = document.querySelector('#rezeptListe');
	var rezeptDetailsElement = document.querySelector('#rezeptDetails');
	
	Ajax.getJSON('http://localhost/kueche/js/rezepte.json', function(data) {
		data.rezepte.forEach(function(rezept) {
			var rezeptListenElement = document.createElement('li');
			
			var rezeptText = document.createTextNode(rezept.Titel);
			
			rezeptListenElement.appendChild(rezeptText);
			
			rezeptListeElement.appendChild(rezeptListenElement);
			
			rezeptListenElement.addEventListener('click', function() {
				rezeptDetailsElement.innerHTML = '';
				var rezeptDetails = new RezeptManager(rezeptDetailsElement, rezept);
				rezeptDetails.render();
			});
			
		});
	});	
	
	// event registrieren - auf topf klicken = ausgabe
	
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);	
	
	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);

// kitchen function vorbei
}	

// bei Klick funktion
Kitchen.prototype.onClick = function(event) {
	if(event.target instanceof Knob) {
		event.target.changeState();
	}
	// ist das losgelassene Objekt ein Pot?
	if(event.target instanceof Pot) {
		// gehe Alle Platten durch und schaue bei jeder
		this.platten.forEach(function(platte) {
			var cx = event.target.getCenter().cx;
			var cy = event.target.getCenter().cy+40;
			var zone = platte.getHitZone();
			//check if center point of pot is over the platte		
			if ((cx > zone.hx && cx < zone.hx + zone.hw) && (cy > zone.hy && cy < zone.hy + zone.hh)) {
				
				event.target.topfAufPlatteSnd.play();
				
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

// was passiert bei dragend

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