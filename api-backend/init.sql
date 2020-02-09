CREATE TABLE IF NOT EXISTS downloaddata(
    id SERIAL NOT NULL PRIMARY KEY,
    title character varying(128),
    latitude character varying(128),
    longitude character varying(128),
    app_id character varying(128),
    downloaded_at date
);

CREATE OR REPLACE FUNCTION notify_realtime() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('addedrecord', row_to_json(NEW)::text);
    RETURN NULL;
END;
$$;

CREATE TRIGGER updated_realtime_trigger AFTER INSERT ON downloaddata
FOR EACH ROW EXECUTE PROCEDURE notify_realtime();