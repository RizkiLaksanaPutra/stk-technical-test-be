// test/test.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async resetMenus() {
    await this.prismaService.menu.deleteMany();
  }

  async getAllMenus() {
    return this.prismaService.menu.findMany();
  }
}
