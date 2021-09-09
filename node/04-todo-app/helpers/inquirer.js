const inquirer = require("inquirer");
require("colors");

const questions = [
    {
        type: "list",
        name: "option",
        message: "¿Qué desea hacer?",
        choices: [
            {
                value: "1",
                name: `${ "1)".green } Crear una tarea`
            },
            {
                value: "2",
                name: `${ "2)".green } Listar tareas`
            },
            {
                value: "3",
                name: `${ "3)".green } Listar tareas completadas`
            },
            {
                value: "4",
                name: `${ "4)".green } Listar tareas pendientes`
            },
            {
                value: "5",
                name: `${ "5)".green } Completar tarea(s)`
            },
            {
                value: "6",
                name: `${ "6)".green } Borrar tarea`
            },
            {
                value: "0",
                name: `${ "0)".red } SALIR`
            },
        ]
    },
]; 

const inqMenu = async () => {
    console.clear();
    console.log("======================================".yellow);
    console.log( `\t   ${ "MENÚ PRINCIPAL".magenta.bold } `);
    console.log("======================================\n".yellow);

    const { option } = await inquirer.prompt( questions );
    return option;
}

const pause = async () => {
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${ "ENTER".red.bold } para continuar . . .`
        }
    ];

    console.log("\n");
    await inquirer.prompt(question);
}

const readInput = async ( msg ) => {
    const question = [
        {
            type: "input",
            name: "desc",
            message: msg,
            validate(value) {
                if (value.length === 0) {
                    return "Por favor, ingrese algún valor"
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const deleteList = async (tasks = []) => {
    const choices = tasks.map( (task, i) => {
        const idx = `${i+1}`.green
        return {
            value: task.id,
            name: `${ idx }) ${ task.desc }`
        }
    } );

    choices.unshift({
        value: "0",
        name: "0)".green + " Cancelar"
    })

    const questions = [
        {
            type: "list",
            name: "id",
            message: "Borrar",
            choices
        }
    ];

    const {id} = await inquirer.prompt(questions);
    return id;
}

const confirmDelete = async msg => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message: msg
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;
}

const showCheckList = async (tasks = []) => {
    const choices = tasks.map( (task, i) => {
        const idx = `${i+1}`.yellow
        return {
            value: task.id,
            name: `${ idx }) ${ task.desc }`,
            checked: (task.completedIn) ? true : false
        }
    } );

    const question = [
        {
            type: "checkbox",
            name: "ids",
            message: "Selecciones",
            choices
        }
    ];

    const { ids } = await inquirer.prompt(question);
    return ids;
}

module.exports = {
    inqMenu,
    pause,
    readInput,
    deleteList,
    confirmDelete,
    showCheckList
}