-- Erstellen der Tabelle 'users'
CREATE TABLE users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Erstellen der Tabelle 'subjects'
CREATE TABLE subjects (
    ID INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    longName TEXT
);


-- Erstellen der Tabelle 'userSubjects'
CREATE TABLE userSubjects (
    ID INTEGER PRIMARY KEY,
    userID INTEGER,
    subjectID INTEGER,
    FOREIGN KEY(userID) REFERENCES users(ID),
    FOREIGN KEY(subjectID) REFERENCES subjects(ID)
);


-- Erstellen der Tabelle 'teachers'
CREATE TABLE teachers (
    ID INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    longName TEXT
);

-- Erstellen der Tabelle 'rooms'
CREATE TABLE rooms (
    ID INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    longName TEXT
);

-- Erstellen der Tabelle 'klassen'
CREATE TABLE klassen (
    ID INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    longName TEXT
);

-- Erstellen der Tabelle 'userKlassen'
CREATE TABLE userKlassen (
    ID INTEGER PRIMARY KEY,
    userID INTEGER,
    klassenID INTEGER,
    FOREIGN KEY(userID) REFERENCES users(ID),
    FOREIGN KEY(klassenID) REFERENCES klassen(ID)
);

-- Erstellen der Tabelle 'klassenSubjects'
CREATE TABLE klassenSubjects (
    ID INTEGER PRIMARY KEY,
    klassenID INTEGER,
    subjectID INTEGER,
    FOREIGN KEY(klassenID) REFERENCES klassen(ID),
    FOREIGN KEY(subjectID) REFERENCES subjects(ID)
);

-- Erstellen der Tabelle 'lessons'
CREATE TABLE lessons (
    ID INTEGER PRIMARY KEY,
    subjectID INTEGER,
    teacherID INTEGER,
    roomID INTEGER,
    origRoomID INTEGER,
    date TEXT,
    startTime TEXT,
    endTime TEXT,
    canceled INTEGER,
    Info TEXT,
    lsText TEXT,
    FOREIGN KEY(subjectID) REFERENCES subjects(ID),
    FOREIGN KEY(teacherID) REFERENCES teachers(ID),
    FOREIGN KEY(roomID) REFERENCES rooms(ID),
    FOREIGN KEY(origRoomID) REFERENCES rooms(ID)
);

-- Erstellen eines Users TEMPORAER!!!!
INSERT INTO users (id, username, password) VALUES (1, 'test', '$argon2id$v=19$m=19456,t=2,p=1$FhSLHwChP3uhj5jK0AAB/A$i1kfRkkG6fcgJNMArvQjf7sbuCjAq5dMC7YmkqqoSks');