interface IMainScreenState {
    isAlertModalOpen: boolean;
    alertMessage: string;
    callback?: () => Promise<void>;
}

export {IMainScreenState};
