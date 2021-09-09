const fs = require("fs");
const colors = require("colors");


const printMultTable = ( number, flag, until ) => {
    console.clear();   

    let output = "";
    for (let i=1; i<=until; i++) {
        output += `${ number } x ${ i } = ${ number * i }\n`;
    }

    if (flag) {
        console.log("\n=========================".green);
        console.log(`\tTabla del ${ colors.magenta(number) }` );
        console.log("=========================".green);
        console.log(output);
    }

    return output;    
}

const makeFile = async(base = 1, flag = false, until ) => {

    try {
        fs.writeFileSync( "./output/tabla_mult.txt", printMultTable(base, flag, until));
        return("Archivo creado exitosamente.");
    } catch (error) {
        throw error
    }

}

module.exports = {
    makeFile
};