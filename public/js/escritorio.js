//Referencias al html
const lblEscritorio = document.querySelector('h1');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const btnAtenderTicket = document.querySelector('button');


//leemos los parametros que vienen en la url
const leerParamsDeUrl = new URLSearchParams(window.location.search);

//Si en la url no viene el parametro escritorio
if (!leerParamsDeUrl.has('escritorio')) {
    //redireccionamos al usuario al index
    window.location = 'index.html';
    //generamos un error.
    throw new Error('El escritorio es obligatorio');
}

//Saber en que escritorio me encuetro
const escritorio = leerParamsDeUrl.get('escritorio');
lblEscritorio.innerText = escritorio;

//Ocultamos la alerta de no hay tickets
divAlerta.style.display = 'none';

//Inicializamos la variable de socket
const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtenderTicket.disabled = false;
});

socket.on('disconnect', () => {
    //Si el servidor de sockets está desconectado, deshabilitamos el boton
    btnAtenderTicket.disabled = true;
});

//Enviamos al server de socket el evetno ultimo ticket
socket.on('tickets-pendientes', (ticketsPendientes) => {
    //Si no hay tickets por atender entonces no mostramos ningun numero
    if (ticketsPendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        //Si hay tickets por atender, mostramos la cantidad de tickets
        lblPendientes.style.display = '';
        lblPendientes.innerText = ticketsPendientes;
    }
});

//Evento click para cuando se haga click en el boton, atender un ticket
btnAtenderTicket.addEventListener( 'click', () => {
    //Emitimos un evento donde solicitamos el escritorio donde se está atendiendo y cual es el ticket atender
    socket.emit('atender-ticket', {escritorio}, (ticketAAtender) => {
        console.log(ticketAAtender);

        //Si ya no hay mas tickets por atender
        if (ticketAAtender.ok === false) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }

        //Mostramos el ticket que estamos atendiendo
        lblTicket.innerText = `Ticket ${ticketAAtender.ticketAAtender.numero}`;
    });
});