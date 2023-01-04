import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/qualitity.service";

const qualitiesSlice = createSlice({
    name: "qualities",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        quaitiesRequested: (state) => {
            state.isLoading = true;
        },
        qualitiesRecived: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isLoading = false;
        },
        qualitiesRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: qualitiesReducer, actions } = qualitiesSlice;
const { quaitiesRequested, qualitiesRecived, qualitiesRequestFailed } = actions;

function isOutDated(date) {
    if (Date.now() - date > 10 * 1000 * 60) {
        return true;
    }
    return false;
}

export const loadQualitiesList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().qualities;
    if (isOutDated(lastFetch)) {
        dispatch(quaitiesRequested());
        try {
            const { content } = await qualityService.get();
            dispatch(qualitiesRecived(content));
        } catch (error) {
            dispatch(qualitiesRequestFailed(error.message));
        }
    }
};

export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesLoadingStatus = () => (state) =>
    state.qualities.isLoading;
export const getQuality = (id) => (state) =>
    state.qualities.entities.find((quality) => quality._id === id);

export default qualitiesReducer;
