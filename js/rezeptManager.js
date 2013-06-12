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
	
		var zutatenElement = document.createElement('p');
		var dateText = document.createTextNode(this.data.Zutaten);
		zutatenElement.appendChild(dateText);
		//ins DOM
		this.container.appendChild(zutatenElement);
		
		var descElement = document.createElement('p');
		var descText = document.createTextNode(this.data.Arbeitsschritte);
		//descElement.setAttribute('class', 'myClass');
		
		descElement.appendChild(descText);
		//ins DOM
		this.container.appendChild(descElement);
		
	};
}