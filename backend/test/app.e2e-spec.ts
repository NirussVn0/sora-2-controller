import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('VideoJobsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a video job', async () => {
    const response = await request(app.getHttpServer())
      .post('/video-jobs')
      .send({
        prompt: 'A cinematic journey across a neon-drenched city skyline at night.',
        durationSeconds: 30,
        segmentationMode: 'auto'
      })
      .expect(201);

    expect(response.body).toMatchObject({
      prompt: expect.any(String),
      frameCount: 3,
      segments: expect.any(Array)
    });
  });
});
