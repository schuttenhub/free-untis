const express = require("express"); //express wird importiert und der const express zugewiesen
var serviceRouter = express.Router(); //neuer Router wird erstellt
const KlassenDao = require("../dao/KlassenDao.js");     // Import der Datenzugriffsschicht für Klassen
const LessonDao = require("../dao/LessonDao.js");       // Import der Datenzugriffsschicht für Stunden
const helper = require("../helper.js");                 // Hilfsfunktionen für Authentifizierung und andere Aufgaben

console.log("- Service Calendar");

// Endpunkt zum Laden aller Klassenn
serviceRouter.get("/getKlassen", helper.authenticateToken, (req, res) => {
    const klassenDao = new KlassenDao(req.app.locals.dbConnection);  // Datenzugriff auf Klassen über DAO
    // Lade alle Klassen aus der Datenbank
    var result = klassenDao.loadAllKlassen();
    res.status(200).json(result); // Antwort mit JSON-Daten der Klassen
});

// Endpunkt zum Laden aller Stundenpläne
serviceRouter.get("/getLessons", (req, res) => {
    const klassenDao = new LessonDao(req.app.locals.dbConnection); // Datenzugriff auf Stunden über DAO
    // Lade alle Stundenpläne aus der Datenbank
    var result = klassenDao.loadAllLessons();
    res.status(200).json(result);   // Antwort mit JSON-Daten der Stundenpläne
});

// Endpunkt zum Laden aller Räume
serviceRouter.get("/getRooms", (req, res) => {
    const klassenDao = new LessonDao(req.app.locals.dbConnection); // Datenzugriff auf Räume über DAO
    // Lade alle Räume aus der Datenbank
    var result = klassenDao.loadAllRooms();
    res.status(200).json(result);   // Antwort mit JSON-Daten der Räume
});

// Endpunkt zum Hinzufügen einer Klasse zu den Benutzerklassen
serviceRouter.post("/addKlasse", helper.authenticateToken, (req, res) => {
    var userID = req.userid; // Benutzer-ID aus dem Token extrahieren

    var klassenID = parseInt(req.body.klassenID); // ID der hinzuzufügenden Klasse aus dem Request-Body
    const klassenDao = new KlassenDao(req.app.locals.dbConnection); // Datenzugriff auf Klassen über DAO

    // Überprüfen, ob der Benutzer bereits die Klasse ausgewählt hat
    if (klassenDao.exists_userKlasse(userID, klassenID)) {
        return; // Wenn ja, keine weitere Aktion erforderlich
    }

    try {
        // Klasse zur Auswahl des Benutzers hinzufügen
        const result = klassenDao.createUserKlasse(userID, klassenID);
        if (result) {
            return res.status(200).json({ message: "Klasse hinzugefuegt" });// Erfolgreiche Antwort
        } else {
            return res.status(400).json({ error: true, message: "Hinzufuegen von Klasse fehlgeschlagen" });// Fehlerhafte Antwort
        }
    } catch (ex) {  
        console.error(
            "Service Calendar: Error adding new Klasse. Exception 0ccured: " +
            ex.message
        );
        res.status(400).json({ error: true, message: "Hinzufuegen von Klasse fehlgeschlagen" }); // Fehlerhafte Antwort bei Ausnahme
    }
});

