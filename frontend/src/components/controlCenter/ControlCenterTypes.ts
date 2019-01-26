import * as React from "react";

interface IControlCenterState {
    isModalOpen: boolean;
    isGameReady: boolean;
    annotationToGameCreation: string;
    currentGameToken: string;
}

interface IControlCenterProps {
    userNameInputRef: React.RefObject<HTMLInputElement>;
    serverInternalErrorAlert: () => void;
    gameWasRemovedAlert: (message: string) => void;
}

export {IControlCenterProps, IControlCenterState};
