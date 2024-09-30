const helper = require('../helper.js');

class LessonDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    loadAllLessons() {
        var sql = 'SELECT * FROM lessons';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return result;
    }

    loadAllRooms() {
        var sql = 'SELECT * FROM rooms';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return result;
    }

    loadAllTeachers() {
        var sql = 'SELECT * FROM teachers';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return result;
    }

    createTeacher(id, name, longName) {
        var sql = 'INSERT INTO teachers (id, name, longName) VALUES (?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [id, name, longName];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createTeacher: ", ex);
            return false;
        }
    }

    createRoom(id, name, longName) {
        var sql = 'INSERT INTO rooms (id, name, longName) VALUES (?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [id, name, longName];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createRoom: ", ex);
            return false;
        }
    }
    
    createLesson(id, subjectID, teacherID, roomID, originRoomID, date, startTime, endTime, canceled, info, lsText) {
        var sql = 'INSERT INTO lessons (id, subjectID, teacherID, roomID, origRoomID, date, startTime, endTime, canceled, Info, lsText) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [id, subjectID, teacherID, roomID, originRoomID, date, startTime, endTime, canceled, info, lsText];
    
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createLesson: ", ex);
            return false;
        }
    }

    updateLesson(id, subjectID, teacherID, roomID, originRoomID, date, startTime, endTime, canceled, info, lsText) {
        var sql = 'UPDATE lessons SET  subjectID = ?, teacherID = ?, roomID = ?, origRoomID = ?, date = ?, startTime = ?, endTime = ?, canceled = ?, Info = ?, lsText = ? WHERE id = ?';
        var statement = this._conn.prepare(sql);
        var params = [subjectID, teacherID, roomID, originRoomID, date, startTime, endTime, canceled, info, lsText, id];
    
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function createRoom: ", ex);
            return false;
        }
    }

    deleteTeacher(id) {
        var sql = 'DELETE FROM teachers WHERE id = ?';
        var statement = this._conn.prepare(sql);
        var params = [id];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteTeacher: ", ex);
            return false;
        }
    }

    deleteRoom(id) {
        var sql = 'DELETE FROM rooms WHERE id = ?';
        var statement = this._conn.prepare(sql);
        var params = [id];
        
        try {
            var result = statement.run(params);
            if (result.changes > 0) 
                return true;
            return false;
        } catch (ex) {
            console.log("Error executing SQL Statement in function deleteRoom: ", ex);
            return false;
        }
    }

    existsLesson(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM lessons WHERE id = ?'
        
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    existsTeacher(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM teachers WHERE id = ?'
        
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt >= 1) 
            return true;

        return false;
    }

    existsRoom(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM rooms WHERE id = ?'
        
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt >= 1) 
            return true;

        return false;
    }
}
 
module.exports = LessonDao;