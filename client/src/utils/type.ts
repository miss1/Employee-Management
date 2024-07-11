export interface UserStateType {
  token: string,
  _id: string,
  role: string,
  email: string,
  username: string
}

export interface TokenType {
  _id: string,
  role: string,
  email: string,
  username: string
}

export interface LoginParamsType {
  username: string,
  password: string
}

export interface RegistrationParamsType {
  username: string,
  password: string,
  token: string,
  email: string
}

export interface RegistrationTokenType {
  name: string,
  email: string
}

export interface OnboardingInformationType {
  firstName: string,
  lastName: string,
  middleName: string,
  preferredName: string,
  addressLine: string,
  city: string,
  state: string,
  postalCode: string,
  cellPhone: string,
  workPhone: string,
  email: string,
  ssn: string,
  birthDate: string,
  gender: string,
  workAuth: string,
  workAuthStart: string,
  workAuthEnd: string,
  optReceipt: string
}