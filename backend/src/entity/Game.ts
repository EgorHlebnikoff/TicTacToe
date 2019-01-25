import 'reflect-metadata';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

export enum GameResult {NO_RESULT = '', OWNER = 'owner', OPPONENT = 'opponent', DRAW = 'draw'}

export enum GameState {READY = 'ready', PLAYING = 'playing', DONE = 'done'}

/* tslint:disable */
@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn("varchar", {
        length: 6,
        unique: true,
    })
    gameToken: string;

    @Column("varchar")
    owner: string;

    @Column({
        type: "varchar",
        length: 12,
        default: '',
    })
    ownerAccessToken: string;

    @Column({
        type: "varchar",
        default: '',
    })
    opponent: string;

    @Column({
        type: "varchar",
        length: 12,
        default: '',
    })
    opponentAccessToken: string;

    @Column({
        type: "varchar",
        length: 8,
        default: '',
    })
    whomTurn: string;

    @Column("varchar", {array: true})
    field: string[];

    @Column({
        type: "int",
        default: 3,
    })
    size: number;

    @Column({
        type: "int",
        default: 0,
    })
    gameDuration: number;

    @Column("timestamp")
    timeOfCreation: Date;

    @Column("timestamp")
    lastActivityTime: Date;

    @Column("timestamp", {nullable: true})
    timeOfStart: Date;

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
