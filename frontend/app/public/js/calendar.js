// Globale Variablen für den Start- und Enddatum-Bereich sowie Farben und Farbcodierung für Klassen
const BACKEND_URL = `http://${process.env.FREEUNTIS_SERVERNAME || 'localhost'}:${process.env.PORT_BACKEND || 8000}`;

var startDate;
var endDate;
const colors = ["primary", "success", "warning", "info", "secondary"];
var klasseColor = {};

// Event Listener für das DOMContentLoaded, das ausgelöst wird, wenn das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", function () {
  console.log("The DOM is fully loaded and parsed");

    // Initialisierung beim Laden der Seite
  createKlassenDropdown();    // Dropdown-Menü für Klassen erstellen
  createUserKlassenMenu();    // Menü für Benutzerklassen erstellen
  showCurrentWeek();          // Aktuelle Woche im Kalender anzeigen

  // Navigationstasten mit Funktionen verknüpfen
  $("#btn-last-week").click(showLastWeek) // Vorherige Woche anzeigen
  $("#btn-next-week").click(showNextWeek) // Nächste Woche anzeigen
  $("#btn-today").click(showCurrentWeek)  // Aktuelle Woche anzeigen
});

// Funktion zum Erstellen des Dropdown-Menüs für Klassen
function createKlassenDropdown() {
  api_get("/getKlassen", (response) => {
    if (response.ok) {
      var klassenDropdown = document.getElementById("klassenDropdown");
      // Create All List Items according to <li><a class="dropdown-item" href="#">ITS-2</a></li>
      // Erzeugt Listenelemente basierend auf den erhaltenen Klassen
      response.json().then((data) => {
        data.forEach((klasse) => {
          var listItem = document.createElement("li");
          //listItem.className = 'list-group-item';
          var link = document.createElement("a");
          link.className = "dropdown-item";
          link.href = 'javascript:addKlasse("' + klasse.ID + '")';
          link.textContent = klasse.name;
          listItem.appendChild(link);
          klassenDropdown.appendChild(listItem);
        });
      });
    } else {
      console.error("Error:", response);
    }
  })
}
// Asynchrone Funktion zum Erstellen des Menüs für Benutzerklassen und deren Fächer
async function createUserKlassenMenu() {
  try {
    const response = await fetch(BACKEND_URL + "/getUserKlassenAndSubjects",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.ok) {
      const klassenAndSubjects = await response.json();

      let html = "";

      // Iteration über Benutzerklassen und Erzeugen des HTML-Codes
      klassenAndSubjects.forEach((klasse, i) => {
        var color = colors[i % colors.length]
        klasseColor[klasse.name] = color

        html += `
        <li class="mb-1">
            <div class="px-0 d-flex flex-row justify-content-between">
                <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                    data-bs-toggle="collapse" data-bs-target="#${klasse.name}-collapse" aria-expanded="true">
                    ${klasse.name}
                    <i class="fa fa-square text-${color} mx-2" aria-hidden="true"></i>
                </button>
                <a href="javascript:deleteKlasse('${klasse.id}')" class="btn text-danger btn-link">
                  <i class="fa-solid fa-trash-can"></i>
                </a>
            </div>

            <div class="collapse show" id="${klasse.name}-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">`;

        // Iteration über Fächer der Klasse und Erzeugen der Checkboxen
        for (let subject of klasse.subjects) {
          html += `
                    <li>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="subject-${klasse.id}-${subject.ID}" ${subject.selected ? 'checked' : ''}/>
                            <label class="form-check-label" for="subject-${klasse.id}-${subject.ID}">${subject.name}</label>
                        </div>
                    </li>`;
        }

        html += `
                </ul>
            </div>
        </li>`;       
      });

      // HTML in das entsprechende Element einfügen
      document.getElementById('klassenAndSubjects').innerHTML = html;
      // Event Listener für Änderungen der Checkboxen hinzufügen
      klassenAndSubjects.forEach(klasse => {
        klasse.subjects.forEach(subject => {
          $(`#subject-${klasse.id}-${subject.ID}`).change(function() {
            if(this.checked) {
                // Fach zur Auswahl des Benutzers hinzufügen und den Kalender aktualisieren
                api_post('/select_subject', { subjectID: subject.ID }, () => {
                  createTimetable();
                  createUserKlassenMenu();
                });
            } else {
                // Fach aus der Auswahl des Benutzers entfernen und den Kalender aktualisieren
                api_post('/unselect_subject', { subjectID: subject.ID }, () => {
                  createTimetable();
                  createUserKlassenMenu();
                });
            }
          });
        });
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
// Funktion zum Hinzufügen einer Klasse für den Benutzer
function addKlasse(klassenID) {
    var klassenID = klassenID;
    
    api_post('/addKlasse', { klassenID: klassenID }, () => {
      createUserKlassenMenu()
    })
};
// Funktion zum Löschen einer Klasse für den Benutzer
function deleteKlasse(klassenID) {
    var klassenID = klassenID;
    
    api_post('/deleteKlasse', { klassenID: klassenID }, () => {
      createUserKlassenMenu();
      createTimetable();
    })
}

// Funktion zum Erstellen des Stundenplans basierend auf dem aktuellen Start- und Enddatum
function createTimetable() {
  const weekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  // API-Anfrage für den Stundenplan zwischen startDate und endDate
  api_get(`/calendar?start=${startDate}&end=${endDate}`, async (res) => {
    lessons = await res.json();

    $('.timetable-lesson').remove()   // Vorherige Stunden entfernen
    var startDateTime = "";
    var collisions = 1;
    var position = 0;
    lessons.forEach((lesson, i) => {
      const date = new Date(lesson.date);
      let day = weekdays[date.getDay()];
      const color = klasseColor[lesson.klassen[0].name]
      let room = "";
      // Kollisionen berechnen und Position der Stunde bestimmen
      console.log("1. :", lesson.subject.name, width, width*position, startDateTime, lesson.date+lesson.startTime);
      if (startDateTime != lesson.date+lesson.startTime) {
        startDateTime = lesson.date+lesson.startTime;
        collisions = 1;
        position = 0;
        while ((i+collisions < lessons.length) && (startDateTime == lessons[i+collisions].date+lessons[i+collisions].startTime)) {
          collisions += 1;
        }
      } else {
        position += 1;
      }
      var width = 1 / collisions * 100;
      console.log("2. :", lesson.subject.name, width, width*position, startDateTime, lesson.date+lesson.startTime);

      // HTML für die Stunde erstellen
      if (lesson.room){
        room = lesson.room.name
      }
      if (lesson.canceled) {
        html = `<div 
            class="timetable-lesson overflow-hidden bg-${color}-subtle border-${color}-subtle text-${color}-emphasis item ${day} starttime-${lesson.startTime} endtime-${lesson.endTime} text-decoration-line-through" style="width: ${width}%; margin-left: ${width*position}%; opacity: 0.45">
            <strong>${lesson.subject.name}</strong><br>${room}<br>${lesson.teacher.name}</div>`;
      } else {
        html = `<div
            class="timetable-lesson overflow-hidden bg-${color}-subtle border-${color}-subtle text-${color}-emphasis item ${day} starttime-${lesson.startTime} endtime-${lesson.endTime}" style="width: ${width}%; margin-left: ${width*position}%">
            <strong>${lesson.subject.name}</strong><br>${room}<br>${lesson.teacher.name}</div>`;
      }
      // Stunde zum Stundenplan hinzufügen
      $("#timetable").append(html);
    });
  })

}


/*
Update the calendar with data of the next week
*/
// Funktion zum Anzeigen der nächsten Woche im Kalender
function showNextWeek() {
  // add 7 days to startDate
  var date = new Date(startDate)
  date.setDate(date.getDate() + 7)
  startDate = date.toISOString().split('T')[0]

  // add 7 days to endDate
  date = new Date(endDate)
  date.setDate(date.getDate() + 7)
  endDate = date.toISOString().split('T')[0]

  // Stundenplan und Datum-Anzeige aktualisieren
  createTimetable();
  updateDateIndicator();
}

/*
Update calendar with data of the current week
*/
// Funktion zum Anzeigen der aktuellen Woche im Kalender
function showCurrentWeek() {
  // Get current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  // Calculate the date of the Monday of the current week
  var monday = new Date(currentDate);
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  monday.setDate(currentDate.getDate() + diffToMonday);
  startDate = monday.toISOString().split('T')[0];

  // Calculate the date of the Saturday of the current week
  var saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  endDate = saturday.toISOString().split('T')[0];

  // Stundenplan und Datum-Anzeige aktualisieren
  createTimetable();
  updateDateIndicator();
}

/*
Update calendar with data of the previous week
*/
// Funktion zum Anzeigen der vorherigen Woche im Kalender
function showLastWeek() {
  // subtract 7 days from startDate
  var date = new Date(startDate)
  date.setDate(date.getDate() - 7)
  startDate = date.toISOString().split('T')[0]

  // subtract 7 days from enddate
  date = new Date(endDate)
  date.setDate(date.getDate() - 7)
  endDate = date.toISOString().split('T')[0]

  // Stundenplan und Datum-Anzeige aktualisieren
  createTimetable();
  updateDateIndicator();
}

/*
Update date indicator with the currently selected start and end date
*/
// Funktion zur Aktualisierung der Datum-Anzeige
function updateDateIndicator() {
  const indicator = startDate.replace(/-/g,'.') + " - " + endDate.replace(/-/g,'.');
  $("#date-indicator").text(indicator);

  // Überprüfen, ob die aktuelle Woche angezeigt wird und Farbe für den "Heute"-Button festlegen
  const today = (new Date()).toISOString().split('T')[0];
  if (startDate <= today && today <= endDate) {
    $("#btn-today").removeClass("btn-outline-primary")
    $("#btn-today").addClass("btn-primary")
  } else {
    $("#btn-today").removeClass("btn-primary")
    $("#btn-today").addClass("btn-outline-primary")
  }
}