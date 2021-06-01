export interface OperationResult<T> {
    value?: T;
    isSuccessful: boolean;
    httpStatusCode: number;
    error: string;
}

export interface VoidOperationResult {
    isSuccessful: boolean;
    httpStatusCode: number;
    error: string;
}
