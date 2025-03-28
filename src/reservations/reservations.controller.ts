import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { JwtPayload } from '../auth/auth.interface';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my-reservations')
  async findMyReservations(@GetUser() user: JwtPayload) {
    return this.reservationsService.findReservationByEmail(user.email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