// Endpunkt zum Laden der ausgewählten Klassen und Fächer des Benutzers
serviceRouter.get("/getUserKlassenAndSubjects", helper.authenticateToken, (req, res) => {
    var userID = req.userid; // Benutzer-ID aus dem Token extrahieren

    const klassenDao = new KlassenDao(req.app.locals.dbConnection); // Datenzugriff auf Klassen über DAO

    try {
        // Laden aller ausgewählten Klassen des Benutzers
        const selectedKlassen = klassenDao.loadSelectedKlassenOfUser(userID);
        result_data = [];

        // Schleife zum Hinzufügen der Fächer zu den Klassen
        selectedKlassen.forEach(klasse => {

            // Laden aller Fächer der Klasse
            const subjects = klassenDao.loadSubjectsOfKlasse(klasse.ID);

            // Hinzufügen des Parameters "selected" zu den Fächern
            subjects.forEach(subject => {
                if (klassenDao.exists_userSubjects(userID, subject.ID)) {
                    subject.selected = true; // Fach ist ausgewählt
                } else {
                    subject.selected = false; // Fach ist nicht ausgewählt
                }
            });

            // Objekt für Klasse mit Fächern erstellen und hinzufügen
            klassenObj = {
                id: klasse.ID,
                name: klasse.name,
                subjects: subjects
            }
            result_data.push(klassenObj)
        });

        res.status(200).json(result_data);// Erfolgreiche Antwort mit JSON-Daten der Klassen und Fächer

        //return Format
        //[
        //    {
        //      "klasse": {
        //        "id": "1",
        //        "name": "ITS-1_22.2",
        //        "subjects": [
        //          {
        //            "id": "1",
        //            "name": "Progr1";
        //            "selected": true
        //          },
        //          {
        //            "id": "2",
        //            "name": "EinfInf",
        //            "selected": false
        //          }
        //        ]
        //      }
        //    }
        //]

    } catch (ex) {
        console.error(
            "Service Calendar: Error checking if record exists. Exception occured: " +
            ex.message
        );
        res.status(400).json({ error: true, message: "Login fehlgeschlagen" }); // Fehlerhafte Antwort bei Ausnahme
    }
});

// Endpunkt zum Löschen einer Klasse aus den Benutzerklassen
serviceRouter.post("/deleteKlasse", helper.authenticateToken, (req, res) => {
    const klassenID = req.body.klassenID; // ID der zu löschenden Klasse aus dem Request-Body
    const userID = req.userid; // Benutzer-ID aus dem Token extrahieren

    const klassenDao = new KlassenDao(req.app.locals.dbConnection); // Datenzugriff auf Klassen über DAO

    try {
        const result = klassenDao.deleteUserKlasse(userID, klassenID); // Klasse des Benutzers löschen

        // Löschen der ausgewählten Fächer der gelöschten Klasse, wenn sie in keiner anderen ausgewählten Klasse vorhanden sind
        const selectedSubjectsOfDeletedKlasse = klassenDao.loadSelectedSubjectsOfKlasse(userID, klassenID)
        const selectedClasses = klassenDao.loadSelectedKlassenOfUser(userID)
        selectedSubjectsOfDeletedKlasse.forEach(subject => {
            var isDuplicate = false;
            selectedClasses.forEach(klasse => {
                const subjects = klassenDao.loadSubjectsOfKlasse(klasse.ID)
                if (subject.id in subjects.map(s => s.ID)){
                    isDuplicate = true
                }
            });
            if (!isDuplicate){
                klassenDao.delete_userSubjects(userID, subject.id)
            }
        });

        if (result) {
            return res.status(200).json({ message: "Klasse geloescht" }); // Erfolgreiche Antwort
        } else {
            return res.status(400).json({ error: true, message: "Loeschen von Klasse fehlgeschlagen!" }); // Fehlerhafte Antwort
        }
    } catch (ex) {
        console.error(
            "Service Calendar: Error deleting Klasse from User. Exception occured: " +
            ex.message
        );
        res.status(400).json({ error: true, message: "Loeschen von Klasse fehlgeschlagen!" }); // Fehlerhafte Antwort bei Ausnahme
    }

});

