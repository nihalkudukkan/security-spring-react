const ROLES = {
    ADMIN: [
        "delete:asset",
        "update:asset"
    ],
    USER: [
        "create:asset",
        "update:ownAsset",
        "delete:ownAsset",
    ]
}

export const hasPermission = (authenticated, role, permissions) => {
    if (!authenticated) {
        return false;
    }

    const rolePermissions = ROLES[role];
    if (!rolePermissions) {
        return false;
    }

    const hasAccess = permissions.some(permission => rolePermissions.includes(permission));
    return hasAccess;
}