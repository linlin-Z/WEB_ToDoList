function showTaskFromList(element)
{
    //D'abord on vide les taches qu'il y avait avant
    let listeTaches = document.getElementById("taches_listes").innerHTML = ""
    const id = element.id
    document.getElementById("createTask").style.display = "block";
    document.getElementById("inputListId").setAttribute("value", id);

    fetch('http://localhost:3000/api/task/list/'+id)
    .then(response => response.json())
    .then(taches => {
        if(taches[0] != undefined){
            let listeTaches = document.getElementById("taches_listes")
            taches.forEach(createTachesHTML);
    
            function createTachesHTML(element) {
                let li = document.createElement('li');

                let buttonDelete = document.createElement("button")
                buttonDelete.setAttribute("onclick", "deleteTask(this)")
                buttonDelete.setAttribute("id", element.taskid+"_delete")
                buttonDelete.innerHTML = "Delete!"

                let buttonUpdate = document.createElement("button")
                buttonUpdate.setAttribute("onclick", "updateTask(this)")
                buttonUpdate.setAttribute("id", element.taskid+"_update")
                buttonUpdate.innerHTML = "Update!"

                li.setAttribute('class','task-item');
                li.setAttribute('onclick', 'showDetailsFromTask(this)')
                li.setAttribute('id',element.taskid+"_task");
                listeTaches.appendChild(li);
                li.innerHTML = element.name;
                li.append(buttonDelete)
                li.append(buttonUpdate)

            }
        }
})
.catch(error => console.error(error))
}

function showDetailsFromTask(element)
{
    const id = element.id.replace("_task", "")
    let name = document.getElementById("task_name");
    let echeance = document.getElementById("echeance_task")
    let description = document.getElementById("task_description")
    let progressBar = document.getElementById("task-progress")
    let progress_label = document.getElementById("label-progress")
    let progressBarNumber = document.getElementById("progressBarNumber")
    document.getElementById("taskInfos").style.display = "block";

    fetch('http://localhost:3000/api/task/'+id)
    .then(response => response.json())
    .then(tache => {
        name.innerHTML = tache.name
        echeance.value = tache.deadline
        description.innerHTML = tache.description
        progressBar.setAttribute("value", tache.progression)
        progress_label.append(progressBar)
        progressBarNumber.innerHTML = tache.progression+" %"
        progress_label.append(progressBarNumber)
    })
}

function openFormList() {
    document.getElementById("myFormList").style.display = "block";
    let form_update = document.getElementById("listForm").action = "/list/"
    let form_list_header = document.getElementById("listFormHeader").innerHTML = "Create a List"
    document.getElementById("ListFormBtn").innerHTML = "Create"
  }
  
  function closeFormList() {
    document.getElementById("myFormList").style.display = "none";
  }

  function openFormTask() {
    document.getElementById("myFormTask").style.display = "block";
    let form_update = document.getElementById("taskForm").action = "/task/"
    let form_task_header = document.getElementById("taskFormHeader").innerHTML = "Create a Task"
    document.getElementById("TaskFormBtn").innerHTML = "Create"
  }
  
  function closeFormTask() {
    document.getElementById("myFormTask").style.display = "none";
  }

  function deleteTask(element){
    const id = element.id.replace("_delete", "")
    fetch('http://localhost:3000/api/task/'+id, {method: "DELETE"})
    let task = document.getElementById(id+"_task")
    task.style.display = "none"
  }

  function deleteList(element){
    const id = element.id.replace("_delete", "")
    fetch('http://localhost:3000/api/list/'+id, {method: "DELETE"})
    let list = document.getElementById(id+"_list")
    list.style.display = "none"
  }

  function updateList(element)
  {
    // on recup l'id de la liste
    const id = element.id.replace("_update", "")
    // on recup ses infos
    fetch('http://localhost:3000/api/list/'+id)
    .then(response => response.json())
    // on remplie le form avec les infos de la liste
    .then((data) => {
      // on recup les elements du form
      let listName = document.getElementById("listName")
      let listDescription = document.getElementById("listDescription")
      listName.value = data.name
      listDescription.value = data.description
      // On recup le form et on change sa route
      let form_update = document.getElementById("listForm").action = "/list/"+id
      let form_list_header = document.getElementById("listFormHeader").innerHTML = "Update a List"
      document.getElementById("ListFormBtn").innerHTML = "Update"
      document.getElementById("myFormList").style.display = "block";
    })
    
  }


  function updateTask(element)
  {
    // on recup l'id de la tache
    const id = element.id.replace("_update", "")
    // on recup ses infos
    fetch('http://localhost:3000/api/task/'+id)
    .then(response => response.json())
    // on remplie le form avec les infos de la tache
    .then((data) => {
      // on recup les elements du form
      let taskName = document.getElementById("taskName")
      let taskDescription = document.getElementById("taskDescription")
      let taskDeadline = document.getElementById("taskDeadline")
      let taskProgression = document.getElementById("taskProgression")     
      
      // On remplie le form avc les valeurs de la taches
      taskName.value = data.name
      taskDescription.value = data.description
      taskDeadline.value = data.deadline
      taskProgression.value = data.progression
      
      // On recup le form et on change sa route
      let form_update = document.getElementById("taskForm").action = "/task/"+id
      let form_list_header = document.getElementById("taskFormHeader").innerHTML = "Update a Task"
      document.getElementById("TaskFormBtn").innerHTML = "Update"
      document.getElementById("myFormTask").style.display = "block";
    })
    
  }