const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorioDeAtencion) {
        this.numero = numero,
        this.escritorioDeAtencion = escritorioDeAtencion
    }
}

class TicketControl {
    constructor() {
        this.ultimoTicket = 0;
        this.diaDeHoy = new Date().getDate();
        this.ticketsPendientes = [];
        this.ultimos4Tickets = [];

        this.init();
    }

    //Generamos el archivo json con la data que vamos a guardar con la informacion
    get toJson() {
        return {
            ultimoTicket: this.ultimoTicket,
            diaDeHoy: this.diaDeHoy,
            ticketsPendientes: this.ticketsPendientes,
            ultimos4Tickets: this.ultimos4Tickets
        }
    }

    //Leer el archivo json  
    init(){
        //Extraemos las propiedades de data.json
        const {diaDeHoy, ticketsPendientes, ultimoTicket, ultimos4Tickets} = require('../db/data.json');

        //validamos si se esta trabajando en el dia actual
        if (diaDeHoy === this.diaDeHoy) {
            this.ticketsPendientes = ticketsPendientes;
            this.ultimoTicket = ultimoTicket;
            this.ultimos4Tickets = ultimos4Tickets;
        } else {
            //Es otro día
            this.guardarEnLaBaseDeDatos();
        }

    }

    //Grabar informacion en el archivo json
    guardarEnLaBaseDeDatos() {
        //Creamos el path donde se va a guardar la data
        const dbPath = path.join(__dirname, '../db/data.json');

        //Guradamos la data en el json, como viene como string lo convertimos a json
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    //Metodo para atender el siguiente ticket
    siguienteTicket() {
        //Incrementamos el ultimo ticket en 1
        this.ultimoTicket += 1;
        //creamos una nueva instancia de tickets
        const ticket = new Ticket(this.ultimoTicket, null);

        //Agregamos el ticket al arreglo de tickets
        this.ticketsPendientes.push(ticket);

        //guardamos el ticket en la base de datos
        this.guardarEnLaBaseDeDatos();

        //retornamos el numero del ticket
        return 'Ticket' + ticket.numero;
    }

    //Metodo para atender el ticket
    atenderTicket(escritorio) {

        //validamos que no hayan tickets disponibles
        if (this.ticketsPendientes.length === 0) {
            return null
        }

        //validamos que hayan tickets disponibles
        const ticket = this.ticketsPendientes[0]; //extraemos el primer ticket del arreglo

        //Eliminamos el ticket que extraimos anteriormente, quiere decir que ya se atendio
        this.ticketsPendientes.shift(ticket);

        //Ticket a atender
        ticket.escritorioDeAtencion = escritorio;

        //Agregamos el ticket que se esta atendiendo al principio del arreglo de los ultimos 4 tickets
        this.ultimos4Tickets.unshift(ticket);

        //validamos que el arreglo solo mantenga 4 elementos
        if (this.ultimos4Tickets.length > 4) {
            //Empezamos a eliminar desde el ultimo elemento del arreglo, es decir -1 y solo cortamos 1 ticket
            this.ultimos4Tickets.splice(-1, 1);
        }

        //guardamos el ticket en la base de datos
        this.guardarEnLaBaseDeDatos();
        
        //retornamos el ticket que se tiene que atender
        return ticket;
    }
}


module.exports = TicketControl;