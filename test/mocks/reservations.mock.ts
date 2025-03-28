import { DateUtils } from '../../src/@common/domain/utils/date.utils';

export const ReservationMocks = {
  validReservation: (roomId: string) => ({
    roomId,
    startTime: DateUtils.getFutureDate(1, 10), // Amanhã às 10:00
    endTime: DateUtils.getFutureDate(1, 12), // Amanhã às 12:00
  }),

  conflictingReservation: (roomId: string) => ({
    roomId,
    startTime: DateUtils.getFutureDate(1, 11), // Amanhã às 11:00 (conflito)
    endTime: DateUtils.getFutureDate(1, 13), // Amanhã às 13:00
  }),

  shortReservation: (roomId: string) => ({
    roomId,
    startTime: DateUtils.getFutureDate(1, 10), // Amanhã às 10:00
    endTime: DateUtils.getFutureDate(1, 10, 30), // 30 minutos depois (inválido)
  }),
};
