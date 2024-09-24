import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UserState에 member_id 추가
interface UserState {
    member_id: number | null;  // DB의 member_id
    nickname: string;
    email: string;
    goalTime: number;
    todayTime: number;
}

// 초기 상태에 member_id 추가
const initialState: UserState = {
    member_id: null,  // member_id를 초기값 null로 설정
    nickname: '',
    email: '',
    goalTime: 0,
    todayTime: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 유저 정보 설정 함수에 member_id 포함
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        // 유저 정보 리셋 함수 (member_id 포함)
        resetUser: () => initialState,
    },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
