function RezeptManager(container, data){
	this.container = container;
	this.data = data;

	this.render = function(){
		/*//headline
		var headlineElement = document.createElement('h1');
		var headlineText = document.createTextNode('Aufgabenbeschreibung');
		headlineElement.appendChild(headlineText);
		//ins DOM
		this.container.appendChild(headlineElement);*/
		
		var rezeptHeadline = document.createElement('h2');
		var rezeptTitelText = document.createTextNode(this.data.Titel);
		rezeptHeadline.appendChild(rezeptTitelText);
		//ins DOM
		this.container.appendChild(rezeptHeadline);
	
		//var zutatenElement = document.createElement('p');
		//var dateText = document.createTextNode(this.data.Zutaten);
		//zutatenElement.appendChild(dateText);
		//ins DOM
		//this.container.appendChild(zutatenElement);
		
		var descElement = document.createElement('p');
		var descText = document.createTextNode(this.data.Arbeitsschritte);
		//descElement.setAttribute('class', 'myClass');		
		descElement.appendChild(descText);
		this.container.appendChild(descElement);
		
		var backElement = document.createElement('span');
		backElement.addEventListener('click', function() {
			document.querySelector('#rezeptBuch').style.display = "block";
			document.querySelector('#rezeptDetails').style.display = "none";
			rezeptDetailsElement.innerHTML = '';
		});
		var backText = document.createTextNode("zurueck");
		//descElement.setAttribute('class', 'myClass');		
		backElement.appendChild(backText);
		//ins DOM
		this.container.appendChild(backElement);
		
	};
}
Rezeptmanager.prototype.constructor = Rezeptmanager;
Rezeptmanager.prototype.erstelleArbeitsschritte = function() {
	document.getElementById('arbeitsanweisungen').style.display='block';	
	var titel = document.querySelector('#arbeitsanweisungen');
	titel.innerHTML = '';
	//Arbeitsanweisugsblock einblenden	 (geht bestimmt besser )		
	//und den block mit "den Anweisungen" Füllen
	var Element = document.createElement('p');
	//"inhalt"
	//prüfen ob weitere Arbeitschritte nötig sind
	if (this.rezept['zubereitung'][this.step] != undefined ) {
		var Text = document.createTextNode(this.ersetzePlatzhalter(this.rezept['zubereitung'][this.step]['beschreibung']));
		this.step++;
	}else{
		//wenn wir am ende sind 
		var Text = document.createTextNode('Fertig');
	}
	//zusammenfügen
	Element.appendChild(Text);
	//ins dom
	titel.appendChild(Element);	
}
Rezeptmanager.prototype.check = function(taeter,opfer,mode) {
	
	var step = m.step;
	switch(mode) {
		case 'putin':
			console.log('reintuen');
			//wenn die Anweisung des schrittes der selbe ist wie der ausgeführte
			if (this.rezept['zubereitung'][step-1]['aktion'] == mode) {
				//prüfen wir ob die richtigen objekte benutzt worden sind
				if (this.rezept['zubereitung'][step-1]['user'][0] == taeter['name']) {
					//das stimmt schonmal auch das richtige obj benutzt?
					if (this.rezept['zubereitung'][step-1]['user'][1] == opfer['name']) {
						return true;
					}else{
						//fehler
						m.BabaraTextausgabe(this.rezept['texte']['fehler']['topf']);
						return false;
					}
				}else{
					//fehler
					m.BabaraTextausgabe(this.rezept['texte']['fehler']['zutat']);
					return false;
				}
			}else{
				//Fehler
				m.BabaraTextausgabe(this.rezept['texte']['fehler']['aktion']);
				return false;
			}
		break;
		case 'erhitze':
			console.log('erhitzen');
			//wenn die Anweisung des schrittes der selbe ist wie der ausgeführte
			if (this.rezept['zubereitung'][step-1]['aktion'] == mode) {
				//prüfen wir das richtige objekt benutzt wurde
				if (this.rezept['zubereitung'][step-1]['user'][0] == taeter) {					
					console.log(mode +"erledigt");
					return true;
				}else{
					//fehler
					m.BabaraTextausgabe(this.rezept['texte']['fehler']['topf']);
					return false;
				}			
			}else{
				return false;
			}
		break;	
		case 'koche':
			console.log('Kochen');
			//wenn die Anweisung des schrittes der selbe ist wie der ausgeführte
			if (this.rezept['zubereitung'][step-1]['aktion'] == mode) {
				//prüfen wir ob die richtigen objekte benutzt worden sind
				if (this.rezept['zubereitung'][step-1]['user'][0] == taeter) {
					//das stimmt schonmal auch das richtige obj benutzt?
					if (this.rezept['zubereitung'][step-1]['user'][1] == opfer) {
						//schritt erledigt weiter gehts
						console.log(mode +"erledigt");
						return true;
					}
				}else{
					//fehler
					m.BabaraTextausgabe(this.rezept['texte']['fehler']['topf']);
					return false;
				}			
			
			}else{
				return false;
			}
		break;
		case 'schneide':
		case 'ruehre':
			console.log('schneiden / rühren');
			//wenn die Anweisung des schrittes der selbe ist wie der ausgeführte
			if (this.rezept['zubereitung'][step-1]['aktion'] == mode) {
				//prüfen wir das richtige objekt benutzt wurde
				console.log(this.rezept['zubereitung'][step-1]['user'][0]);
				if (this.rezept['zubereitung'][step-1]['user'][0] == opfer) {					
					return true;
				}else{
					//fehler
					m.BabaraTextausgabe(this.rezept['texte']['fehler']['topf']);
					return false;
				}			
			}else{
				//Fehler
				m.BabaraTextausgabe(this.rezept['texte']['fehler']['aktion']);
				return false;
			}
		break;	
		
	}
}