require("dotenv").config();
const { readInput, inqMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");


const main = async () => {
    // limpiando consola
    console.clear();

    const searches = new Searches();
    let opt;

    do {
        // recibimos la opción del menú
        opt = await inqMenu();

        switch( opt ) {
            case 1:
                const keyword = await readInput("Ciudad: ");

                // buscando los lugares
                const places = await searches.city( keyword );

                // seleccionamos el lugar
                const id_selected = await listPlaces( places );
                if (id_selected === '0')
                    continue;

                // guardar en el historial
                const selected_place = places.find( pl => pl.id === id_selected );
                searches.addHistory( selected_place.nombre );

                // obtener el clima del lugar
                const weather = await searches.weatherPlace( selected_place.lat, selected_place.lng );

                // mostrando resultados
                console.log( "\nInformación de la ciudad\n".green );
                console.log( "Ciudad            :", selected_place.nombre );
                console.log( "Latitud           :", selected_place.lat );
                console.log( "Longitud          :", selected_place.lng );
                console.log( "Temperatura       :", weather.temp );
                console.log( "Temp. mínima      :", weather.min );
                console.log( "Temp. máxima      :", weather.max );
                console.log( "Estado del tiempo :", weather.desc );
                break;
                
            case 2:
                searches.upperHistory.forEach( (place, i) => {
                    const idx = `${ i+1 }`.green;
                    console.log( `${ idx }) ${ place }` );
                } );
                break;
        }

        // pausamos el flujo del programa
        if ( opt !== 0 ) await pause();
    } while( opt !== 0 );

    // limpiando consola
    console.clear();
}

main();