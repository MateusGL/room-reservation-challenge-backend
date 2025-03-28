/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../src/auth/auth.service';
import { RoomsService } from '../src/rooms/rooms.service';
import { RoomEntity } from '../src/rooms/room.entity';
import { ReservationsModule } from '../src/reservations/reservation.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { RoomsModule } from '../src/rooms/rooms.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMocks } from './mocks/auth.mock';
import { RoomMocks } from './mocks/rooms.mock';
import { ReservationMocks } from './mocks/reservations.mock';
import { DateUtils } from '../src/@common/domain/utils/date.utils';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let roomsService: RoomsService;
  let userToken: string;
  let createdRoom: RoomEntity;
  let createdReservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AuthModule,
        UsersModule,
        ReservationsModule,
        RoomsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    roomsService = moduleFixture.get<RoomsService>(RoomsService);

    await authService.register(AuthMocks.validUser());

    // Create test room
    createdRoom = await roomsService.create(RoomMocks.validRoom());

    // Get tokens
    const { email, password } = AuthMocks.loginCredentials();
    userToken = (await authService.login(email, password)).access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reservations (POST) - should create a reservation', async () => {
    const reservationData = ReservationMocks.validReservation(createdRoom.id);

    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reservationData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('user@test.com');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    createdReservationId = response.body.id;
  });

  it('should reject reservation with conflicting time', async () => {
    const conflictingData = ReservationMocks.conflictingReservation(
      createdRoom.id,
    );

    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(conflictingData)
      .expect(400);

    expect(response.body.message).toContain(
      'There are overlapping reservations for this room.',
    );
  });

  it('should reject reservation shorter than minimum duration (30 minutes)', async () => {
    const shortReservation = ReservationMocks.shortReservation(createdRoom.id);

    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(shortReservation)
      .expect(400);

    expect(response.body.message).toContain(
      'The reservation must be at least 1 hour long.',
    );
  });

  it('/reservations (GET) - should get all reservations', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/reservations/my-reservations (GET) - should get user reservations', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations/my-reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/reservations/:id (GET) - should get single reservation', async () => {
    const response = await request(app.getHttpServer())
      .get(`/reservations/${createdReservationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.id).toBe(createdReservationId);
  });

  it('/reservations/:id (PATCH) - should update reservation', async () => {
    const updateData = {
      startTime: DateUtils.getFutureDate(2, 10),
      endTime: DateUtils.getFutureDate(2, 12),
    };

    const response = await request(app.getHttpServer())
      .patch(`/reservations/${createdReservationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.startTime).toBe(updateData.startTime);
    expect(response.body.endTime).toBe(updateData.endTime);
  });

  it('/reservations/:id (DELETE) - should delete reservation', async () => {
    await request(app.getHttpServer())
      .delete(`/reservations/${createdReservationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/reservations/${createdReservationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
