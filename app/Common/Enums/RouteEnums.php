<?php

namespace App\Common\Enums;

enum RouteEnums: string
{
    // ========= Auth Module =========
    case LOGIN_VIEW = 'auth.login.view';
    case LOGIN_POST = 'auth.login.post';

        // ========= Dashboard Module =========
    case DASHBOARD_HOME_VIEW = 'dashboard.home.view';

        // ========= Role Permission Module =========
    case ROLE_PERMISSION_GET_ROLES_PAGINATION = 'role-permission.roles.get-roles-pagination';
    case ROLE_PERMISSION_CREATE_ROLE = 'role-permission.roles.create-role';
    case ROLE_PERMISSION_UPDATE_ROLE = 'role-permission.roles.update-role';
    case ROLE_PERMISSION_DELETE_ROLE = 'role-permission.roles.delete-role';
    case ROLE_PERMISSION_GET_ALL_ROLES = 'role-permission.roles.get-all-roles';
}
