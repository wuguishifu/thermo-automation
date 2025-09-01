import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsSliceState = {
  temperatureDisplay: 'Fahrenheit' | 'Celsius';
};

const initialState: SettingsSliceState = {
  temperatureDisplay: 'Fahrenheit',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureDisplay: (state, action: PayloadAction<'Fahrenheit' | 'Celsius'>) => {
      state.temperatureDisplay = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
