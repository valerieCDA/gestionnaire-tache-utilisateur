//fonction pour ajouter une tache au click bouton ajouter
function addTask(event) {
  //ouverture d'un prompt pour entrer la tache
  let tacheName = prompt("Entrez l'intitulé de la tâche", "Ex:Aller dans le jardin");
  while (tacheName == null) {
    tacheName = prompt("Intitulé de la tâche non valide !", "Entrez une tache !!");
  }
  //recuperation de l'utilisateur et ajout de la tache dans le sessionstorage
  var selectedUser = event.currentTarget.selectedUser;
  var data_json = sessionStorage.getItem("tasks");
  let data = JSON.parse(data_json);
  if (data != null) {
    data["tasks"].push({
      "id": self.crypto.randomUUID(),
      "user": selectedUser,
      "tache": tacheName,
      "statut": "A faire"
    });
    var tasks_json = JSON.stringify(data);
    sessionStorage.setItem("tasks", tasks_json);
  } else {
    var tasks = {
      "tasks": [
        {
          "id": self.crypto.randomUUID(),
          "user": selectedUser,
          "tache": tacheName,
          "statut": "A faire"
        }
      ]
    };
    var tasks_json = JSON.stringify(tasks);
    sessionStorage.setItem("tasks", tasks_json);
  }
  // rafraichissement de la page et ajout des taches a l'ecran
  parseUserTasks();
}
//fonction qui permet de retirer une tache et de lui mettre un statut deleted
function removeTask(event) {
  let taskID = event.currentTarget.taskID;
  var data_json = sessionStorage.getItem("tasks");
  let data = JSON.parse(data_json);
  for (const task of data.tasks) {
    if (taskID.includes(task.id)) {
      task.statut = "Deleted"
    }
  }
  var tasks_json = JSON.stringify(data);
  sessionStorage.setItem("tasks", tasks_json);
  //rafraichissement de la page
  parseUserTasks();
}
// Ajout du statut Terminée à la tache
function markTaskAsFinished(event) {
  let taskID = event.currentTarget.taskID;
  var data_json = sessionStorage.getItem("tasks");
  let data = JSON.parse(data_json);
  for (const task of data.tasks) {
    if (taskID.includes(task.id)) {
      task.statut = "Terminée"
    }
  }
  var tasks_json = JSON.stringify(data);
  sessionStorage.setItem("tasks", tasks_json);
  //rafraichissement de la page
  parseUserTasks();
}

//fonction pour l'affichage
function parseUserTasks() {
  let taskList = document.getElementById("taskList");
  if (taskList != null) {
    taskList.parentNode.addEventListener("click", parseUserTasks);
    taskList.remove();
  }
  //modification du style pour l'utilisateur selectionné
  const listeLi = document.getElementsByName("user");
  listeLi.forEach(li => li.style.fontWeight = "normal");
  this.style.fontWeight = "bold";

  var data_json = sessionStorage.getItem("tasks");
  let data = JSON.parse(data_json);
  let userTodoTaskArray = new Array();
  let userCompletedTaskArray = new Array();
  if (data != null) {
    for (const task of data.tasks) {
      if (this.textContent.includes(task.user)) {
        //creation de tableau de taches en fonction des statuts
        if (task.statut.includes("A faire")) {
          userTodoTaskArray.push({ "name": task.tache, "id": task.id });
        } else if (task.statut.includes("Terminée")) {
          userCompletedTaskArray.push({ "name": task.tache, "id": task.id });
        }
      }
    }
  }
  //affichage des taches et des boutons associés(terminer-supprimer)
  let newList = document.createElement('ul');
  newList.setAttribute('id', 'taskList');
  if (userTodoTaskArray.length > 0) {
    let todoTaskText = document.createElement('u');
    todoTaskText.textContent = "Taches à faire : ";
    newList.appendChild(todoTaskText);
    userTodoTaskArray.forEach(t => {
      let listElem = document.createElement('li');
      listElem.appendChild(document.createElement('p')).textContent = t.name;
      let endTaskButton = document.createElement('button');
      endTaskButton.addEventListener("click", markTaskAsFinished)
      endTaskButton.taskID = t.id;
      listElem.appendChild(endTaskButton).textContent = "Marquer comme terminée";
      let removeButton = document.createElement('button')
      removeButton.addEventListener("click", removeTask)
      removeButton.taskID = t.id;
      listElem.appendChild(removeButton).textContent = "Supprimer tâche";
      newList.appendChild(listElem);
    });
  } else {
    //pas de tache à faire
    let noTaskText = document.createElement('p');
    noTaskText.textContent = "Cet utilisateur n'a aucune tâches à faire ! ";
    newList.appendChild(noTaskText);
  }
  //gestion des taches terminées ajout d'un bouton pour supprimer la tache terminée
  if (userCompletedTaskArray.length > 0) {
    let completedTaskText = document.createElement('p');
    completedTaskText.classList.add('souligne');
    completedTaskText.textContent = "Taches terminées : ";
    newList.appendChild(completedTaskText);
    userCompletedTaskArray.forEach(t => {
      let listElem = document.createElement('li');
      listElem.appendChild(document.createElement('p')).textContent = t.name;
      let removeButton = document.createElement('button')
      removeButton.addEventListener("click", removeTask)
      removeButton.taskID = t.id;
      listElem.appendChild(removeButton).textContent = "Supprimer tâche";
      newList.appendChild(listElem);
    });
  } else {
    let noTaskText = document.createElement('p');
    noTaskText.textContent = "Cet utilisateur n'a terminé aucune tâches ! ";
    newList.appendChild(noTaskText);
  }
  //bouton ajouter tache
  newList.appendChild(document.createElement('hr'));
  let addButton = document.createElement('button')
  addButton.addEventListener("click", addTask)
  addButton.selectedUser = this.textContent;
  newList.appendChild(addButton).textContent = "Ajouter tâche";
  this.appendChild(newList);
  this.removeEventListener("click", parseUserTasks);
}

export class App {
  async #init() {
    var users_json = sessionStorage.getItem("users");
    return JSON.parse(users_json).users;
  }
//au demarrage affichage des utilisateurs
  async run() {
    const contacts = await this.#init();
    const html = `
        <div>
          ${contacts.map(c =>      `
            <h2 name="user">${c.pseudo}</h2>
          `).join('')}
        </div>
      `;
    document.querySelector('.users').innerHTML = html;
    const listeLi = document.getElementsByName("user");
    listeLi.forEach(li => li.addEventListener("click", parseUserTasks));
  }
}
