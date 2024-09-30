const helper = require('../helper.js');

class KlassenDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    loadAllSubjects() {
        var sql = 'SELECT * FROM subjects';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return result;
    }

    loadAllKlassen() {
        var sql = 'SELECT * FROM klassen ORDER BY name ASC';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return result;
    }

    exists_userKlasse(userID, klassenID) {
        var sql = 'SELECT COUNT(id) AS cnt, id FROM userKlassen WHERE userID=? AND klassenID=?';
        var statement = this._conn.prepare(sql);
        var params = [userID, klassenID];
        var result = statement.get(params);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    exists_klasse(klassenID) {
        var sql = 'SELECT COUNT(id) AS cnt FROM klassen WHERE id = ?'
        
        var statement = this._conn.prepare(sql);
        var result = statement.get(klassenID);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    exists_subject(subjectID) {
        var sql = 'SELECT COUNT(id) AS cnt FROM subjects WHERE id = ?'
        
        var statement = this._conn.prepare(sql);
        var result = statement.get(subjectID);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    exists_userSubjects(userID, subjectID) {
        var sql = 'SELECT COUNT(id) AS cnt, id FROM userSubjects WHERE userID=? AND subjectID=?';
        var statement = this._conn.prepare(sql);
        var params = [userID, subjectID];
        var result = statement.get(params);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    exists_klassenSubject(klassenID, subjectID) {
        var sql = 'SELECT COUNT(id) AS cnt, id FROM klassenSubjects WHERE klassenID=? AND subjectID=?';
        var statement = this._conn.prepare(sql);
        var params = [klassenID, subjectID];
        var result = statement.get(params);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    createKlasse(id, name, longName) {
        var sql = 'INSERT INTO klassen (id, name, longName) VALUES (?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [id, name, longName];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createKlasse: ", ex);
            return false;
        }
    }

    createUserKlasse(userID, klassenID) {
        var sql = 'INSERT INTO userKlassen (userID, klassenID) VALUES (?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [userID, parseInt(klassenID)];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createUserKlasse: ", ex);
            return false;
        }
    }

    createSubject(id, name, longName) {
        var sql = 'INSERT INTO subjects (id, name, longName) VALUES (?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [id, name, longName];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createKlasse: ", ex);
            return false;
        }
    }

    create_userSubjects(userID, subjectID) {
        var sql = 'INSERT INTO userSubjects (userID, subjectID) VALUES (?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [userID, parseInt(subjectID)];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function create_userSubjects: ", ex);
            return false;
        }
    }

    create_klassenSubject(klassenID, subjectID) {
        var sql = 'INSERT INTO klassenSubjects (klassenID, subjectID) VALUES (?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [klassenID, subjectID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function create_klassenSubjects: ", ex);
            return false;
        }
    }

    delete_userSubjects(userID, subjectID) {
        var sql = 'DELETE FROM userSubjects WHERE userID = ? AND subjectID = ?';
        var statement = this._conn.prepare(sql);
        var params = [userID, subjectID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function delete_userSubjects: ", ex);
            return false;
        }       
    }

    deleteSubject(subjectID) {
        var sql = 'DELETE FROM subjects WHERE id = ?';
        var statement = this._conn.prepare(sql);
        var params = [subjectID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteSubject: ", ex);
            return false;
        }
    }

    deleteKlasse(klassenID) {
        var sql = 'DELETE FROM klassen WHERE id = ?';
        var statement = this._conn.prepare(sql);
        var params = [klassenID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteKlasse: ", ex);
            return false;
        }
    }

    deleteUserKlasse(userID, klassenID) {
        var sql = 'DELETE FROM userKlassen WHERE userID = ? AND klassenID = ?';
        var statement = this._conn.prepare(sql);
        var params = [userID, klassenID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteUserKlasse: ", ex);
            return false;
        }
    }

    delete_userSubjectsOfKlasse(userID, klassenID) {
        var sql =  `DELETE FROM userSubjects WHERE subjectID IN (
            SELECT subjectID
            FROM klassenSubjects
            WHERE klassenID = ?
        )
        AND userID = ?`
        var statement = this._conn.prepare(sql);
        var params = [klassenID, userID];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteKlasse: ", ex);
            return false;
        }
    }

    loadSelectedKlassenOfUser(userId) {
        const sql = 'SELECT klassen.id, klassen.name FROM klassen ' +
        'INNER JOIN userKlassen uk ON klassen.ID = uk.klassenID ' +
        'WHERE uk.userID = ?';
        var statement = this._conn.prepare(sql);
        const result = statement.all(userId);
        return result;
    }

    loadSubjectsOfKlasse(klassenId) {
        const sql = 'SELECT s.id, s.name FROM subjects s ' +
        'INNER JOIN klassenSubjects ks ON s.ID = ks.subjectID ' +
        'WHERE ks.klassenID = ? ' +
        'ORDER BY s.name'
        var statement = this._conn.prepare(sql)
        const result = statement.all(klassenId)
        return result;
    }

    loadSelectedSubjectsOfUser(userId){
        const sql = 'SELECT s.id, s.name, s.longName FROM subjects s ' +
        'INNER JOIN userSubjects us ON s.id = us.subjectID ' +
        'WHERE us.userID = ?';
        var statement = this._conn.prepare(sql);
        const result = statement.all(userId);
        return result;
    }

    loadLessonsOfSubjectFor(subjectId, startDate, endDate){
        // TODO: lessons für bestimmten zeitraum laden
        const sql = 'SELECT id, teacherID, roomID, origRoomID, date, startTime, endTime, canceled, info, lsText ' +
        'FROM lessons WHERE subjectID = ? ' + 
        'AND date >= ? ' + // startDate
        'AND date <= ?' // endDate
        var statement = this._conn.prepare(sql)
        const result = statement.all(subjectId, startDate, endDate);
        return result;
    }    

    // loadLessonsOfSubjectFor(subjectId, startDate, endDate){
    //     // TODO: lessons für bestimmten zeitraum laden
    //     const sql = 'SELECT * FROM (SELECT id, teacherID, roomID, origRoomID, date, startTime, endTime, canceled, info, lsText ' +
    //     'FROM lessons WHERE subjectID = ? ' + 
    //     'AND date >= ? ' + // startDate
    //     'AND date <= ? ' + // endDate
    //     'ORDER BY startTime ASC) ORDER BY date' // aufsteigend sortieren
    //     var statement = this._conn.prepare(sql)
    //     const result = statement.all(subjectId, startDate, endDate);
    //     return result;
    // }

    loadSelectedSubjectsOfKlasse(userID, klassenID) {
        const sql = `SELECT ks.subjectID AS id FROM klassenSubjects ks
        INNER JOIN userSubjects us
        ON ks.subjectID = us.subjectID
        WHERE us.userID = ?
        AND ks.klassenID = ?`
        var statement = this._conn.prepare(sql)
        const result = statement.all(userID, klassenID);
        return result;
    }

    loadTeacher(teacherID) {
        const sql = 'SELECT name, longName FROM teachers WHERE id = ?'
        var statement = this._conn.prepare(sql)
        const result = statement.get(teacherID);
        return result;

    }

    loadRoom(roomID) {
        const sql = 'SELECT name, longName FROM rooms WHERE id = ?'
        var statement = this._conn.prepare(sql)
        const result = statement.get(roomID);
        return result;
    }

    loadKlassenOfSubject(subjectID, userID) {
        const sql = `SELECT * FROM klassen k
        INNER JOIN klassenSubjects ks
        ON k.id = ks.klassenID
        WHERE ks.subjectID = ?
        AND k.id IN (
            SELECT klassenID FROM userKlassen
            WHERE userID = ?
        )
        `
        var statement = this._conn.prepare(sql)
        const result = statement.all(subjectID, userID);
        return result;

    }
}
 
module.exports = KlassenDao;