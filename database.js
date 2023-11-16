import mysql from 'mysql';
export default class DatabaseService {
    constructor(){
        mysql.createConnection({
            host     : 'localhost',
            user     : 'me',
            password : 'secret',
            database : 'my_db'
          })
    }
}