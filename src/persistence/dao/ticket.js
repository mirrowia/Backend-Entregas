const { ticketModel } = require('./models/ticket');

const ticketDAO = {
  async getTickets() {
    return await ticketModel.find();
  },

  async getTicketsPaginate(object, options){
    if (object) return await ticketModel.paginate(object, options);
    return await ticketModel.paginate({}, options); 
  },
  
  async getTicket(id) {
    return await ticketModel.findById(id);
  },
  
  async createTicket(newTicket) {
    const ticket = new ticketModel(newTicket);
    return await ticket.save();
  },
  
  async updateTicket(id, newTicket) {
    return await ticketModel.findByIdAndUpdate(id, newTicket, { new: true });
  },
  
  async deleteTicket(id) {
    return await ticketModel.findByIdAndDelete(id);
  },

  async getCategories(){
    return await ticketModel.distinct("category");
  }
};

module.exports = ticketDAO;
