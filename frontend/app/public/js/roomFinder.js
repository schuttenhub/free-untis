var rooms = [];
var buildings = [];
var lessons = [];
var selectedBuilding;
const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});

document.addEventListener("DOMContentLoaded", async function () {
    console.log("The DOM is fully loaded and parsed");
    $("#btn-search").click(searchRooms)
    getBuildings();
    getLessons()
    await delay(300);
    selectedBuilding = buildings[0];
    createBuildingDropdown();
    searchRooms();
});

function searchRooms() {
    var dateTime = document.getElementById('roomfindr-time').value.split('T');
    var dateArr = dateTime[0].split('-');
    var timeArr = dateTime[1].split(':');
    var date = new Date(parseInt(dateArr[0]), parseInt(dateArr[1]) - 1, parseInt(dateArr[2]), parseInt(timeArr[0]), parseInt(timeArr[1]));
    var availableRooms = {};
    rooms.forEach(room => {
        if (room.name.startsWith(selectedBuilding)) {
            var blocked = false;
            var blockedTill;
            lessons.forEach(lesson => {
                if (blocked) {
                    return;
                }
                if (lesson.roomID == room.ID) {
                    var day = parseInt(lesson.date.substring(5, 7));
                    var month = parseInt(lesson.date.substring(4, 6)) - 1;
                    var year = parseInt(lesson.date.substring(0, 4));
                    var startTime = lesson.startTime.length == 4 ? lesson.startTime : '0' + lesson.startTime;
                    var endTime = lesson.endTime.length == 4 ? lesson.endTime : '0' + lesson.endTime;
                    var startLessonDate = new Date(year, month, day, parseInt(startTime.substring(0, 2)), parseInt(startTime.substring(2, 4)));
                    var endLessonDate = new Date(year, month, day, parseInt(endTime.substring(0, 2)), parseInt(endTime.substring(2, 4)));
                    if (date >= startLessonDate  && date <= endLessonDate) {
                        blocked = true;
                        blockedTill = endLessonDate;
                    }
                }
            });
            var timeStr = blockedTill === undefined ? "" : blockedTill.getHours() + ":" + (blockedTill.getMinutes().length == 1 ? blockedTill.getMinutes() + "0" : blockedTill.getMinutes())  + "Uhr";
            availableRooms[room.name] = {"blocked" : blocked, "endTime" : timeStr, "name" : room.longName};
        }
    });
    
    var roomTable = document.getElementById("roomTable");
    roomTable.innerHTML = '';
    for(var room in availableRooms) {
        var row = document.createElement("tr");
        var nrCol = document.createElement("th");
        nrCol.scope = "row";
        nrCol.textContent = room;
        var nameCol = document.createElement("td");
        nameCol.textContent = availableRooms[room]['name'];
        var statusCol = document.createElement("td");
        statusCol.textContent = availableRooms[room]['blocked'] ? 'Belegt bis: ' + availableRooms[room]['endTime'] :  'Frei';
        if(availableRooms[room]['blocked']) {
            statusCol.className = "text-danger"
        }
        row.appendChild(nrCol);
        row.appendChild(nameCol);
        row.appendChild(statusCol);
        roomTable.appendChild(row);
    }
}

function createBuildingDropdown() {
    var buildingDropdown = document.getElementById("buildingDropdown");
    buildings.forEach(building => {
        var listItem = document.createElement("li");
        var link = document.createElement("a");
        link.className = "dropdown-item";
        link.href = 'javascript:selectBuilding("' + building + '")';
        link.textContent = building;
        listItem.appendChild(link);
        buildingDropdown.appendChild(listItem);
    });
}

function getBuildings() {
    api_get("/getRooms", (response) => {
        if (response.ok) {
            response.json().then((data) => {
                data.forEach(room => {
                    var building = room.name.split("-")[0];
                    if (!buildings.includes(building) && building.match(/^\d{3}$/)) {
                        buildings.push(building);
                    }
                    rooms.push(room);
                })
            });
        } else {
            console.error("Error:", response);
        }
    });
}

function getLessons() {
    api_get("/getLessons", (response) => {
        if (response.ok) {
            response.json().then((data) => {
                data.forEach(lesson => {
                    lessons.push(lesson);
                });
            });
        } else {
            console.error("Error:", response);
        }
    });
}

function selectBuilding(building) {
    selectedBuilding = building;
    searchRooms();
}

