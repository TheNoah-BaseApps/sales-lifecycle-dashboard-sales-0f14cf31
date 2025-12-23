export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

export function validateIP(ip) {
  if (!ip || typeof ip !== 'string') {
    return { valid: false, error: 'IP address is required' };
  }
  
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    if (parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255)) {
      return { valid: true };
    }
  }
  
  if (ipv6Regex.test(ip)) {
    return { valid: true };
  }
  
  return { valid: false, error: 'Invalid IP address format' };
}

export function validateRole(role) {
  const validRoles = ['admin', 'manager', 'analyst', 'viewer'];
  
  if (!role || typeof role !== 'string') {
    return { valid: false, error: 'Role is required' };
  }
  
  if (!validRoles.includes(role)) {
    return { valid: false, error: `Role must be one of: ${validRoles.join(', ')}` };
  }
  
  return { valid: true };
}

export function validatePositiveInteger(value, fieldName = 'Value') {
  if (value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const num = parseInt(value);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }
  
  return { valid: true };
}

export function validateNonNegativeInteger(value, fieldName = 'Value') {
  if (value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const num = parseInt(value);
  if (isNaN(num) || num < 0) {
    return { valid: false, error: `${fieldName} must be a non-negative integer` };
  }
  
  return { valid: true };
}

export function validateDate(dateString, fieldName = 'Date') {
  if (!dateString) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: `Invalid ${fieldName.toLowerCase()} format` };
  }
  
  if (date > new Date()) {
    return { valid: false, error: `${fieldName} cannot be in the future` };
  }
  
  return { valid: true };
}

export function validateTime(timeString, fieldName = 'Time') {
  if (!timeString) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (!timeRegex.test(timeString)) {
    return { valid: false, error: `Invalid ${fieldName.toLowerCase()} format (use HH:MM or HH:MM:SS)` };
  }
  
  return { valid: true };
}

export function sanitizeString(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.trim();
}

export function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  return { valid: true };
}