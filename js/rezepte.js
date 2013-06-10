window.addEventListener('load', function(){
	var taskListElement = document.querySelector('#task-list');
	
	var taskDetailsElement = document.querySelector('#task-details');
	
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
	});	
});
