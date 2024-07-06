export interface UserStateType {
  token: string,
  _id: string,
  role: string,
  email: string
}

export interface TokenType {
  _id: string,
  role: string,
  email: string
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