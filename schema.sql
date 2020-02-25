create table users(
    email varchar(30),
    password varchar(30),
    firstname varchar(30),
    familyname varchar(30),
    gender varchar(30),
    city varchar(30),
    country varchar(30),
    primary key(email)
);

create table wall(
    email varchar(30),
    writer varchar(30),
    content varchar(120)
);

create table loggedinusers(
    email varchar(30),
    token varchar(30),
    primary key(email)
);
