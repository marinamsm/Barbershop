import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute({
        name,
        email,
        password,
    }: IRequestDTO): Promise<User> {
        const existentUser = await this.usersRepository.findByEmail(email);

        if (existentUser) {
            throw new AppError('Someone is already using this email');
        }

        const hashedPassword = await hash(password, 8);

        return this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
    }
}

export default CreateUserService;
