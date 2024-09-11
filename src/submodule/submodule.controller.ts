import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SubmoduleService } from './submodule.service';
import { CreateSubmoduleDto } from './dto/create-submodule.dto';
import { UpdateSubmoduleDto } from './dto/update-submodule.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('submodule')
export class SubmoduleController {
  constructor(
    private readonly submoduleService: SubmoduleService
  ) {}

  @UseGuards (AuthGuard)
  @Post()
  create(@Request() req: Request, @Body() createSubmoduleDto: CreateSubmoduleDto) {
    const user = req['user'];
    return this.submoduleService.create(createSubmoduleDto, user);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll() {
    return this.submoduleService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('byName/:submoduleName')
  findSubmoduleByName(@Param('submoduleName') submoduleName: string) {
    return this.submoduleService.findSubmoduleByName(submoduleName);
  }

  @UseGuards( AuthGuard )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submoduleService.findOne(+id);
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmoduleDto: UpdateSubmoduleDto) {
    return this.submoduleService.update(+id, updateSubmoduleDto);
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submoduleService.remove(+id);
  }
}
