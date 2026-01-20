import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = new this.companyModel({
      name: createCompanyDto.name,
      phone: createCompanyDto.phone,
      fax: createCompanyDto.fax,
      website: createCompanyDto.website,
      logo: createCompanyDto.logo,
      area: createCompanyDto.area,
      street: createCompanyDto.address.street,
      cityId: createCompanyDto.address.cityId,
      postalCode: createCompanyDto.address.postalCode,
      countryId: createCompanyDto.address.countryId,
      notes: createCompanyDto.notes,
    });

    const savedCompany = await company.save();
    return this.mapToCompanyData(savedCompany);
  }

  async findAll() {
    const companies = await this.companyModel.find().exec();
    return companies.map((company) => this.mapToCompany(company));
  }

  async findOne(id: string) {
    const company = await this.companyModel.findById(id).exec();

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.mapToCompanyData(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const updateData: any = {};
    if (updateCompanyDto.name) updateData.name = updateCompanyDto.name;
    if (updateCompanyDto.phone) updateData.phone = updateCompanyDto.phone;
    if (updateCompanyDto.fax !== undefined)
      updateData.fax = updateCompanyDto.fax;
    if (updateCompanyDto.website !== undefined)
      updateData.website = updateCompanyDto.website;
    if (updateCompanyDto.logo) updateData.logo = updateCompanyDto.logo;
    if (updateCompanyDto.area) updateData.area = updateCompanyDto.area;
    if (updateCompanyDto.address) {
      updateData.street = updateCompanyDto.address.street;
      updateData.cityId = updateCompanyDto.address.cityId;
      updateData.postalCode = updateCompanyDto.address.postalCode;
      updateData.countryId = updateCompanyDto.address.countryId;
    }
    if (updateCompanyDto.notes !== undefined)
      updateData.notes = updateCompanyDto.notes;

    const company = await this.companyModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.mapToCompanyData(company);
  }

  async remove(id: string) {
    const result = await this.companyModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return { message: 'Company deleted successfully' };
  }

  private mapToCompany(company: any) {
    return {
      id: company._id.toString(),
      name: company.name,
      phone: company.phone,
      area: company.area,
      logo: company.logo,
      address: {
        street: company.street,
        cityId: company.cityId,
        postalCode: company.postalCode,
        countryId: company.countryId,
      },
      createdAt: company.createdAt,
    };
  }

  private mapToCompanyData(company: any) {
    return {
      id: company._id.toString(),
      name: company.name,
      phone: company.phone,
      fax: company.fax,
      website: company.website,
      logo: company.logo,
      area: company.area,
      address: {
        street: company.street,
        cityId: company.cityId,
        postalCode: company.postalCode,
        countryId: company.countryId,
      },
      notes: company.notes,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
