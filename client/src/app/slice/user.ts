import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserStateType, TokenType, LoginParamsType } from '../../utils/type.ts';
import { parseToken } from '../../utils/util.ts';
import {AppDispatch} from "../store.ts";
import {message} from "antd";
import { updateLoading } from './loading.ts';
import client from '../../graphql/apolloClient.ts';
import { User } from '../../graphql/user.ts';

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

export const doLogin = (params: LoginParamsType) => async (dispatch: AppDispatch) => {
  dispatch(updateLoading(true));
  try {
    const { data } = await client.mutate({mutation: User, variables: params});
    localStorage.setItem('token', data.login.token);
    const info: UserStateType = getUserInfo(data.login.token);
    dispatch(updateUser(info));
    window.location.href = `/${info.role}`;
  } catch (e) {
    console.error(String(e));
    message.error(String(e));
  } finally {
    dispatch(updateLoading(false));
  }
}

export default userSlice.reducer;