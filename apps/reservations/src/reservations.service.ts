import { Injectable } from '@nestjs/common';

import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationDocument } from './models';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepository: ReservationsRepository) {}
  public async create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
  }

  public async findAll(): Promise<ReservationDocument[]> {
    return this.reservationRepository.find({});
  }

  public async findOne(_id: string): Promise<ReservationDocument> {
    return this.reservationRepository.findOne({ _id });
  }

  public async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  public async remove(_id: string): Promise<ReservationDocument> {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
