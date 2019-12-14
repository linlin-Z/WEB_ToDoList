
const express = require('express')
const Sequelize = require('sequelize');
const ListModel = require("./lists")
const List = ListModel.List
const Op = Sequelize.Op


const sequelize = new Sequelize('postgres://xvymrvgg:uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn@manny.db.elephantsql.com:5432/xvymrvgg',
{
	define: {timestamps : false}
}
);

const User = sequelize.define('user', {
	userid: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
        primaryKey: true
    },
	email: {type : Sequelize.STRING, allowNull : false},
	username: {type : Sequelize.STRING, allowNull : false},
	firstname: {type : Sequelize.STRING, allowNull : false},
	lastname:  {type : Sequelize.STRING, allowNull : false},
	password: {type : Sequelize.STRING, allowNull : false},
	last_update: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
	})

function getUserInfos(userId)
{
	return User.findByPk(userId)
}

function getUserInfosByEmail(email)
{
	return User.findOne({
		where : {email : email}
	})
}


function deleteUser(userId)
{
	return User.destroy({where : {userid : userId}})
}

function createUser(data)
{
	return User.create(
		{
			email : data.email,
			username : data.username,
			firstname: data.firstname,
			lastname : data.lastname,
			password : data.password
		}
	)
}

function updateUser(userId, data)
{
	return User.update(
		{
			email : data.email,
			username : data.username,
			firstname: data.firstname,
			lastname : data.lastname,
			last_update : Sequelize.fn('NOW')
		},
		{where : {userid : userId}}
	)
}

function changePassword(userId, newPassword)
{
	return User.findOne({where : {userid : userId}})
	.then(user => {
		if (user){
			user.update({password : newPassword})
		}
	})
}

function findUserByEmailAndPassword(email, password){
	return User.findOne({where : {email : email, password : password}})
}

function checkIfEmailIsUsed(email, userid)
{
	return User.findOne({where :{
		userid : 
			{
				[Op.ne]: userid
		}, 
		email : email
	}
	})
}


module.exports = {
	getUserInfos: getUserInfos,
	deleteUser : deleteUser,
	createUser: createUser,
	updateUser : updateUser,
	User : User,
	changePassword : changePassword, 
	getUserInfosByEmail : getUserInfosByEmail,
	findUserByEmailAndPassword : findUserByEmailAndPassword, 
	checkIfEmailIsUsed : checkIfEmailIsUsed
};
