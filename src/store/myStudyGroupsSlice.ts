import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyStudyGroup {
    studyId: number;
    studyName: string;
    description: string;
    emoji: string;
}

interface MyStudyGroupsState {
    myStudyGroups: MyStudyGroup[];
}

const initialState: MyStudyGroupsState = {
    myStudyGroups: [],
};

const myStudyGroupsSlice = createSlice({
    name: 'myStudyGroups',
    initialState,
    reducers: {
        setMyStudyGroups: (state, action: PayloadAction<MyStudyGroup[]>) => {
            state.myStudyGroups = action.payload;
        },
        addMyStudyGroup: (state, action: PayloadAction<MyStudyGroup>) => {
            state.myStudyGroups.push(action.payload);
        },
        removeMyStudyGroup: (state, action: PayloadAction<number>) => {
            state.myStudyGroups = state.myStudyGroups.filter(
                group => group.studyId !== action.payload
            );
        },
        updateMyStudyGroup: (state, action: PayloadAction<MyStudyGroup>) => {
            const index = state.myStudyGroups.findIndex(
                group => group.studyId === action.payload.studyId
            );
            if (index !== -1) {
                state.myStudyGroups[index] = action.payload;
            }
        },
        resetMyStudyGroups: (state) => {
            state.myStudyGroups = [];
        },
    },
});

export const {
    setMyStudyGroups,
    addMyStudyGroup,
    removeMyStudyGroup,
    updateMyStudyGroup,
    resetMyStudyGroups
} = myStudyGroupsSlice.actions;

export default myStudyGroupsSlice.reducer;