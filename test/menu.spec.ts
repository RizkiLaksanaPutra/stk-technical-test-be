import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('MenuController', () => {
  let app: INestApplication<App>;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
  });

  describe('POST /api/menus', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/menus')
        .send({
          name: '',
          parentId: '',
          order: null,
          depth: null,
        });

        logger.info(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    });

    it('should be able to create menu', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/menus')
        .send({
          name: 'test',
          parentId: null,
          order: 1,
          depth: 0,
        });

        logger.info(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe('test')
        expect(response.body.data.parentId).toBeDefined()
        expect(response.body.data.order).toBe(1)
        expect(response.body.data.depth).toBe(0)
    });
  });
});
