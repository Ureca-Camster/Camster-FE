import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyStudyGroup {
    studyId: number;
    studyName: string;
    description: string;
    emoji: string;
    isPublic: boolean;
}

interface MyStudyGroupsState {
    myStudyGroups: MyStudyGroup[];
}

const initialState: MyStudyGroupsState = {
    myStudyGroups: [
        {
          studyId: 100,
          studyName: "Java 알고리즘 스터디",
          description: "소개가 엄청나게 길어지면 어떻게 될까요? 저도 궁금해서 지금 테스트를 해보려고 합니다. 결과가 궁금합니다. 곧 월즈가 시작하는데 떨려서 죽겠습니다 아 맞다 장패드 포카 교환해야 하는데!",
          emoji: "✨",
          isPublic: false
        },
        {
          studyId: 200,
          studyName: "Python 알고리즘 스터디",
          description: "뭐 어쩌구 저쩌구 소개",
          emoji: "🐧",
          isPublic: true
        },
        {
          studyId: 220,
          studyName: "Figma 도전",
          description: "뭐 어쩌구 저쩌구 소개",
          emoji: "🔥",
          isPublic: false
        }
    ],
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