export function combineValidate(...validate) {
  for (const valid of validate) {
    if (valid() !== 'is-valid') {
      return false;
    }
  }
  return true;
}
export function validatePasword(field) {
  return function () {
    const password = this.state[field];
    return password === '' ? '' : password.length >= 6 ? 'is-valid' : 'is-invalid';
  };
}
export function validateName(field) {
  return function () {
    const name = this.state[field];
    return name === '' ? '' : name.trim().length >= 6 ? 'is-valid' : 'is-invalid';
  };
}
export function validateEmail(field) {
  return function () {
    const email = this.state[field];
    return email === ''
      ? ''
      : /^[_A-Za-z0-9]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(email)
      ? 'is-valid'
      : 'is-invalid';
  };
}
export function validateConfirmPassword(fieldPassword, fieldConfirm) {
  return function () {
    const password = this.state[fieldPassword];
    const confirmPassword = this.state[fieldConfirm];
    return confirmPassword === '' ? '' : confirmPassword === password ? 'is-valid' : 'is-invalid';
  };
}
export function validateNotEmpty(field) {
  return function (isform) {
    const data = this.state[field];
    return isform && data === '' ? '' : data && data.trim().length > 0 ? 'is-valid' : 'is-invalid';
  };
}
