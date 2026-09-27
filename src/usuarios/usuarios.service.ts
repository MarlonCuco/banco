import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async buscarRol(rolId: number) {
    const rol = await this.roleRepository.findOneBy({ id: rolId });
    if (!rol) {
      throw new NotFoundException(`El rol con id ${rolId} no existe`);
    }
    return rol;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { rolId, ...datos } = createUsuarioDto;
    const usuario = this.usuarioRepository.create(datos);
    if (rolId) {
      usuario.rol = await this.buscarRol(rolId);
    }
    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    const { rolId, ...datos } = updateUsuarioDto;
    Object.assign(usuario, datos);
    if (rolId) {
      usuario.rol = await this.buscarRol(rolId);
    }
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.usuarioRepository.softDelete(id);
    return { mensaje: `Usuario con id ${id} eliminado (lógico)` };
  }

  async asignarRol(id: number, rolId: number) {
    const usuario = await this.findOne(id);
    usuario.rol = await this.buscarRol(rolId);
    return this.usuarioRepository.save(usuario);
  }

  async restaurar(id: number) {
    const resultado = await this.usuarioRepository.restore(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    return this.findOne(id);
  }
}