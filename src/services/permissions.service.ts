import { IPermissionsRepo, PermissionsRepo } from '../repo/permissions.repo';
import { IPermission, BasePermissions, IRole } from '../types/permission.type';
import { IRolesRepo, RolesRepo } from '../repo/roles.repo';

export interface IPermissionService {
  getAllPermissions(query: Partial<IPermission>): Promise<Array<IPermission>>;
  checkPermissionExists(permissionName: string): Promise<boolean>;
  createCustomPermission(permissionData: Partial<IPermission>): Promise<IPermission>;
  updateCustomPermission(id: string, permissionData: Partial<IPermission>): Promise<IPermission>;
  deleteCustomPermission(id: string): Promise<boolean>;
  getAllRoles(query: Partial<IRole>): Promise<Array<IRole>>;
  createRole(roleData: Partial<IRole>): Promise<IRole>;
  updateRole(id: string, roleData: Partial<IRole>): Promise<IRole>;
  deleteRole(id: string): Promise<boolean>;
}

export default class PermissionService implements IPermissionService {
  permissionsRepo: IPermissionsRepo;
  rolesRepo: IRolesRepo;

  constructor() {
    this.permissionsRepo = PermissionsRepo;
    this.rolesRepo = RolesRepo;
  }

  async getAllPermissions(query: Partial<IPermission>): Promise<Array<IPermission>> {
    return await this.permissionsRepo.find(query);
  }

  async createCustomPermission(permissionData: Partial<IPermission>) {
    if (Object.values(BasePermissions).includes(permissionData.name as BasePermissions)) {
      throw 'Cannot create custom permission with reserved name';
    }

    const permission = await this.permissionsRepo.findOne({ name: permissionData.name });
    if (permission) {
      throw 'Permission with this name already exists';
    }

    return await this.permissionsRepo.create({
      ...permissionData,
      isBasePermission: false,
    });
  }

  async updateCustomPermission(id: string, permissionData: Partial<IPermission>) {
    if (Object.values(BasePermissions).includes(permissionData.name as BasePermissions)) {
      throw 'Cannot create custom permission with reserved name';
    }

    const permission = await this.permissionsRepo.findOne({ name: permissionData.name, _id: { $ne: id } });
    if (permission) {
      throw 'Permission with this name already exists';
    }

    return await this.permissionsRepo.updateOne(
      { _id: id, isBasePermission: false },
      {
        ...permissionData,
      },
    );
  }

  async deleteCustomPermission(id: string) {
    return await this.permissionsRepo.remove(id);
  }

  async checkPermissionExists(permissionName: string): Promise<boolean> {
    const permission = await this.permissionsRepo.findOne({ name: permissionName });
    return !!permission;
  }

  async getAllRoles(query: Partial<IRole>): Promise<Array<IRole>> {
    return await this.rolesRepo.find(query);
  }

  async createRole(roleData: Partial<IRole>) {
    const role = await this.rolesRepo.findOne({ name: roleData.name });
    if (role) {
      throw 'Role with this name already exists';
    }

    return await this.rolesRepo.create({
      ...roleData,
    });
  }

  async updateRole(id: string, roleData: Partial<IRole>) {
    const role = await this.rolesRepo.findOne({ name: roleData.name, _id: { $ne: id } });
    if (role) {
      throw 'Role with this name already exists';
    }

    return await this.rolesRepo.updateOne(id, {
      ...roleData,
    });
  }

  async deleteRole(id: string) {
    return await this.rolesRepo.remove(id);
  }
}
