# Tic-Tac-Toe  
  
> Крестики-нолики с возможностью играть онлайн

## Зависимости
* __PostgreSQL 11__
* __NodeJS 10.15.0 (LTS)__
* __ReactJS__
* __TypeScript__

## База данных
> Перед инициализацией базы данных нужно установить __PostgreSQL 11__.

Затем:

### Для Windows:

1. Запустить терминал от имени администратора и перейти в корень проекта
2. Выполнить `createDB.bat username`. Где вместо __username__ нужно вставить имя администратора базы данных. 

_В случае, если установлен пароль - ввести пароль_ 

### Для MacOS & Linux:

1. Запустить терминал и перейти в корень проекта
2. Выполнить `sudo ./createDB.sh username`. Где вместо __username__ нужно вставить имя администратора базы данных. 

_В случае, если установлен пароль - ввести пароль _

### Для любых систем:

1. Запустить терминал и подключиться к БД с помощью команды `psql -U username` 
(_Для __Linux__ и __MacOS__, возможно, необходимо будет сделать это через __sudo__. Для __Windows__ - терминал нужно запустить от имени администратора_)
3. Выполнить следующие команды: 
`CREATE DATABASE tic_tac_toe;
 CREATE USER tic_tac_toe_user WITH password 'tictactoe';
 GRANT ALL privileges ON DATABASE tic_tac_toe TO tic_tac_toe_user;`

## Сборка
* `npm run start` - сборка и запуск сервера по адресу http://locahost:5000
* `npm run dev` - сборка в режиме разработки и запуск сервера по адресу http://localhost:5000

