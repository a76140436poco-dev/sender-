const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'database.json');

let db = {};
if (fs.existsSync(DB_FILE)) {
 db = JSON.parse(fs.readFileSync(DB_FILE));
}

module.exports = {
 getDb: () => db,
 saveDb: () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)),
 addUser: (id, data) => {
 if (!db[id]) db[id] = data;
 module.exports.saveDb();
 },
 getUser: (id) => db[id],
 updateUser: (id, data) => {
 if (db[id]) {
 db[id] = {...db[id],...data };
 module.exports.saveDb();
 }
 },
 getAllUsers: () => db
};
