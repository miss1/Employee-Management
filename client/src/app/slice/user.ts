import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserStateType, TokenType, LoginParamsType } from '../../utils/type.ts';
import { parseToken } from '../../utils/util.ts';
import {AppDispatch} from "../store.ts";
import {message} from "antd";
import { updateLoading } from './loading.ts';
import client from '../../graphql/apolloClient.ts';
import { LOGIN } from '../../graphql/user.ts';

export function getUserInfo(token: string): UserStateType {
  const userInfo: TokenType | null = parseToken<TokenType>(token);
  if (userInfo) {
    return {
      token: token,
      _id: userInfo._id,
      role: userInfo.role,
      email: userInfo.email,
      username: userInfo.username
    }
  }
  return {
    token: '',
    _id: '',
    role: '',
    email: '',
    username: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getUserInfo(localStorage.getItem('token') || ''),
  reducers: {
    updateUser: (state, action: PayloadAction<{token: string, _id: string, role: string, email: string, username: string}>) => {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
  },
});

export const { updateUser } = userSlice.actions;

export const doLogin = (params: LoginParamsType) => async (dispatch: AppDispatch) => {
  dispatch(updateLoading(true));
  try {
    const { data } = await client.mutate({mutation: LOGIN, variables: params});
    const userInfo = data.login;
    localStorage.setItem('token', userInfo.token);

    const info: UserStateType = getUserInfo(userInfo.token);
    dispatch(updateUser(info));

    if (info.role === 'employee') {
      window.location.href = `/onboarding`;
    } else {
      window.location.href = `/${info.role}`;
    }
  } catch (e) {
    console.error(String(e));
    message.error(String(e));
  } finally {
    dispatch(updateLoading(false));
  }
}

export default userSlice.reducer;