
const express = require('express')
const router = express.Router();
const Sequelize = require('sequelize');
// const {Pool} =  require("pg")
const userModel = require("./users")
const User = userModel.User

// const pool = new Pool({
// 	user: 'xvymrvgg',
// 	host: 'manny.db.elephantsql.com',
// 	database: 'xvymrvgg',
// 	password: 'uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn',
//     port: 5432, 
//     idleTimeoutMillis: 30000

// })
// pool.connect()

const sequelize = new Sequelize('postgres://xvymrvgg:uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn@manny.db.elephantsql.com:5432/xvymrvgg',
{
	define: {timestamps : false}
});

const List = sequelize.define('list', {
    listid:
    {
		type: Sequelize.INTEGER,
		autoIncrement: true,
        primaryKey: true
    },
	name: {type : Sequelize.STRING, allowNull : false},
	description: {type : Sequelize.STRING, allowNull : true},
});
List.belongsTo(User, {foreignKey: 'userid', targetKey: 'userid'});


function getListsByUser(userId)
{
    return List.findAll({
        where: {
          userid: userId
        }
      });
}

function getListInfos(listId)
{
    return List.findByPk(listId)
}

function deleteList(listId)
{
    return List.destroy({where : {listid : listId}})
}

function updateList(listId, data)
{
	return List.update({
			name : data.name,
			description : data.description
		},
		{where : {listid : listId}}
	)
}

function createList(data, userid)
{
	return List.create(
		{
			name : data.name,
            description : data.description, 
            userid : userid
		}
	)
}

function isList(listid)
{
    return List.findByPk(listid)
}

module.exports = {
    getListsByUser : getListsByUser,
    getListInfos : getListInfos,
    deleteList : deleteList,
    updateList : updateList,
    createList : createList,
    List : List,
    isList : isList
}
// pool.end().then(() => console.log('pool has ended'))

