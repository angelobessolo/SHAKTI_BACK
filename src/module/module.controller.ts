import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('module')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
  ) {}

  @UseGuards( AuthGuard )
  @Post()
  create(@Request() req: Request, @Body() createModuleDto: CreateModuleDto) {
    const user = req['user'];
    return this.moduleService.create(createModuleDto, user);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll(@Request() req: Request) {
    const user = req['user'];
    return this.moduleService.findAll();
  }

  @Get('byName/:moduleName')
  findModuleByName(@Param('moduleName') moduleName: string) {
    return this.moduleService.findModuleByName(moduleName);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.moduleService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(+id);
  }
}
