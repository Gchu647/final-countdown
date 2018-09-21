DROP DATABASE IF EXISTS fn_countdown_db;
DROP USER IF EXISTS fn_countdown_user;
CREATE USER fn_countdown_user WITH PASSWORD 'password';
CREATE DATABASE fn_countdown_db WITH OWNER fn_countdown_user;
