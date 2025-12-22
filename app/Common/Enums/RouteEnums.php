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
    case ROLE_PERMISSION_GET_ALL_PERMISSIONS = 'role-permission.permissions.get-all-permissions';
    case ROLE_PERMISSION_CREATE_PERMISSION = 'role-permission.permissions.create-permission';
    case ROLE_PERMISSION_SYNC_PERMISSIONS_TO_ROLE = 'role-permission.permissions.sync-permissions-to-role';
    case ROLE_PERMISSION_GET_ROLE_PERMISSIONS = 'role-permission.permissions.get-role-permissions';

    // ========= App Settings Module =========
    case APP_SETTINGS_VIEW = 'app-settings.view';
    case APP_SETTINGS_GET_APP_SETTINGS = 'app-settings.get-app-settings';
    case APP_SETTINGS_UPDATE_APP_SETTINGS = 'app-settings.update-app-settings';

    // ========= Product Module =========
    case PRODUCT_INDEX = 'product.index';
    case PRODUCT_CREATE = 'product.create';
    case PRODUCT_EDIT = 'product.edit';
    case PRODUCT_GET_PRODUCTS_PAGINATION = 'product.get-products-pagination';
    case PRODUCT_CREATE_PRODUCT = 'product.create-product';
    case PRODUCT_UPDATE_PRODUCT = 'product.update-product';
    case PRODUCT_DELETE_PRODUCT = 'product.delete-product';
    case PRODUCT_GET_ALL_PRODUCTS = 'product.get-all-products';
    case PRODUCT_GET_PRODUCT_BY_ID = 'product.get-product-by-id';

    // ========= Sales Module =========
    case SALES_INDEX = 'sales.index';
    case SALES_CREATE = 'sales.create';
    case SALES_EDIT = 'sales.edit';
    case SALES_GET_SALES_PAGINATION = 'sales.get-sales-pagination';
    case SALES_CREATE_SALES = 'sales.create-sales';
    case SALES_UPDATE_SALES = 'sales.update-sales';
    case SALES_DELETE_SALES = 'sales.delete-sales';
    case SALES_GET_ALL_SALES = 'sales.get-all-sales';
    case SALES_GET_SALES_BY_ID = 'sales.get-sales-by-id';

    // ========= Stock Movement Module =========
    case STOCK_MOVEMENT_INDEX = 'stock-movement.index';
    case STOCK_MOVEMENT_GET_STOCK_MOVEMENTS_PAGINATION = 'stock-movement.get-stock-movements-pagination';
    case STOCK_MOVEMENT_GET_STOCK_MOVEMENTS_BY_PRODUCT_SLUG = 'stock-movement.get-stock-movements-by-product-slug';
    case STOCK_MOVEMENT_CREATE_STOCK_MOVEMENT = 'stock-movement.create-stock-movement';
    case STOCK_MOVEMENT_UPDATE_STOCK_MOVEMENT = 'stock-movement.update-stock-movement';
    case STOCK_MOVEMENT_DELETE_STOCK_MOVEMENT = 'stock-movement.delete-stock-movement';
    case STOCK_MOVEMENT_GET_ALL_STOCK_MOVEMENTS = 'stock-movement.get-all-stock-movements';
    case STOCK_MOVEMENT_GET_STOCK_MOVEMENT_BY_ID = 'stock-movement.get-stock-movement-by-id';
}
