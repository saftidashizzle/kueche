function RezeptDetails(container, data){
	this.container = container;
	this.data = data;

	
	this.render = function(){
		// headline
		var headlineElement = document.createElement('h1');
		var headlineText = document.createTextNode('Rezept');
		headlineElement.appendChild(headlineText);
		// ins DOM
		this.container.appendChild(headlineElement);
		
		var taskHeadline = document.createElement('h2');
		var taskText = document.createTextNode(this.data.Titel);
		taskHeadline.appendChild(taskText);
		// ins DOM
		this.container.appendChild(taskHeadline);
		
		// Zutaten
		var zutatenElement = document.createElement('p');
		var zutatenText = document.createTextNode(this.data.Zutaten);
		zutatenElement.appendChild(zutatenText);
		// ins DOM
		this.container.appendChild(zutatenElement);
		
		// Arbeitsschritte
		var arbeitElement = document.createElement('p');
		var arbeitText = document.createTextNode(this.data.Arbeitsschritte);
		arbeitElement.appendChild(arbeitText);
		// ins DOM
		this.container.appendChild(arbeitElement);
	};	
}

