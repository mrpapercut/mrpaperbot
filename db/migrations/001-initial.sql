--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE Mrpaperbot_horoscope (
    userid          TEXT    NOT NULL,
    zodiac          TEXT    NOT NULL,
    dob_year        INT     NOT NULL,
    dob_month       INT     NOT NULL,
    dob_day         INT     NOT NULL,
    dob_hour        INT     NOT NULL,
    dob_minute      INT     NOT NULL,
    pob_lat         REAL    NOT NULL,
    pob_long        REAL    NOT NULL
)

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE Mrpaperbot_horoscope;
