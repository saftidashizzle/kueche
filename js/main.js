window.addEventListener('load', function(){
	// REF auf ul Element
	var rezeptListElement = document.querySelector('#rezept-list');
	var rezeptDetailsElement = document.querySelector('#rezept-details');
	
	
	Ajax.getJSON('http://localhost/zukunftskueche/js/rezepte.json', function(data){
		
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
});