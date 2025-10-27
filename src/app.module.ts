import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [CommonModule, MenuModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
