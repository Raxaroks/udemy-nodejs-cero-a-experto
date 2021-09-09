// external imports
const { inqMenu, pause, readInput, deleteList, confirmDelete, showCheckList } = require("./helpers/inquirer");
const { saveDB, readDB } = require("./helpers/saveFile");
const Task = require("./models/task");
const Tasks = require("./models/tasks");
require("colors");

console.clear();

const main = async () => {
	let opt = "";

    const tsks = new Tasks();
    const tsksDB = readDB();

    if (tsksDB) {
        // set tasks
        tsks.loadTasksFromArray(tsksDB);
    }

	do {
        // imprimiendo el menú
		opt = await inqMenu();

        switch(opt) {
            case "1":
                const desc = await readInput("Descripción: ");
                tsks.createTask(desc);
            break;

            case "2":
                tsks.fullList()
            break;

            case "3":
                tsks.fullPendingOrCompleteList(true)
            break;

            case "4":
                tsks.fullPendingOrCompleteList(false)
            break;

            case "5":
                const ids = await showCheckList(tsks.listArr);
                tsks.toggleCompleted(ids)
            break;

            case "6":
                const id = await deleteList( tsks.listArr );
                if (id !== "0") {
                    const ok = await confirmDelete("¿Estás seguro?");
                    if (ok) {
                        tsks.deleteTask(id);
                        console.log("Tarea eliminada.");
                    }
                }
            break;

            // case "3":
            // break;
        }

        // guardamos la data en un archivo
        saveDB( tsks.listArr )

        await pause();
	} while (opt !== "0");

	showMenu();
};

// run
main();
