import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {}
  
  @UseGuards( AuthGuard )
  @Post()
  create(@Request() req: Request, @Body() createRoleDto: CreateRoleDto) {
    const user = req['user'];
    return this.roleService.create(createRoleDto, user);
  }

  @UseGuards( AuthGuard )
  @Get('byName/:roleName')
  findRoleByName(@Param('roleName') roleName: string) {
    return this.roleService.findRoleByName(roleName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
