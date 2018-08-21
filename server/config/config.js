// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

/*if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {*/
urlDB = 'mongodb://cafe-user:Mauro920328-@ds229552.mlab.com:29552/cafe';
//}
process.env.URLDB = urlDB;

//mongodb://cafe-user:<dbpassword>@ds229552.mlab.com:29552/cafe