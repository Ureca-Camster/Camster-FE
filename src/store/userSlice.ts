import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    nickname: string;
    email: string;
    goalTime: number;
    todayTime: number;
}

const initialState: UserState = {
    nickname: '',
    email: '',
    goalTime: 0,
    todayTime: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        resetUser: () => initialState,
    },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
