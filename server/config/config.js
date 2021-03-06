// ================
// PUERTO
// ================
process.env.PORT = process.env.PORT || 3000;
// ================
// ENTORNO
// ================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// TOKEN VENCIMIENTO
// ================
/*
60 Segundos
60 Minutos
24 Horas
30 Días
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// ================
// SEED DE AUTENTICACION
// ================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// ================
// GOOGLE CLIENT ID
// ================
process.env.CLIENT_ID = process.env.CLIENT_ID || '87725520912-kn9kohvcrpq5bgjr4rur27uk815k4e7r.apps.googleusercontent.com';
// ================
// BASE DE DATOS
// ================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_DB;
}
process.env.URLDB = urlDB;