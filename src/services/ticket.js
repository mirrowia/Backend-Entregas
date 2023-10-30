const ticketData = require ("../persistence/dao/ticket")

function getTickets(){
    return ticketData.getTickets();
}

function getTicket(id){
    return ticketData.getTicket(id);
}

function createTicket(ticket){
    return ticketData.createTicket(ticket)
}

function updateTicket(id, ticket){
    return ticketData.updateTicket(id, ticket)
}

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket
}