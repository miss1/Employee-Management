import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserStateType, TokenType } from '../../utils/type.ts';
import { parseToken } from '../../utils/util.ts';

export function getUserInfo(token: string): UserStateType {
  const userInfo: TokenType | null = parseToken<TokenType>(token);
  if (userInfo) {
    return {
      token: token,
      _id: userInfo._id,
      role: userInfo.role,
      email: userInfo.email
    }
  }
  return {
    token: '',
    _id: '',
    role: '',
    email: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getUserInfo(localStorage.getItem('token') || ''),
  reducers: {
    updateUser: (state, action: PayloadAction<{token: string, _id: string, role: string, email: string}>) => {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.role = action.payload.role;
      state.email = action.payload.email;
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;