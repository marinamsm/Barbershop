import {getRepository} from 'typeorm';
import {hash} from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({name, email, password}: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const existentUser = await usersRepository.findOne({
            where: {
                email
            }
        });

        if (existentUser) {
            throw new AppError('Someone is already using this email');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({name, email, password: hashedPassword});

        await usersRepository.save(user);

        delete user.password;

        return user;
    }

}

export default CreateUserService;
