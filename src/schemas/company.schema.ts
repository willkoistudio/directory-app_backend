import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  fax: string;

  @Prop()
  website: string;

  @Prop()
  logo: string;

  @Prop()
  area: string;

  @Prop()
  street: string;

  @Prop()
  cityId: string;

  @Prop()
  postalCode: string;

  @Prop()
  stateId: string;

  @Prop()
  countryId: string;

  @Prop()
  notes: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Add indexes
CompanySchema.index({ name: 1 });
