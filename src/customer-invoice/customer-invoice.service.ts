import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerInvoice } from './customer-invoice.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCustomerInvoiceDto } from './dto';
import { Patient } from 'src/patient/patient.entity';
import { Service } from 'src/service/service.entity';
import { Appointment } from 'src/appointment/appointment.entity';

@Injectable()
export class CustomerInvoiceService {
    constructor(@InjectModel(CustomerInvoice) private customerInvoiceModel: typeof CustomerInvoice) { }

    async getCustomerInvoices(page:number, limit: number): Promise<{ items: CustomerInvoice[]; total: number }> {
        const offset = (page - 1) * limit;

        const customerInvoice = await this.customerInvoiceModel.findAndCountAll({
            limit: limit,
            offset:offset
        });

        return {
            items: customerInvoice.rows,
            total: customerInvoice.count,
        };
    }

    async getCustomerInvoiceById(id: number): Promise<CustomerInvoice> {
        if(id <= 0){
            throw new Error ('El ID no es válido')
        };
            return this.customerInvoiceModel.findOne({
                where: {
                    id: id
                }
            });


    }

    async createCustomerInvoice(dto: CreateCustomerInvoiceDto) {
        let appointment: Appointment = null;

        if (dto.appointmentId !== null && dto.appointmentId !== undefined) {
            appointment = await Appointment.findOne({
                where: {
                    id: dto.appointmentId,
                },
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Service,
                        attributes: ['id', "name", 'cost'],
                    },
                ],
            });
        }

        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        const totalCost: number = appointment.service.reduce((total, service) => total + service.cost, 0);
        const serviceIds: Service[] = appointment.service.map(service => service);
        try {
            const customerInvoice: CustomerInvoice = await this.customerInvoiceModel.create({
                patientName: appointment.patient.name,
                patientId: appointment.patientId,
                cost: totalCost,
                dateAppointment: appointment.appointmentDate,
                appointmentId: appointment.id,
                service: serviceIds
            });

            return customerInvoice;
        } catch (error) {
            throw new Error(error);
        }

    }
}

