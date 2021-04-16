
// Referencias del HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

//Inicializamos la variable de socket
const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    //Si el servidor de sockets está desconectado, deshabilitamos el boton
    btnCrear.disabled = true;
});

//Enviamos al server de socket el evetno ultimo ticket
socket.on('ultimo-ticket', (ultimoTicket) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimoTicket;
});

//Evento click para cuando se haga click en el boton, generemos un nuevo ticket
btnCrear.addEventListener( 'click', () => {
    //Emitimos al servidor el evento siguiente-ticket 
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });
});