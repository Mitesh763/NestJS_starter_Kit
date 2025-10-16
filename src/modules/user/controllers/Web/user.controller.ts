import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../../dto/request/update-user.dto';
import { UserService } from '../../user.service';
import { UserDto } from '../../dto/response/user.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '../../../../guards/auth.guard';

import { Request, Response } from 'express';
import { CreateUserDto } from '../../dto/request/create-user.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../../user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserList(@Paginate() query: PaginateQuery, @Res() res: Response) {
    const result = await this.userService.find(query);

    const data = {
      recordsTotal: result.meta.totalItems,
      recordsFiltered: result.meta.totalItems,
      data: result.data,
    };

    return res.json(data);
  }

  @Get('list')
  listUserView(@Res() res: Response) {
    return res.render('user/index', {
      title: 'User List',
      page_title: 'User Details',
      folder: 'User',
    });
  }

  @Get('/create')
  createUserView(@Res() res: Response) {
    return res.render('user/create', {
      title: 'Create User',
      page_title: 'Create User',
      folder: 'User',
    });
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    if (!user) return res.redirect('/users');

    return res.render('user/show', {
      title: 'User Detail',
      page_title: 'User Detail',
      folder: 'User',
      user: plainToInstance(UserDto, user),
    });
  }

  @Get('/:id/edit')
  async editUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    return res.render('user/edit', {
      title: 'Edit User',
      page_title: 'Edit User',
      folder: 'User',
      user: plainToInstance(UserDto, user),
    });
  }

  @Put('/:id/update')
  async updateUserById(
    @Param('id') id: string,
    @Body()
    body: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.update(id, body);

      if (!user) {
        req.flash('oldInput', req.body);
      }

      req.flash('toast', {
        message: 'User updated successfully!',
        type: 'success',
      });

      return res.redirect('/users/' + id);
    } catch (error) {
      console.log(error);
    }
  }

  @Post()
  async createUser(
    @Body()
    body: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.userService.create(body);

    if (!result) {
      req.flash('oldInput', req.body);

      return res.redirect('/users/create');
    }

    req.flash('toast', {
      message: 'User created successfully!',
      type: 'success',
    });
    return res.redirect('/users/list');
  }

  // @Put('/:id')
  // updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   const data = {
  //     email: updateUserDto.email,
  //     phone_number: updateUserDto.phone_number,
  //     name: updateUserDto.name,
  //   };
  //   return this.userService.update(id, data);
  // }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    await this.userService.remove(id);

    req.flash('toast', {
      message: 'User deleted successfully!',
      type: 'success',
    });
    return res.redirect('/users/list');
  }
}
