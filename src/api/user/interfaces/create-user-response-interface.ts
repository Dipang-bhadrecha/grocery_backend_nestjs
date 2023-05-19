import { User } from '../entities/user.entity';

export interface CreateUserResponse {
  statusCode: number;
  message: string;
  data: User;
}
