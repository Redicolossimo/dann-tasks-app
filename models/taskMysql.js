const mysql = require('mysql')

// const connection = mysql.createConnection({
//     host: 'localhost',
// })

// connection.connect((err) => {
//     connection.query()
// })

const pool = mysql.createPool({
    host: 'localhost',
    database: 'tasks',
    user: 'root',
    password: '1234',
    connectionLimit: 12,
    // waitForConnections: true,
})

class Task {
    static getAll(){
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    reject(err)
                }

                pool.query('SELECT * FROM tasks', (err, rawRows) => {
                    if(err){
                        reject(err)
                    }

                    const rows = JSON.parse(JSON.stringify(rawRows))

                    connection.release()
                    resolve(rows)
                })
            })
        })
    }

    static add(task){
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    reject(err)
                }

                pool.query('INSERT INTO tasks SET ?', task, (err, result) => {
                    if(err){
                        reject(err)
                    }

                    connection.release()
                    if(result.insertId){
                        resolve(result.insertId)
                    } else {
                        reject(new Error('result.insertId'))
                    }
                    
                })
            })
        })
    }
}

module.exports = Task