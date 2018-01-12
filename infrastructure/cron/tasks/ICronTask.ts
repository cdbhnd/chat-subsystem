export interface ICronTask {
    occurancePattern: string;
    message: string;
    callback(): any;
}
