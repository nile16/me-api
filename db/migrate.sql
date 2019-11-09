DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reports;

CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(64) NOT NULL,
    birth VARCHAR(16) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(128) NOT NULL,
    UNIQUE(email)
);


CREATE TABLE IF NOT EXISTS reports (
    week INT NOT NULL,
    report TEXT,
    UNIQUE(week)
);


INSERT INTO reports (week, report)
VALUES
    ( 1, "Test rapport 1"),
    ( 2, "Test rapport 2"),
    ( 3, "Test rapport 3"),
    ( 4, "Test rapport 4"),
    ( 5, "Test rapport 5"),
    ( 6, "Test rapport 6");
