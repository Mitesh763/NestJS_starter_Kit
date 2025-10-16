import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreateUserDto } from './dto/request/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async find(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.repo, {
      sortableColumns: [
        'id',
        'name',
        'email',
        'phone_number',
        'created_at',
        'updated_at',
      ],
      searchableColumns: [
        'name',
        'email',
        'phone_number',
        'id',
        'created_at',
        'updated_at',
      ],
      defaultSortBy: [['created_at', 'DESC']],
    });
  }

  findOneByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByEmail(createUserDto.email);

    if (user)
      throw new BadRequestException('User already exists, please login');

    const salt = randomBytes(8).toString('hex');
    const hash = (
      (await scrypt(createUserDto.password, salt, 32)) as Buffer
    ).toString('hex');
    createUserDto.password = `${salt}.${hash}`;

    const newUser = await this.repo.create(createUserDto);
    return this.repo.save(newUser);
  }

  async update(id: string, attributes: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.repo.softRemove(user);
  }
}
