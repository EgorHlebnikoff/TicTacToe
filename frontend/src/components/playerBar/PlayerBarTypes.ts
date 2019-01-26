import {UserType} from "../../routes/types/GameScreenTypes";
import {IPlayers} from "../gameField/GameFieldTypes";

interface IPlayerBar {
    playerType: UserType;
    players: IPlayers;
}

export {IPlayerBar, UserType, IPlayers};
