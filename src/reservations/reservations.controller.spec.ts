import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsController } from './reservations.controller';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findReservationByEmail: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      const dto: CreateReservationDto = {
        startTime: new Date(),
        endTime: new Date(),
        roomId: '123',
      };
      const user = { email: 'test@example.com' };
      const result = { id: '1', ...dto, user };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto, user)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto, user);
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const result = [{ id: '1', startTime: new Date(), endTime: new Date() }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findMyReservations', () => {
    it('should return reservations for the authenticated user', async () => {
      const user = { email: 'test@example.com' };
      const result = [{ id: '1', user }];
      jest.spyOn(service, 'findReservationByEmail').mockResolvedValue(result);

      expect(await controller.findMyReservations(user)).toEqual(result);
      expect(service.findReservationByEmail).toHaveBeenCalledWith(user.email);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by ID', async () => {
      const result = { id: '1', startTime: new Date(), endTime: new Date() };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const dto: UpdateReservationDto = { endTime: new Date() };
      const result = { id: '1', ...dto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ deleted: true });

      expect(await controller.remove('1')).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
