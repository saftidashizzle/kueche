function TaskDetails(container, data){
	this.container = container;
	this.data = data;

	this.render = function(){
		//headline
		var headlineElement = document.createElement('h1');
		var headlineText = document.createTextNode('Aufgabenbeschreibung');
		headlineElement.appendChild(headlineText);
		//ins DOM
		this.container.appendChild(headlineElement);
		
		var taskHeadline = document.createElement('h2');
		var taskText = document.createTextNode(this.data.Titel);
		taskHeadline.appendChild(taskText);
		//ins DOM
		this.container.appendChild(taskHeadline);
	
		var dateElement = document.createElement('p');
		var dateText = document.createTextNode(this.data.Zutaten);
		dateElement.appendChild(dateText);
		//ins DOM
		this.container.appendChild(dateElement);
		
		var descElement = document.createElement('p');
		var descText = document.createTextNode(this.data.Arbeitsschritte);
		//descElement.setAttribute('class', 'myClass');
		
		descElement.appendChild(descText);
		//ins DOM
		this.container.appendChild(descElement);
		
	};
}