/* Replace with your SQL commands */

create extension if not exists "uuid-ossp";

create table aqi_stations(
    id uuid default uuid_generate_v4 () primary key,
    geopoint point,
    station_name varchar(100)
);

alter table aqis add column station_id uuid references aqi_stations(id);

