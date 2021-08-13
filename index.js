const taskContainer=document.querySelector(".task__container");
let globalTaskData=[];
const generateHTML =(taskData) =>`<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card ">
  <div class="card-header gap-2 d-flex justify-content-end">
    <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)"">
      <i class="fas fa-pencil-alt name=${taskData.id} "></i>
    </button>
    <button class="btn btn-outline-danger" name=${taskData.id} ">
      <i class="fas fa-trash" name=${taskData.id} onclick="deleteCard.apply(this,arguments)"></i>
    </button>
  
  </div>
  <div class="card-body">
    <img src=${taskData.image}
    alt=img 
    class="card-img"/>
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">${taskData.description}</p>
    <span class="badge bg-primary">${taskData.type}</span>
    <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
  </div>
  <div class="card-footer ">
    <button class="btn btn-outline-primary" name="${taskData.id}">Open Task</button>
  </div>
</div>
</div>`;
// function to update local storage  
const saveToLocalStorage =() => {
  localStorage.setItem("taskyCA", JSON.stringify({card:globalTaskData}));

}
const insertToDom=(content)=>
taskContainer.insertAdjacentHTML("beforeend",content)

const addNewCard = () => {
    // get task data
    const taskData= {
        id:`${Date.now()}`,
        title: document.getElementById("taskTitle").value,
        image: document.getElementById("imageURL").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,

    };
    globalTaskData.push(taskData);
    // update the local storage
    saveToLocalStorage();
    // console.log(taskData);
    // generate data
    const newCard=generateHTML(taskData);

    // inject it to dom
    insertToDom(newCard);
    // cleae the form
    document.getElementById("taskTitle").value="";
    document.getElementById("imageURL").value="";
    document.getElementById("taskType").value="";
    document.getElementById("taskDescription").value="";
return;
    
};
const loadExistingCards=() => {
  // check local storage 

  const getData=localStorage.getItem("taskyCA");

  // parse data, if exist
  if(!getData)return;
  const taskCards=JSON.parse(getData);
  globalTaskData=taskCards.card;
  globalTaskData.map((taskData)=> {
    //  generate html code for those 
    const newCard=generateHTML(taskData);
  // inject to dom
  insertToDom(newCard);



  });
  return ;
};
const deleteCard = (event) => {
  console.log(event)
  const targetId=event.target.getAttribute("name");
  const elementType=event.target.tagName;
  const removeTask=globalTaskData.filter((task)=>task.id !== targetId);
  globalTaskData=removeTask;
  saveToLocalStorage();
  // access DOM to remove card
  if(elementType==="BUTTON"){
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  }
    else{
      return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};
const editCard = (event) =>{
  console.log(event);
  // const targetId=event.target.getAttribute("name");
  const elementType=event.target.tagName;
  let taskTitle;
  let taskType;  
  let taskDescription;
  let parentElement;
  let submitButton;
  if(elementType==="BUTTON"){
      parentElement=event.target.parentNode.parentNode;
  }
  else{
    parentElement=event.target.parentNode.parentNode.parentNode;
  }
  taskTitle=parentElement.childNodes[3].childNodes[3];
  taskDescription=parentElement.childNodes[3].childNodes[5];
  taskType=parentElement.childNodes[3].childNodes[7];
  submitButton=parentElement.childNodes[5].childNodes[1];
  // SETTING  new attributef contenteditable to true
  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable","true");
  submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)")
  submitButton.innerHTML="save Changes";
};


// save changes function
const saveEdit=(event)=>{
  console.log(event)
  const targetId=event.target.getAttribute("name");
  console.log(targetId)

  const elementType=event.target.tagName;

  let parentElement;
  if(elementType==="BUTTON"){
      parentElement=event.target.parentNode.parentNode;
  }
  else{
    parentElement=event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle=parentElement.childNodes[3].childNodes[3];
  const taskDescription=parentElement.childNodes[3].childNodes[5];
  const taskType=parentElement.childNodes[3].childNodes[7];
  const submitButton=parentElement.childNodes[5].childNodes[1];
  
  const updatedData={
   title:taskTitle.innerHTML,
   type:taskType.innerHTML, 
   description:taskDescription.innerHTML,
  };
  console.log({updatedData,targetId})
  const updatedGlobalTasks=globalTaskData.map((task)=>{
    if(task.id===targetId){
      console.log({...task,...updatedData});
      // globalTaskData={...task,updatedData}
      return {...task,...updatedData};
    }
    return task;
  });
  globalTaskData=updatedGlobalTasks;
// to save to local storage
console.log(globalTaskData);
localStorage.setItem("taskyCA", JSON.stringify({card:globalTaskData}));

  saveToLocalStorage();
  // we have to set contenteditable to false
  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable","false");
  submitButton.innerHTML="Open Task";

  
  
  
  
};
