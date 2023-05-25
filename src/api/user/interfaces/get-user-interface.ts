import { User } from '../entities/user.entity';

export interface GetUserResponse {
  statusCode: number;
  data: User;
}
