class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    //exists(username, password) {
        //var sql = 'SELECT COUNT(id) AS cnt, id FROM users WHERE username=? AND password=?';
    exists(username) {    
        var sql = 'SELECT COUNT(id) AS cnt, id, password FROM users WHERE username=?';
        var statement = this._conn.prepare(sql);
        //var params = [username, password];
        var params = [username];
        var result = statement.get(params);

        if (result.cnt == 1) 
            //return result.ID;
            return result

        return false;
    }

    isunique(username) {
        var sql = 'SELECT COUNT(id) AS cnt FROM users WHERE username=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(username);

        if (result.cnt == 0) 
            return true;

        return false;
    }

    create(username, password) {
        var sql = 'INSERT INTO users (username,password) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [username, password];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return;
    }

    toString() {
        console.log('userDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserDao;