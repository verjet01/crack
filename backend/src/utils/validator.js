const config = require('../config');

/**
 * Validate product codes
 * @param {string} productCode - Comma-separated product codes
 * @returns {Object} Validation result
 */
function validateProductCodes(productCode) {
  if (!productCode || typeof productCode !== 'string') {
    return {
      valid: false,
      error: 'productCode is required and must be a string'
    };
  }

  const codes = productCode.split(',').map(c => c.trim()).filter(c => c);
  
  if (codes.length === 0) {
    return {
      valid: false,
      error: 'At least one product code is required'
    };
  }

  const invalidCodes = codes.filter(code => !config.products[code]);
  
  if (invalidCodes.length > 0) {
    return {
      valid: false,
      error: `Invalid product codes: ${invalidCodes.join(', ')}`,
      validCodes: Object.keys(config.products)
    };
  }

  return {
    valid: true,
    codes
  };
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date string
 * @returns {Object} Validation result
 */
function validateDate(date) {
  if (!date) {
    return { valid: true, date: '2099-12-31' };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(date)) {
    return {
      valid: false,
      error: 'Date must be in YYYY-MM-DD format'
    };
  }

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return {
      valid: false,
      error: 'Invalid date'
    };
  }

  return {
    valid: true,
    date
  };
}

/**
 * Validate license name
 * @param {string} name - License name
 * @returns {Object} Validation result
 */
function validateLicenseName(name) {
  if (!name) {
    return { valid: true, name: 'ideacrack' };
  }

  if (typeof name !== 'string') {
    return {
      valid: false,
      error: 'License name must be a string'
    };
  }

  if (name.length > 100) {
    return {
      valid: false,
      error: 'License name must be less than 100 characters'
    };
  }

  return {
    valid: true,
    name: name.trim()
  };
}

/**
 * Validate assignee name
 * @param {string} name - Assignee name
 * @returns {Object} Validation result
 */
function validateAssigneeName(name) {
  if (!name) {
    return { valid: true, name: '' };
  }

  if (typeof name !== 'string') {
    return {
      valid: false,
      error: 'Assignee name must be a string'
    };
  }

  if (name.length > 100) {
    return {
      valid: false,
      error: 'Assignee name must be less than 100 characters'
    };
  }

  return {
    valid: true,
    name: name.trim()
  };
}

/**
 * Validate generate license request
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateGenerateRequest(body) {
  const errors = [];
  const validated = {};

  // Validate productCode
  const productValidation = validateProductCodes(body.productCode);
  if (!productValidation.valid) {
    errors.push(productValidation.error);
  } else {
    validated.productCodes = productValidation.codes;
    validated.productCode = body.productCode;
  }

  // Validate licenseName
  const licenseValidation = validateLicenseName(body.licenseName);
  if (!licenseValidation.valid) {
    errors.push(licenseValidation.error);
  } else {
    validated.licenseName = licenseValidation.name;
  }

  // Validate assigneeName
  const assigneeValidation = validateAssigneeName(body.assigneeName);
  if (!assigneeValidation.valid) {
    errors.push(assigneeValidation.error);
  } else {
    validated.assigneeName = assigneeValidation.name;
  }

  // Validate expiryDate
  const dateValidation = validateDate(body.expiryDate);
  if (!dateValidation.valid) {
    errors.push(dateValidation.error);
  } else {
    validated.expiryDate = dateValidation.date;
  }

  return {
    valid: errors.length === 0,
    errors,
    data: validated
  };
}

module.exports = {
  validateProductCodes,
  validateDate,
  validateLicenseName,
  validateAssigneeName,
  validateGenerateRequest
};
