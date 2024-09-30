const { WebUntisElementType } = require('webuntis');
const webuntis = require('webuntis');
const KlassenDao = require('./dao/KlassenDao.js');
const LessonDao = require('./dao/LessonDao.js');
const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
  });

class UntisDbFetcher {
    
    constructor(dbConnection) {
        this.klassen = new KlassenDao(dbConnection);
        this.lessons = new LessonDao(dbConnection);
        this.untis = new webuntis.WebUntisAnonymousAuth('HS-Albstadt', 'hepta.webuntis.com');
    }
    

    async fetchDb() {
        await this.untis.login();
        await this.#fetchClasses();
        await this.#fetchSubjects();
        await this.#fetchRooms();
        this.untis.logout();
        await this.#fetchLessons();
    }

    async #fetchRooms() {
        try{
            var rooms = await this.untis.getRooms();
            for(var room of rooms) {
                var id = room['id'];
                var name = room['name'];
                var longName = room['longName'];
                if(!this.lessons.existsRoom(id)) {
                    this.lessons.createRoom(id, name, longName);
                }   
            }
            //Check if room exist in untisData
            var dbRooms = await this.lessons.loadAllRooms();
            for(var room of dbRooms) {
                var exist = false;
                for(var untisRoom of rooms) {
                    if(untisRoom['ID'] == room['id']) {
                        exist = true;
                        break;
                    }
                }
                if(!exist) {
                    this.lessons.deleteRoom(room['id']);
                }
            }
        } catch(ex){
            console.log("Error fetching Rooms: " + ex);
        }
    }

    async #fetchClasses() {
        try{
            var classes = await this.untis.getClasses();
            for(var course of classes) {
                var id = course['id'];
                var name = course['name'];
                var longName = course['longName'];
                if(!this.klassen.exists_klasse(id)) {
                    this.klassen.createKlasse(id, name, longName);
                }   
            }
            //Check if klasse exist in untisData
            var dbClasses = await this.klassen.loadAllKlassen();
            for(var course of dbClasses) {
                var exist = false;
                for(var untisCourse of classes) {
                    if(untisCourse['ID'] == course['id']) {
                        exist = true;
                        break;
                    }
                }
                if(!exist) {
                    this.klassen.deleteKlasse(course['id']);
                }
            }
        } catch(ex){
            console.log("Error fetching Classes: " + ex);
        }
    }

    async #fetchSubjects() {
        try{
            var subjects = await this.untis.getSubjects();
            for(var subject of subjects) {
                var id = subject['id'];
                var name = subject['name'];
                var longName = subject['longName'];
                if(!this.klassen.exists_subject(id)) {
                    this.klassen.createSubject(id, name, longName);
                }   
            }
            //Check if subject exist in untisData
            var dbSubjects = await this.klassen.loadAllSubjects();
            for(var subject of dbSubjects) {
                var exist = false;
                for(var untisSubject of subjects) {
                    if(untisSubject['ID'] == subject['id']) {
                        exist = true;
                        break;
                    }
                }
                if(!exist) {
                    this.klassen.deleteSubject(subject['id']);
                }
            }
        } catch(ex){
            console.log("Error fetching Subjects: " + ex);
        }
    }

    async #fetchLessons(){
        await this.untis.login();
        const currentSchoolyear = await this.untis.getCurrentSchoolyear();
        const klassen = this.klassen.loadAllKlassen();
        var timetables = [];
        try {
            for(var klasse of klassen) {
                try {
                    var timetable = await this.untis.getTimetableForRange(currentSchoolyear.startDate, currentSchoolyear.endDate, klasse.ID, WebUntisElementType.CLASS, true);
                    timetables.push(timetable);
                    await delay(10);
                } catch (ex) {
                    console.log("Error fetching Lessons for Class " + klasse.name + ": " + ex)
                }
            }
            await this.untis.logout();
            timetables.forEach(async (klassenLessons) => {
                klassenLessons.forEach(async (lesson) => {
                    const id = lesson.id;
                    const date = lesson.date.toString();
                    const startTime = lesson.startTime.toString();
                    const endTime = lesson.endTime.toString();
                    const lessonKlassen = lesson.kl;
                    const teacher = lesson.te != undefined && lesson.te.length != 0 && lesson.te[0].id != 0 ? lesson.te[0].id : null;
                    const subject = lesson.su != undefined && lesson.su.length != 0 && lesson.su[0].id != 0 ? lesson.su[0].id : null;
                    const room = lesson.ro != undefined && lesson.ro.length != 0 && lesson.ro[0].id != 0 ? lesson.ro[0].id : null;
                    const lsText = lesson.lstext != undefined ? lesson.lstext : "";
                    const info = lesson.info != undefined ? lesson.info : "";
                    const canceled = lesson.code == 'cancelled' ? 1 : 0;
                    //insert teacher
                    if(!this.lessons.existsTeacher(teacher) && teacher != null) {
                        this.lessons.createTeacher(lesson.te[0].id, lesson.te[0].name, lesson.te[0].longName);
                    }
                    //insert lesson
                    if(this.lessons.existsLesson(id)) {
                        this.lessons.updateLesson(id, subject, teacher, room, room, date, startTime, endTime, canceled, info, lsText);
                    } else {
                        this.lessons.createLesson(id, subject, teacher, room, room, date, startTime, endTime, canceled, info, lsText);
                    }
                    lessonKlassen.forEach(async (klasse) => {
                        if(!this.klassen.exists_klassenSubject(klasse.id, subject)) {
                            this.klassen.create_klassenSubject(klasse.id, subject);
                        }
                    }); 
                });
            });
        } catch (ex) {
            console.log("Error fetching Lessons: " + ex)
        }

    }
}

module.exports = UntisDbFetcher;
