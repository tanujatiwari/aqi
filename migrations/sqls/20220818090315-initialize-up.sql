create extension if not exists "uuid-ossp";

create table aqis(
    id uuid default uuid_generate_v4 (),
    city_geopoint point not null,
    city_name varchar(50) not null,
    aqi integer not null,
    aqi_measure_time timestamptz not null
);