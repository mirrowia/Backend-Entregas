const { userModel } = require('./models/user');

const userDAO = {
  async getUsers() {
    return await userModel.find();
  },

  async getUser(email) {
    return await userModel.findOne({email})
  },

  async getUserById(id){
    return await userModel.findById(id)
  },
  
  async createUser(newUser) {
    const user = new userModel(newUser);
    return await user.save();
  },
  
  async updateUser(id, newUser) {
    return await userModel.findByIdAndUpdate(id, newUser, { new: true });
  },
  
  async deleteUser(id) {
    return await userModel.findByIdAndDelete(id);
  },

};

module.exports = userDAO;
