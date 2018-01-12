// import { Types, kernel } from "../infrastructure/dependency-injection/";
// import * as Repositories from "../repositories/";
// import * as config from "config";
// import * as jwt from "jwt-simple";
// const secret: string = String(config.get("secret"));

// export class AuthService {

//     private userRepository: Repositories.IUserRepository;

//     constructor() {
//         this.userRepository = kernel.get<Repositories.IUserRepository>(Types.IUserRepository);
//     }

//     public async checkUser(userToken: string, allowedUserTypes: number[]): Promise<boolean> {
//         try {
//             let decodedToken = jwt.decode(userToken, secret);
//             let user = await this.userRepository.findByQuery({id: decodedToken.authUserId});

//             if (allowedUserTypes.indexOf(user.userType) == -1) {
//                 return false;
//             }
//             return true;
//         } catch (err) {
//             return false;
//         }
//     }
// }
