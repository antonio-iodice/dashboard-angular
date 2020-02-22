CREATE TABLE IF NOT EXISTS downloaddata(
    id SERIAL NOT NULL PRIMARY KEY,
    latitude character varying(128),
    longitude character varying(128),
    app_id character varying(128),
    country character varying(128),
    downloaded_at date
);

insert into downloaddata values (default, '10.000', '11.920230', 'APP_IOS', 'GRB', '10/10/2019');
insert into downloaddata values (default, '11.920230', 'APP_IOS', 'GRB', '10/10/2019');
insert into downloaddata values (default, '10,000', '11.920230', 'APP_IOS', 'GRB', '10/10/2019');
insert into downloaddata values (default, '10,000', '11.920230', 'APP_IOS', 'GRB', '10/10/2019');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_IOS', 'ITA', '10/10/2019');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_IOS', 'ITA', '10/10/2019');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_ANDROID', 'GRB', '01/01/2020');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_ANDROID', 'GRB', '02/02/2020');
insert into downloaddata values (default, '10.01', '40.507351', 'APP_ANDROID', 'ITA', '02/02/2020');
insert into downloaddata values (default, '10.01', '40.507351', 'APP_ANDROID', 'ITA', '02/02/2020');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_ANDROID', 'GRB', '03/03/2020');
insert into downloaddata values (default, '-0.127758', '40.507351', 'APP_ANDROID', 'GRB', '03/03/2020');

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