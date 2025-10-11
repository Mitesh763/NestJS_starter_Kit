import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

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

  create(attributes: Partial<User>) {
    const user = this.repo.create(attributes);
    return this.repo.save(user);
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
