import { model } from '../models/permissions.model';
import { BasePermissions } from '../types/permission.type';

const basePermissionsData = [
    {
        name: BasePermissions.CREATE_USER,
        description: 'Can create new users',
        category: 'user_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.READ_USER,
        description: 'Can view user details',
        category: 'user_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.UPDATE_USER,
        description: 'Can update user details',
        category: 'user_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.DELETE_USER,
        description: 'Can delete users',
        category: 'user_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.CREATE_ROLE,
        description: 'Can create new roles',
        category: 'role_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.READ_ROLE,
        description: 'Can view role details',
        category: 'role_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.UPDATE_ROLE,
        description: 'Can update role details',
        category: 'role_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.DELETE_ROLE,
        description: 'Can delete roles',
        category: 'role_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.CREATE_PERMISSION,
        description: 'Can create new permissions',
        category: 'permission_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.READ_PERMISSION,
        description: 'Can view permission details',
        category: 'permission_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.UPDATE_PERMISSION,
        description: 'Can update permission details',
        category: 'permission_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.DELETE_PERMISSION,
        description: 'Can delete permissions',
        category: 'permission_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.CREATE_SUBSCRIPTION,
        description: 'Can create new subscriptions',
        category: 'subscription_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.READ_SUBSCRIPTION,
        description: 'Can view subscription details',
        category: 'subscription_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.UPDATE_SUBSCRIPTION,
        description: 'Can update subscription details',
        category: 'subscription_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.DELETE_SUBSCRIPTION,
        description: 'Can delete subscriptions',
        category: 'subscription_management',
        isBasePermission: true
    },
    {
        name: BasePermissions.MANAGE_SYSTEM,
        description: 'Can manage system settings',
        category: 'system_management',
        isBasePermission: true,
    } 
];

export async function seedPermissions() {
    try {
        for (const permission of basePermissionsData) {
            await model.findOneAndUpdate(
                { name: permission.name },
                permission,
                { upsert: true, new: true }
            );
        }
        console.log('Base permissions seeded successfully');
    } catch (error) {
        console.error('Error seeding permissions:', error);
    }
}