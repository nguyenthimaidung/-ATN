export type ErrorCode = {
  message?: string
  errorCode: string | number
}

export const Errors = {
  NOT_EXISTS: {
    errorCode: 'NOT_EXISTS',
    message: 'Data not exist',
  },
  notExists: (name) => ({
    errorCode: 'NOT_EXISTS',
    message: `${name} not exist`,
  }),
  NOT_FOUND: {
    errorCode: 'NOT_FOUND',
    message: 'Data not found',
  },
  notFound: (name) => ({
    errorCode: 'NOT_FOUND',
    message: `${name} not exist`,
  }),
  CONFLICT_EMAIL: {
    errorCode: 'CONFLICT_EMAIL',
    message: 'User with provided email or phone number already exists',
  },
  EMAIL_OR_PASSWORD_INCORECT: {
    errorCode: 'EMAIL_OR_PASSWORD_INCORECT',
    message: 'Email or password is incorrect',
  },
  VERIFY_CODE_INCORRECT: {
    errorCode: 'VERIFY_CODE_INCORRECT',
    message: 'Verify code incorrect',
  },
  VERIFY_CODE_EXPIRED: {
    errorCode: 'VERIFY_CODE_EXPIRED',
    message: 'Verify code expired',
  },
  NOT_ENOUGHT_BOOK: (name?: string) => ({
    errorCode: 'NOT_ENOUGHT_BOOK',
    message: 'Not enought book' + (name ? ` ${name}` : ''),
  }),
  TEMP: {
    errorCode: 'errorCode',
    message: 'message',
  },
}
