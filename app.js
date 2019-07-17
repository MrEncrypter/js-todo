var UIController = (function(){
    var DOMStrings = {
        submitBtn : '#btn-submit',
        taskTxt : "#txtTask",
        pendingTasks: '#pending-tasks',
        completedTasks: '#completed-tasks',
        tasksCont: '#tasks'
    }
    return{
        getDOMStrings: function(){
            return DOMStrings;
        },

        addTasktoList: function(tasks, ispendingList){
            if(ispendingList){
                var htmlContent = '<li class="list-group-item d-flex"><div class="col-7">#MSG#</div><div class="col-5"><button class="btn btn-sm btn-danger col-5 mr-1" data-op="del-#ID#">Delete</button><button class="btn btn-sm btn-success col-6" data-op="comp-#ID#">Complete</button></div></li>';
                document.querySelector(DOMStrings.pendingTasks).innerHTML = "";
                for(var i = 0 ; i < tasks.length; i++){
                    var temp = htmlContent;
                    temp = temp.replace("#MSG#",tasks[i].Message).replace(/#ID#/g,tasks[i].ID);
                    document.querySelector(DOMStrings.pendingTasks).insertAdjacentHTML("beforeend",temp);
                }
            }
            else{
                var htmlContent = '<li class="list-group-item d-flex"><div class="col-7">#MSG#</div><div class="col-5"><button class="btn btn-sm btn-danger mr-1" data-op="del-#ID#">Delete</button></div></li>';
                document.querySelector(DOMStrings.completedTasks).innerHTML = "";
                for(var i = 0 ; i < tasks.length; i++){
                    var temp = htmlContent;
                    temp = temp.replace("#MSG#",tasks[i].Message).replace(/#ID#/g,tasks[i].ID);
                    document.querySelector(DOMStrings.completedTasks).insertAdjacentHTML("beforeend",temp);
                }
            }
        },

        clearInputFields:function(){
            document.querySelector(DOMStrings.taskTxt). value = "";
        }
    }
})();

var TaskController = (function(){
    var data = {
        tasks: []
    }

    var constID = 0;

    var generateId = function(){
        return constID++;
    }

    return{
        addTask:function(taskMessage){
            data.tasks.push({
                ID: generateId(),
                Message: taskMessage,
                IsCompleted: false
            })
        },

        getPendingTasks: function(){
            return data.tasks.filter(function(cur){
                return cur.IsCompleted === false;
            });
        },

        getCompletedTasks: function(){
            return data.tasks.filter(function(cur){
                return cur.IsCompleted === true;
            });
        },

        deleteTask: function(type, taskId){
            var ids = data.tasks.map(function(cur){ return cur.ID;});
            data.tasks.splice(ids.indexOf(taskId),1);
        },

        completeTask: function(taskId){
            var ids = data.tasks.map(function(cur){ return cur.ID;});
            data.tasks[ids.indexOf(taskId)].IsCompleted = true;
        },

        testing: function(){
            return data;
        }
    }
})();

var AppController = (function(uiCtrl, taskCtrl){
    var domStrings;
    
    //get all dom element strings
    domStrings = uiCtrl.getDOMStrings();

    var addNewTask = function(){
        //1. get the input text
        var taskMessage = document.querySelector(domStrings.taskTxt).value;

        if(taskMessage !== "" && taskMessage !== undefined){
            //2.add to list
            taskCtrl.addTask(taskMessage);
            //3.add to UI
            var tasks = taskCtrl.getPendingTasks();            
            uiCtrl.addTasktoList(tasks, true);

            //4.clear fields
            uiCtrl.clearInputFields();
        }        
    }

    var taskCRUD = function(event){
        var attr, type, taskId, tasks;
        //get the id
        attr = event.target.getAttribute("data-op");
        if(attr){
            type=attr.split('-')[0];
            taskId = parseInt(attr.split('-')[1]);

            if(type === "del"){            
                //remove from list
                taskCtrl.deleteTask(type, taskId);

                //remove from ui
                tasks = taskCtrl.getPendingTasks();            
                uiCtrl.addTasktoList(tasks, true);

                //update completed tasks
                tasks = taskCtrl.getCompletedTasks();
                uiCtrl.addTasktoList(tasks,false);
            }
            else if(type === "comp"){
                //update the task
                taskCtrl.completeTask(taskId);

                //remove from ui
                tasks = taskCtrl.getCompletedTasks();
                uiCtrl.addTasktoList(tasks,false);

                //update pending tasks list
                tasks = taskCtrl.getPendingTasks();
                uiCtrl.addTasktoList(tasks, true);
            }
        }
    }

    //set all event listeners for the app
    var setupEventListeners = function(){
        document.querySelector(domStrings.submitBtn).addEventListener("click",addNewTask);
        document.querySelector(domStrings.tasksCont).addEventListener("click",taskCRUD);
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which === 13){
                event.preventDefault();
                addNewTask();
            }
        });
    }

    return{
        init: function(){
            console.log("App Started");
            setupEventListeners();
        }
    }
})(UIController, TaskController);

AppController.init();