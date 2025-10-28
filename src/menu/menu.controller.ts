import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateMenuRequest,
  UpdateMenuRequest,
  MenuResponse,
} from 'src/model/menu.model';

@Controller('/api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  //CREATE menu
  @Post()
  @HttpCode(200)
  async create(
    @Body() request: CreateMenuRequest,
  ): Promise<WebResponse<MenuResponse>> {
    const result = await this.menuService.create(request);
    return { data: result };
  }

  //GET all menus (tree structure)
  @Get()
  async findAll(): Promise<WebResponse<MenuResponse[]>> {
    const result = await this.menuService.findAll();
    return { data: result };
  }

  //GET single menu
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<WebResponse<MenuResponse>> {
    const result = await this.menuService.findById(id);
    return { data: result };
  }

  //UPDATE menu
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateMenuRequest,
  ): Promise<WebResponse<MenuResponse>> {
    const result = await this.menuService.update(id, request);
    return { data: result };
  }

  //DELETE menu (and children)
  @Delete('/:id')
  @HttpCode(200)
  async delete(@Param('id') id: string): Promise<WebResponse<boolean>> {
    await this.menuService.delete(id);
    return { data: true };
  }

  //MOVE menu
  @Patch('/:id/move')
  async move(
    @Param('id') id: string,
    @Body('newParentId') newParentId: string | null,
  ): Promise<WebResponse<MenuResponse>> {
    const result = await this.menuService.move(id, newParentId);
    return { data: result };
  }

  // 🟫 REORDER menu
  @Patch('/:id/reorder')
  async reorder(
    @Param('id') id: string,
    @Body('order') order: number,
  ): Promise<WebResponse<MenuResponse>> {
    const result = await this.menuService.reorder(id, order);
    return { data: result };
  }
}
