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
    ( 1, "Test rapport1"),
    ( 2, "Test rapport2"),
    ( 3, "Test rapport3");
