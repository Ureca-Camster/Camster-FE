import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UserState에 member_id 추가
interface UserState {
    memberId: number | null;  // DB의 member_id
    nickname: string;
    email: string;
    goalTime: number;
    todayTime: number;
}

// 초기 상태에 member_id 추가
const initialState: UserState = {
    memberId: null,  // member_id를 초기값 null로 설정
    nickname: '',
    email: '',
    goalTime: 0,
    todayTime: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser(state, action: PayloadAction<{ memberId: number; nickname: string; email: string; goalTime: number; todayTime: number }>) {
        state.memberId = action.payload.memberId;
        state.nickname = action.payload.nickname;
        state.email = action.payload.email;
        state.goalTime = action.payload.goalTime;
        state.todayTime = action.payload.todayTime;
      },
      resetUser(state) {
        state.memberId = null;
        state.nickname = '';
        state.email = '';
        state.goalTime = 0;
        state.todayTime = 0;
      },
    },
  });

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
