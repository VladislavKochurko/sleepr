import { Injectable } from '@nestjs/common';

import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationDocument } from './models';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepository: ReservationsRepository) {}
  public create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123',
    });
  }

  public findAll(): Promise<ReservationDocument[]> {
    return this.reservationRepository.find({});
  }

  public findOne(_id: string): Promise<ReservationDocument> {
    return this.reservationRepository.findOne({ _id });
  }

  public update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  public remove(_id: string): Promise<ReservationDocument> {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
