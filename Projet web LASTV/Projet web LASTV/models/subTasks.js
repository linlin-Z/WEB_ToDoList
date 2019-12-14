
const express = require('express')
const router = express.Router();
const taskModel = require("../models/tasks")
const Task = taskModel.Task
const Sequelize = require('sequelize');


const sequelize = new Sequelize('postgres://xvymrvgg:uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn@manny.db.elephantsql.com:5432/xvymrvgg',
{
	define: {timestamps : false}
}
);

const subTask = sequelize.define('subtask', {
	subtaskid: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
        primaryKey: true
    },
	name: Sequelize.STRING,
    description: Sequelize.STRING,
    deadline : {type : Sequelize.DATE, defaultValue : Sequelize.fn('NOW') }
  });

subTask.belongsTo(Task, {foreignKey: 'taskid', targetKey: 'taskid'});


function getSubTaskInfos(subTaskId)
{
    return subTask.findByPk(subTaskId)
}

function getSubTasksFromTask(taskId)
{
    return subTask.findAll({where : {taskid : taskId}})
}

function deletesubTask(subTaskId)
{
    return subTask.destroy({where : {subtaskid : subTaskId}})
}

function createSubTask(data)
{
	return subTask.create(
		{
            name : data.name,
            description : data.description,
            deadline : data.deadline,
            taskid : data.taskid
		}
	)
}


function updateSubTask(subTaskId, data)
{
	return subTask.update(
		{
            name : data.name,
            description : data.description,
            deadline : data.deadline,
		},
		{where : {subtaskid : subTaskId}}
	)
}

module.exports = {
    getSubTaskInfos : getSubTaskInfos,
    deletesubTask : deletesubTask,
    updateSubTask : updateSubTask,
    createSubTask : createSubTask,
    getSubTasksFromTask : getSubTasksFromTask
}
