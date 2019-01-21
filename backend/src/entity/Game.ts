import 'reflect-metadata';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

enum GameResult {NO_RESULT = '', OWNER = 'owner', OPPONENT = 'opponent', DRAW = 'draw'}

enum GameState {READY = 'ready', PLAYING = 'playing', DONE = 'done'}

/* tslint:disable */
@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn("varchar", {length: 6, unique: true,})
    gameToken: string;

    @Column("varchar")
    owner: string;

    @Column("varchar", {length: 12, unique: true,})
    ownerAccessToken: string;

    @Column("varchar")
    opponent: string;

    @Column("varchar", {length: 12, unique: true,})
    opponentAccessToken: string;

    @Column("int")
    size: number;

    @Column("int")
    gameDuration: number;

    @Column({
        type: "enum",
        enum: GameResult,
        default: GameResult.NO_RESULT,
    })
    gameResult: string;

    @Column({
        type: "enum",
        enum: GameState,
        default: GameState.READY,
    })
    state: string;
}
