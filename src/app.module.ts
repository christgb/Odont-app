import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './patient/patient.entity';
import { Appointment } from './appointment/appointment.entity';
import { DentalRecord } from './dental-record/dental-record.entity';
import { Service } from './service/service.entity';
import { CustomerInvoice } from './customer-invoice/customer-invoice.entity';
import { patientsModule } from './patient/patient.module';
import { PatientAppointmentsModule } from './appointment/appointment.module';
import { DentalRecordModule } from './dental-record/dental-record.module';
import { CustomerInvoiceModule } from './customer-invoice/customer-invoice.module';
import { ServiceModule } from './service/service.module';
import { customerInvoiceController } from './customer-invoice/customer-invoice.controller';
import { CustomerInvoiceService } from './customer-invoice/customer-invoice.service';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { CategoryProduct } from './category-product/category-product.entity';
import { Product } from './product/product.entity';
import { Supplier } from './supplier/supplier.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'testDatabase',
      database: 'odontdb',
      models: [Patient, Appointment, DentalRecord, Service, CustomerInvoice, CategoryProduct, Supplier, Product ],
      logging: console.log
    }),
    patientsModule,
    PatientAppointmentsModule,
    DentalRecordModule,
    ServiceModule,
    CustomerInvoiceModule,
    CategoryProductModule,
    SupplierModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
  exports: [patientsModule], 
})

export class AppModule {}


// docker run --name odontdb -e MYSQL_ROOT_PASSWORD=testDatabase -e MYSQL_DATABASE=odontdb -p 3306:3306 -d mysql:latest
// docker run --name odontdb -e POSTGRES_USER=host -e POSTGRES_PASSWORD=testDatabase -e POSTGRES_DB=odontdb -p 5432:5432 -d postgres:latest