// Endpunkt zum Laden der Stundenpläne für einen bestimmten Zeitraum
serviceRouter.get('/calendar', helper.authenticateToken, (req, res) => {
    // TODO: userid wieder über session setzten. nur zum testen so
    const userID = req.userid; // Benutzer-ID aus dem Token extrahieren

    var startDate = req.query.start; // Startdatum des Zeitraums aus der Query-Parameter
    var endDate = req.query.end; // Enddatum des Zeitraums aus der Query-Parameter
    // Validierung von startDate und endDate
    if (startDate === undefined || endDate === undefined)
        return res.status(400).json({error: true, message: "Kein Zeitraum angegeben!"})
    if (startDate > endDate)
        return res.status(400).json({error: true, message: "Ungültiger Zeitraum!"})
    // Check if date has the right format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(startDate) || !regex.test(endDate))
        return res.status(400).json({error: true, message: "Ungültiges Datumsformat!"})

    startDate = startDate.replace(/-/g,'');
    endDate = endDate.replace(/-/g,'');

    const klassenDao = new KlassenDao(req.app.locals.dbConnection);

    const selectedSubjects = klassenDao.loadSelectedSubjectsOfUser(userID);
    var lessons = []
    selectedSubjects.forEach(subject => {
        const lessonsOfSubject = klassenDao.loadLessonsOfSubjectFor(subject.ID, startDate, endDate)
        const klassenOfSubject = klassenDao.loadKlassenOfSubject(subject.ID, userID)
        lessonsOfSubject.forEach(lesson => {
            const teacher = klassenDao.loadTeacher(lesson.teacherID)
            const room = klassenDao.loadRoom(lesson.roomID)
            const origRoom = klassenDao.loadRoom(lesson.origRoomID)
            
            lessons.push({
                id: lesson.ID,
                subject: subject,
                teacher: teacher,
                room: room,
                origRoom: origRoom,
                date: `${lesson.date.slice(0, 4)}-${lesson.date.slice(4, 6)}-${lesson.date.slice(6)}`,
                startTime: lesson.startTime,
                endTime: lesson.endTime,
                canceled: lesson.canceled,
                info: lesson.info,
                lsText: lesson.lsText,
                klassen: klassenOfSubject
            });
        });

        lessons.sort((a, b) => {
            // Compare dates first
            if (a.date < b.date) {
              return -1;
            }
            if (a.date > b.date) {
              return 1;
            }
            // If dates are the same, compare start times
            if (parseInt(a.startTime) < parseInt(b.startTime)) {
              return -1;
            }
            if (parseInt(a.startTime) > parseInt(b.startTime)) {
              return 1;
            }
            return 0; // Both date and startTime are the same
        });
    });
    return res.status(200).json(lessons);
})


serviceRouter.post("/select_subject", helper.authenticateToken, (req, res) => {
    var userID = req.userid; 

    const subjectID = req.body.subjectID;

    const klassenDao = new KlassenDao(req.app.locals.dbConnection);

    try {
        if (!klassenDao.exists_subject(subjectID)) {
            return res.status(400).json({ error: true, message: "Fach existiert nicht!" });
        }
        const result = klassenDao.create_userSubjects(userID, subjectID);
        if (result) {
            return res.status(200).json();
        } else {
            return res.status(400).json({ error: true, message: "Auswählen des Fachs fehlgeschlagen!" });
        }
    } catch (ex) {
        console.error(
            "Service Calendar: Error selecting subject. Exception occured: " +
            ex.message
        );
        res.status(400).json({ error: true, message: "Auswählen des Fachs fehlgeschlagen!" });
    }
});


serviceRouter.post("/unselect_subject", helper.authenticateToken, (req, res) => {
    var userID = req.userid; 

    const subjectID = req.body.subjectID;

    const klassenDao = new KlassenDao(req.app.locals.dbConnection);

    try {
        if (!klassenDao.exists_userSubjects(userID, subjectID)) {
            return res.status(400).json({ error: true, message: "Abwählen des Fachs fehlgeschlagen!" });
        }
        const result = klassenDao.delete_userSubjects(userID, subjectID);
        if (result) {
            return res.status(200).json();
        } else {
            return res.status(400).json({ error: true, message: "Abwählen des Fachs fehlgeschlagen!" });
        }
    } catch (ex) {
        console.error(
            "Service Calendar: Error unselecting subject. Exception occured: " +
            ex.message
        );
        res.status(400).json({ error: true, message: "Abwählen des Fachs fehlgeschlagen!" });
    }
});

module.exports = serviceRouter;
