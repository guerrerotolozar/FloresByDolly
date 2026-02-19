const fs = require('fs');
const path = require('path');

const carpetasIgnorar = ['node_modules', '.git', 'dist', '.angular'];
const archivosIgnorar = ['package-lock.json', 'proyecto_completo.txt', 'unir.js'];

function leerDirectorio(dir, outputStream) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            if (!carpetasIgnorar.includes(file)) {
                leerDirectorio(filePath, outputStream);
            }
        } else {
            if (!archivosIgnorar.includes(file)) {
                outputStream.write(`\n--------------------------------------------------\n`);
                outputStream.write(`ARCHIVO: ${filePath}\n`);
                outputStream.write(`--------------------------------------------------\n`);
                outputStream.write(fs.readFileSync(filePath, 'utf8'));
                outputStream.write(`\n`);
            }
        }
    });
}

const stream = fs.createWriteStream('proyecto_completo.txt');
leerDirectorio('.', stream);
stream.end(() => console.log('¡Listo! Revisa el archivo proyecto_completo.txt'));