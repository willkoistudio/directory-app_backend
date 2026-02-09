import { IsString, IsEmail, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  cityId: string;

  @IsString()
  stateId: string;

  @IsString()
  postalCode: string;

  @IsString()
  countryId: string;
}

export class CreateContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  workPhone?: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsString()
  function: string;

  @IsString()
  website: string;

  @IsString()
  companyId: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

