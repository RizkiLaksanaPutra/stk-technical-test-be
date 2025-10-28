import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('MenuController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let createdMenuId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  beforeEach(async () => {
    await testService.resetMenus();
  });

  afterAll(async () => {
    await app.close();
  });

  //CREATE MENU
  describe('POST /api/menus', () => {
    it('should reject invalid request (missing name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/menus')
        .send({
          name: '',
          parentId: '',
          order: null,
          depth: null,
        });

      logger.info(response.body);
      expect([400, 500]).toContain(response.status);
    });

    it('should create a menu successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/menus')
        .send({
          name: 'test',
          parentId: null,
          order: 1,
          depth: 0,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.order).toBe(1);
      expect(response.body.data.depth).toBe(0);

      createdMenuId = response.body.data.id;
    });
  });

  //GET ALL MENUS
  describe('GET /api/menus', () => {
    it('should return all menus (tree structure)', async () => {
      await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });

      const response = await request(app.getHttpServer()).get('/api/menus');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  //GET SINGLE MENU
  describe('GET /api/menus/:id', () => {
    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });
      createdMenuId = body.data.id;
    });

    it('should return a single menu', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/menus/${createdMenuId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(createdMenuId);
    });

    it('should return 404 if not found', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/menus/non-existent-id',
      );

      expect(response.status).toBe(404);
    });
  });

  //UPDATE MENU
  describe('PUT /api/menus/:id', () => {
    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });
      createdMenuId = body.data.id;
    });

    it('should update menu successfully', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/menus/${createdMenuId}`)
        .send({ name: 'Updated Menu', order: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Menu');
      expect(response.body.data.order).toBe(2);
    });
  });

  //MOVE MENU
  describe('PATCH /api/menus/:id/move', () => {
    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });
      createdMenuId = body.data.id;
    });

    it('should move menu to null parent', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/menus/${createdMenuId}/move`)
        .send({ newParentId: null });

      expect(response.status).toBe(200);
      expect(response.body.data.parentId).toBeNull();
    });
  });

  //REORDER MENU
  describe('PATCH /api/menus/:id/reorder', () => {
    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });
      createdMenuId = body.data.id;
    });

    it('should reorder menu', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/menus/${createdMenuId}/reorder`)
        .send({ order: 5 });

      expect(response.status).toBe(200);
      expect(response.body.data.order).toBe(5);
    });
  });

  //DELETE MENU
  describe('DELETE /api/menus/:id', () => {
    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/menus')
        .send({ name: 'test', parentId: null, order: 1, depth: 0 });
      createdMenuId = body.data.id;
    });

    it('should delete menu successfully', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/api/menus/${createdMenuId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });

    it('should return 404 if menu does not exist', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/api/menus/non-existent-id`,
      );

      expect(response.status).toBe(404);
    });
  });
});
