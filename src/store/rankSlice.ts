import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RankItem {
    nickname: string;
    time: number;
}

interface RankState {
    ranks: RankItem[];
    lastUpdated: string;
}

const initialState: RankState = {
    ranks: [],
    lastUpdated: '',
};

const rankSlice = createSlice({
    name: 'rank',
    initialState,
    reducers: {
        setRanks: (state, action: PayloadAction<{ ranks: RankItem[], lastUpdated: string }>) => {
            state.ranks = action.payload.ranks;
            state.lastUpdated = action.payload.lastUpdated;
        },
        resetRanks: (state) => {
            state.ranks = [];
            state.lastUpdated = '';
        },
    },
});

export const { setRanks, resetRanks } = rankSlice.actions;
export default rankSlice.reducer;