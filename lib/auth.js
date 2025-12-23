import { verifyToken, getTokenFromHeader, getTokenFromCookie } from './jwt';

export async function getCurrentUser(request) {
  try {
    let token = getTokenFromHeader(request);
    
    if (!token) {
      token = getTokenFromCookie(request);
    }
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || !payload.userId) {
      return null;
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function hasPermission(userRole, requiredRole) {
  const roleHierarchy = {
    'admin': 4,
    'manager': 3,
    'analyst': 2,
    'viewer': 1,
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

export function canCreateRecord(userRole) {
  return ['admin', 'manager'].includes(userRole);
}

export function canUpdateRecord(userRole) {
  return ['admin', 'manager'].includes(userRole);
}

export function canDeleteRecord(userRole) {
  return ['admin', 'manager'].includes(userRole);
}

export function canViewAnalytics(userRole) {
  return ['admin', 'manager', 'analyst'].includes(userRole);
}

export function canManageUsers(userRole) {
  return userRole === 'admin';
}

export function canViewAllData(userRole) {
  return ['admin', 'manager', 'analyst'].includes(userRole);
}

export async function requireAuth(request, options = {}) {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      ),
    };
  }
  
  if (options.requiredRole && !hasPermission(user.role, options.requiredRole)) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      ),
    };
  }
  
  return {
    authorized: true,
    user,
  };
}