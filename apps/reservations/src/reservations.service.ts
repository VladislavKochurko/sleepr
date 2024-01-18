import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationDocument } from './models';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  public async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UserDto,
  ): Promise<ReservationDocument> {
    return await this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            userId,
            invoiceId: res.id,
          });
        }),
      )
      .toPromise();
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
