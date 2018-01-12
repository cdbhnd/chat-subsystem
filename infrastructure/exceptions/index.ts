export * from "./ApplicationException";
export * from "./ValidationException";
export * from "./InvalidCredentialsException";
export * from "./EntityNotFoundException";
export * from "./UsernameNotAvailableException";
export * from "./UserNotAuthorizedException";
export * from "./ArgumentNullException";
export * from "./ServiceLayerException";
export * from "./UserAlreadyExist";
export * from "./UseOperationNotAllowed";
export * from "./EntityAlreadyExist";
export * from "./OperationNotPermited";
export class ExceptionTypes {
    public static ValidationException: string = "ValidationException";
    public static InvalidCredentialsException: string = "InvalidCredentialsException";
    public static EntityNotFoundException: string = "EntityNotFoundException";
    public static UserAlreadyExist: string = "UserAlreadyExist";
    public static UseOperationNotAllowed: string = "UseOperationNotAllowed";
    public static UsernameNotAvailableException: string = "UsernameNotAvailableException";
    public static UserNotAuthorizedException: string = "UserNotAuthorizedException";
    public static ArgumentNullException: string = "ArgumentNullException";
    public static ServiceLayerException: string = "ServiceLayerException";
    public static EntityAlreadyExist: string = "EntityAlreadyExist";
    public static OperationNotPermited: string = "OperationNotPermited";
}
