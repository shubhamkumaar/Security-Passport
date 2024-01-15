import pg from "pg"
const db = new pg.Client({
    user:"postgres",
    database:"Authentication",
    host:"localhost",
    password:"123456",
    port:5432,
});
db.connect();
export default db;