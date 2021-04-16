const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = socket => {

    //enviamos un mensaje con el ultimo ticket generado al cliente
    socket.emit('ultimo-ticket', ticketControl.ultimoTicket);

    //Mostramos los ultimos 4 tickets que se han atendido
    socket.emit('estado-actual', ticketControl.ultimos4Tickets);

    //Emitimos el evento para saber los tickets pendientes por atender
    socket.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);

    //Recibimos el evento siguiente-ticket desde el cliente
    socket.on('siguiente-ticket', (payload, callback) => {
        //Generamos el siguiente ticket a atender
        const siguiente = ticketControl.siguienteTicket();
        //enviamos el ticket en el callback al cliente
        callback(siguiente);

        //Emitimos la cantidad de tickets pendientes por atender
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);
    });

    //Escuchamos el evento atender-ticket donde recibimos el escritorio del cliente
    socket.on('atender-ticket', ({escritorio}, callback) => {
        
        //validamos que el escritorio venga
        //Si no viene el escritorio
        if (!escritorio) {
            return callback({
                ok: false,
                mensaje: 'El escritorio es obligatorio'
            });
        }

        //obtenemos el ticket que tenemos que atender
        const ticketAAtender = ticketControl.atenderTicket(escritorio);

        //Mostramos los ultimos 4 tickets que se han atendido
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4Tickets);
        
        //Emitimos todos los tickets pendientes por atender
        socket.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);

        //Emitimos la cantidad de tickets pendientes por atender a todos los clientes conectados
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);

        //validamos que el ticket a atender exista
        if (!ticketAAtender) {
            callback({
                ok: false,
                mensaje: 'Ya no hay tickets pendientes por atender'
            });
        } else {
            callback({
                ok: true,
                ticketAAtender
            });
        }
    });
}


module.exports = {
    socketController
}