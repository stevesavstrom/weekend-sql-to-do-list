console.log('JS working!');

$(document).ready(onReady);

function onReady() {
	// click event listener for submitting a task
    $('#submit-task').on('click', function(event) {
        event.preventDefault();
        addTask();
    });

    // load data from the server, put it on the DOM
    getTasks();

    // Listener for the DELETE task click:
    $('#taskTableBody').on('click', '.delete-task-button', deleteTaskHandler);
	// Listener for the PUT/Update status task click:
	$('#taskTableBody').on('click', '.update-task-button', updateTaskHandler);
} // end onReady

function addTask() {
    // Get info to send to the server
    const newTask = {
        task: $('#taskInput').val(), 
        status: $('#statusInput').val(),
    };

    console.log('Adding task', newTask);

    // Send the new task to the server as data
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
    }).then(function(response) {
        console.log(response);
        getTasks();
    }).catch(function(error) {
        console.log('error in task post', error); 
        alert('Error adding task. Please try again later.')       
    });
    // clear inputs after task is added
    $('#taskInput').val('')
    $('#statusInput').val('')
} // end addTask

function getTasks() {
    // get task data from the server
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(function (response) {
        renderTasks(response);
    }).catch(function (error) {
        console.log('error in task get', error);
    });
} // end getTasks

function renderTasks(listOfTasks) {
    // Empty previous data
    $('#taskTableBody').empty();
    // Display tasks on table - status incomplete
    for (let item of listOfTasks) {
		if(item.status === 'Incomplete'){
			$('#taskTableBody').append(`
			<tr>
				<td>
				<button type="submit" class="update-task-button" data-id=${item.id}><i class="fa fa-check"></i></button>
				</td>
				<td>${item.task}</td>
				<td>${item.status}</td>
				<td>
				<button class="delete-task-button" data-id=${item.id}><i class="fa fa-trash"></i></button>
				</td>
			</tr>`
		);
	// Display tasks on table - status complete
		} else if (item.status === 'Complete'){
		$('#taskTableBody').append(`
		<tr class = "complete-task-row">
			<td>
			<button type="submit" class="complete-task-button" data-id=${item.id}><i class="fa fa-check"></i></button>
			</td>
			<td>${item.task}</td>
			<td>${item.status}</td>
			<td>
			<button class="delete-task-button" data-id=${item.id}><i class="fa fa-trash"></i></button>
			</td>
		</tr>`
		);
	}
}
} // end renderTasks

function deleteTaskHandler() {
    deleteTask($(this).data('id'));
  } // end deleteTaskHandler

function deleteTask(taskId) {
    $.ajax({
      method: 'DELETE',
      url: `/weekend-to-do-app/tasks/${taskId}`,
    })
      .then((response) => {
        console.log('Deleted task!');
        getTasks();
      })
      .catch((error) => {
        alert('There was a problem deleting that task.', error);
      });
  } //end deleteTask

function updateTaskHandler(){
	updateTask($(this).data('id'));
  } // end updateTaskHandler

function updateTask(taskId){
	console.log('Task is ready to update');
	$.ajax({
	  method: 'PUT',
	  url: `/weekend-to-do-app/tasks/${taskId}`
	})
	.then(response => {
	  console.log(`Task status updated`, response);
	  getTasks();
	})
	.catch(error => {
	  console.log(`Task status NOT updated`, error);
	});
  } // end updateTask



