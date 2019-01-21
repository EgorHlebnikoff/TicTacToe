CREATE DATABASE tic_tac_toe;
CREATE USER tic_tac_toe_user WITH password 'tictactoe';
GRANT ALL privileges ON DATABASE tic_tac_toe TO tic_tac_toe_user;
