--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE Mrpaperbot_horoscope (
    userid          TEXT    NOT NULL,
    zodiac          TEXT    NOT NULL,
    dob_year        INT     NULL,
    dob_month       INT     NULL,
    dob_day         INT     NULL,
    dob_hour        INT     NULL,
    dob_minute      INT     NULL,
    pob_lat         REAL    NULL,
    pob_long        REAL    NULL
)

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE Mrpaperbot_horoscope;
