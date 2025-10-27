import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { MenuValidation } from './menu.validation';
import {
  CreateMenuRequest,
  UpdateMenuRequest,
  MenuResponse,
} from '../model/menu.model';

@Injectable()
export class MenuService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  // 🟩 CREATE menu
  async create(request: CreateMenuRequest): Promise<MenuResponse> {
    this.logger.info(`MenuService.create(${JSON.stringify(request)})`);
    const createRequest: CreateMenuRequest = this.validationService.validate(MenuValidation.CREATE, request) as CreateMenuRequest;

    const parent = createRequest.parentId
      ? await this.prismaService.menu.findUnique({
          where: { id: createRequest.parentId },
        })
      : null;

    const depth = parent ? parent.depth + 1 : 0;

    const menu = await this.prismaService.menu.create({
      data: {
        name: createRequest.name,
        parentId: createRequest.parentId ?? null,
        order: createRequest.order ?? 0,
        depth,
      },
    });

    return {
      id: menu.id,
      name: menu.name,
      parentId: menu.parentId,
      order: menu.order,
      depth: menu.depth,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  // 🟨 GET all menus (tree structure)
  async findAll(): Promise<MenuResponse[]> {
    this.logger.debug('MenuService.findAll()');

    const menus = await this.prismaService.menu.findMany({
      orderBy: { order: 'asc' },
    });

    // Buat Map biar mudah susun parent-child
    const menuMap = new Map<string, MenuResponse>();
    menus.forEach((m) => {
      menuMap.set(m.id, { ...m, children: [] });
    });

    const roots: MenuResponse[] = [];
    menuMap.forEach((menu) => {
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children = parent.children ?? [];
          parent.children.push(menu);
        }
      } else {
        roots.push(menu);
      }
    });

    return roots;
  }

  // 🟦 GET single menu
  async findById(id: string): Promise<MenuResponse> {
    this.logger.debug(`MenuService.findById(${id})`);
    const menu = await this.prismaService.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    return {
      id: menu.id,
      name: menu.name,
      parentId: menu.parentId,
      order: menu.order,
      depth: menu.depth,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  // 🟧 UPDATE menu
  async update(id: string, request: UpdateMenuRequest): Promise<MenuResponse> {
    this.logger.debug(`MenuService.update(${id}, ${JSON.stringify(request)})`);

    const updateRequest = this.validationService.validate(
      MenuValidation.UPDATE,
      request,
    ) as UpdateMenuRequest;

    const menu = await this.prismaService.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    let depth = menu.depth;
    if (updateRequest.parentId && updateRequest.parentId !== menu.parentId) {
      const parent = await this.prismaService.menu.findUnique({
        where: { id: updateRequest.parentId },
      });
      depth = parent ? parent.depth + 1 : 0;
    }

    const updated = await this.prismaService.menu.update({
      where: { id },
      data: {
        name: updateRequest.name ?? menu.name,
        parentId: updateRequest.parentId ?? menu.parentId,
        order: updateRequest.order ?? menu.order,
        depth,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      parentId: updated.parentId,
      order: updated.order,
      depth: updated.depth,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  // 🟥 DELETE menu (and children)
  async delete(id: string): Promise<void> {
    this.logger.debug(`MenuService.delete(${id})`);

    const menu = await this.prismaService.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    await this.deleteChildren(id);
    await this.prismaService.menu.delete({ where: { id } });
  }

  private async deleteChildren(parentId: string): Promise<void> {
    const children = await this.prismaService.menu.findMany({
      where: { parentId },
    });

    for (const child of children) {
      await this.deleteChildren(child.id);
      await this.prismaService.menu.delete({ where: { id: child.id } });
    }
  }

  // 🟪 MOVE menu ke parent lain
  async move(id: string, newParentId: string | null): Promise<MenuResponse> {
    this.logger.debug(`MenuService.move(${id}, ${newParentId})`);

    const menu = await this.prismaService.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    const parent = newParentId
      ? await this.prismaService.menu.findUnique({ where: { id: newParentId } })
      : null;

    const depth = parent ? parent.depth + 1 : 0;

    const moved = await this.prismaService.menu.update({
      where: { id },
      data: { parentId: newParentId, depth },
    });

    return {
      id: moved.id,
      name: moved.name,
      parentId: moved.parentId,
      order: moved.order,
      depth: moved.depth,
      createdAt: moved.createdAt,
      updatedAt: moved.updatedAt,
    };
  }

  // 🟫 REORDER menu
  async reorder(id: string, order: number): Promise<MenuResponse> {
    this.logger.debug(`MenuService.reorder(${id}, order=${order})`);

    const menu = await this.prismaService.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    const updated = await this.prismaService.menu.update({
      where: { id },
      data: { order },
    });

    return {
      id: updated.id,
      name: updated.name,
      parentId: updated.parentId,
      order: updated.order,
      depth: updated.depth,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
