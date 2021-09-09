const Task = require("./task");

class Tasks {
    _list = {};

    get listArr() {
        const l = [];
        Object.keys(this._list).forEach( key => {
            l.push( this._list[key] )
        } )
        return l;
    }

    constructor() {
        this._list = {};
    }

    createTask( desc = "" ) {
        const tsk = new Task(desc);
        this._list[tsk.id] = tsk;
    }

    deleteTask(id = "") {
        if ( this._list[id] ) {
            delete this._list[id];
        }
    }

    loadTasksFromArray( tasks = [] ) {
        tasks.forEach( task => {
            this._list[task.id] = task
        } );
    }

    fullList() {
        console.log();
        this.listArr.forEach( (task, i) => {
            const idx = `${ i+1 }`.green; 
            const { desc, completedIn } = task;
            const state = ( completedIn ) ? "Completada!".green : "Pendiente".red

            console.log( `${ idx } ${ desc } :: ${ state }` );
        } )
    }

    fullPendingOrCompleteList( complete = true ) {
        console.log();
        let count = 0;

        this.listArr.forEach( (task) => {
            const { desc, completedIn } = task;
            const state = ( completedIn ) ? "Completada!".green : "Pendiente".red

            if (complete) {
                if (completedIn) {
                    count ++;
                    console.log( `${ count.toString().green }) ${ desc } ::: ${ completedIn.green }` );
                }
            }

            else {
                if (!completedIn) {
                    count ++;
                    console.log( `${ count.toString().green }) ${ desc } ::: ${ state.red }` );
                }
            }
        } )
    }

    toggleCompleted( ids = [] ) {
        ids.forEach( id => {
            const task = this._list[id];
            if (!task.completedIn) {
                task.completedIn = new Date().toISOString();
            }
        } );

        this.listArr.forEach( task => {
            if ( !ids.includes(task.id) ) {
                this._list[task.id].completedIn = null;
            }
        } )
    }
}

module.exports = Tasks;