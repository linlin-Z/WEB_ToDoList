-- INSERT Users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userID SERIAL PRIMARY KEY,
	email VARCHAR,
  username VARCHAR,
  firstname VARCHAR,
  lastname VARCHAR,
  passwd VARCHAR,
  last_update timestamp default current_timestamp
);

-- INSERT 
DROP TABLE IF EXISTS lists;

CREATE TABLE lists (
	listID SERIAL PRIMARY KEY, 
	name VARCHAR(20), 
	Description VARCHAR, 
	userId INTEGER REFERENCES users(userID)
);

--INSERT
DROP TABLE IF EXISTS list_user_map;

CREATE TABLE list_user_map(
	listID INT REFERENCES lists(listID) ON DELETE CASCADE,
	userID INT REFERENCES users(userID) ON DELETE CASCADE
);

-- INSERT tasks
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
	taskID SERIAL PRIMARY KEY, 
	name VARCHAR(20), 
	Description VARCHAR, 
	Deadline DATE,
	Progression INT default 0, 
	listID INT REFERENCES lists(listID) ON DELETE CASCADE
);

-- INSERT SubTasks
DROP TABLE IF EXISTS SubTasks;

CREATE TABLE SubTasks (
	subTaskID SERIAL PRIMARY KEY, 
    taskID INT REFERENCES tasks(taskID) ON DELETE CASCADE
	name VARCHAR(20), 
	Description VARCHAR, 
	DEADLINE DATE
);


	
