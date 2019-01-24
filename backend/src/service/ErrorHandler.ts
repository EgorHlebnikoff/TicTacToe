interface IErrorObj {
    status: string;
    code?: number;
    message?: string;
}

const errorObj: IErrorObj = {status: 'error'};

const getError = (message: string, code: number = 400): IErrorObj => ({...errorObj, code, message});

export default getError;
