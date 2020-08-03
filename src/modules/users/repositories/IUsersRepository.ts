import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUser from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
    create(data: ICreateUser): Promise<User>;
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
}
