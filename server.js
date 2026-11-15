require('dotenv').config();

const app = require("./app");
const pool = require("./services/mysql.service");
const cron = require('node-cron');


const ticketsService = require('./services/tickets.service');

console.log(
    'Archivo tickets.service cargado:',
    require.resolve('./services/tickets.service')
);
const PORT = 5000;

async function startServer() {
    try {
        const conexion = await pool.getConnection();

        console.log("Connection to MySQL successful");

        conexion.release();

       
        try {
            const updatedTickets =
                await ticketsService.completeFinishedEventTickets();

            console.log(
                `Entradas actualizadas al iniciar: ${updatedTickets}`
            );

        } catch (error) {
            console.error(
                "Error actualizando entradas iniciales:",
                error.message
            );
        }

       
        cron.schedule('* * * * *', async () => {

            try {
                const updatedTickets =
                    await ticketsService.completeFinishedEventTickets();

                if (updatedTickets > 0) {
                    console.log(
                        `${updatedTickets} entrada(s) actualizada(s) a completed`
                    );
                }

            } catch (error) {
                console.error(
                    "Error en la actualización automática:",
                    error.message
                );
            }

        });

        console.log("Automatic ticket status update enabled");

        app.listen(PORT, () => {
            console.log(`Server running in http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error connecting to MySQL:", error.message);
    }
}

startServer();