const sessionData = require ("../persistence/dao/user")

function getUsers(){
    return sessionData.getUsers();
}

function getUser(email){
    return sessionData.getUser(email);
}

function getUserById(id){
    return sessionData.getUserById(id)
}

function createUser(user){
    return sessionData.createUser(user);
}

function updateUser(id, user){
    return sessionData.updateUser(id, user)
}

function deleteUser(id){
    return sessionData.deleteUser(id)
}

module.exports = {
    getUsers,
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}