<?php

namespace App\Common\Enums;

enum ViewEnums: string
{
    case LOGIN = 'Auth/Login';

    // Dashboard Module
    case DASHBOARD_HOME = 'Dashboard/Home/Index';

    // Role Permission Module
    case ROLE_PERMISSION_INDEX = 'Dashboard/RolePermissions/Index';

    // App Settings Module
    case APP_SETTINGS_INDEX = 'Dashboard/AppSettings/Index';

    // Product Module
    case PRODUCT_INDEX = 'Dashboard/Product/Index';
    case PRODUCT_CREATE = 'Dashboard/Product/Create';
    case PRODUCT_EDIT = 'Dashboard/Product/Edit';

    // Sales Module
    case SALES_INDEX = 'Dashboard/Sales/Index';
    case SALES_CREATE = 'Dashboard/Sales/Create';
    case SALES_EDIT = 'Dashboard/Sales/Edit';

    // Stock Movement Module
    case STOCK_MOVEMENT_INDEX = 'Dashboard/StockMovement/Index';
}
