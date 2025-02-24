import { UserDTO } from "../dto/userDTO"; 
import { User } from "@/domain/models/user.ts";
import { UserRepository } from "@/application/repositories/UserRepository";


export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userDTO: UserDTO): Promise<Response> {
    const user = new User(userDTO.username, userDTO.email, userDTO.password);
    return await this.userRepository.registerUser(user);
  }
}
