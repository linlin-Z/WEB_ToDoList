
const express = require('express')
const router = express.Router();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://xvymrvgg:uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn@manny.db.elephantsql.com:5432/xvymrvgg',
{
	define: {timestamps : false}
});
// const {Pool} =  require("pg")
const listModel = require("../models/lists")
const List = listModel.List

// const pool = new Pool({
// 	user: 'xvymrvgg',
// 	host: 'manny.db.elephantsql.com',
// 	database: 'xvymrvgg',
// 	password: 'uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn',
//     port: 5432, 
//     idleTimeoutMillis: 30000
// })
// pool.connect()

const Task = sequelize.define('task', {
	taskid: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
        primaryKey: true
    },
	name: Sequelize.STRING,
    description: Sequelize.STRING,
    deadline : {type : Sequelize.DATE, defaultValue : Sequelize.fn('NOW') },
    progression : {type : Sequelize.INTEGER, defaultValue : 0}
  });
Task.belongsTo(List, {foreignKey: 'listid', targetKey: 'listid'});



function getTasksFromList(ListId)
{
    return Task.findAll({where : { listid : ListId } })
}

function getTaskInfos(taskId)
{
    return Task.findByPk(taskId)
}

function deleteTask(taskId)
{
	return Task.destroy({where : { taskid : taskId}})
}

function createTask(data)
{
	return Task.create(
		{
			name : data.name,
            description : data.description,
            deadline : data.deadline,
            progression : data.progression,
            listid : data.listid
		}
	)
}

function updateTask(taskId, data)
{
	return Task.update(
		{
            name : data.name,
            description : data.description,
            deadline : data.deadline,
            progression : data.progression
		},
		{where : {taskid : taskId}}
	)
}

function isTask(taskid)
{
    return Task.findByPk(taskid)
}

module.exports = {
    getTasksFromList : getTasksFromList,
    getTaskInfos : getTaskInfos,
    deleteTask : deleteTask,
    createTask : createTask,
    updateTask : updateTask,
    Task : Task,
    isTask : isTask
}

// pool.end().then(() => console.log('pool has ended'))

