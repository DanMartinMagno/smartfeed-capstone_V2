import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedState {
  type: 'starter' | 'grower' | 'finisher';
  numSwine: number;
  selectedIngredients: string[];
}

const initialState: FeedState = {
  type: 'starter', // Default value
  numSwine: 0,
  selectedIngredients: [],
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<'starter' | 'grower' | 'finisher'>) => {
      state.type = action.payload;
    },
    setNumSwine: (state, action: PayloadAction<number>) => {
      state.numSwine = action.payload;
    },
    setSelectedIngredients: (state, action: PayloadAction<string[]>) => {
      state.selectedIngredients = action.payload;
    },
  },
});

export const { setType, setNumSwine, setSelectedIngredients } = feedSlice.actions;

export default feedSlice.reducer;
