import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const rol = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(rol);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.roleRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`El rol con id ${id} no existe`);
    }
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    return this.roleRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    await this.roleRepository.remove(rol);
    return { mensaje: `Rol con id ${id} eliminado` };
  }
}