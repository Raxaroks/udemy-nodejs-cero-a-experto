const path = require("path");
const fs = require("fs");

// modelo del ticket
class Ticket {
    constructor( number, desktop ) {
        this.number = number;
        this.desktop = desktop;
    }
}


// clase para manejar tickets
class TicketControl {

    // método constructor
    constructor() {
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.lastFour = [];
        this.init();
    }

    // GETTER: retorna un objeto con la información del ticket control
    get toJSON() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            lastFour: this.lastFour
        }
    }

    // método para inicializar el ticket control
    init() {
        const { today, tickets, last, lastFour } = require("../db/data.json");

        if ( today === this.today ) {
            this.tickets = tickets;
            this.last = last;
            this.lastFour = lastFour;
        }
        else {
            this.saveToDB();
        }
    }

    // guardar la información de los tickets a la database
    saveToDB() {
        const databasePath = path.join( __dirname, "../db/data.json" );
        fs.writeFileSync( databasePath, JSON.stringify( this.toJSON ) );
    }

    // método para avanzar al siguiente ticket
    next() {
        this.last += 1;
        this.tickets.push( new Ticket( this.last, null ) );
        this.saveToDB();

        return `Ticket ${ this.last }`
    }

    // método para atender un ticket
    attendTicket( desktop ) {
        // si no hay tickets
        if ( this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift(); // borramos y retornamos el primer ticket
        ticket.desktop = desktop;

        this.lastFour.unshift( ticket );

        if ( this.lastFour.length > 4 ) {
            this.lastFour.splice(-1, 1); // elimina un elemento desde la última posición del arreglo
        }

        this.saveToDB();
        return ticket;
    }

}


module.exports = TicketControl;