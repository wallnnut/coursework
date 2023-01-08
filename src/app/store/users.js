import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import { history } from "../utils/history";
import { randomInt } from "../utils/randomInt";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceived: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.auth = null;
            state.isLoggedIn = false;
            state.dataLoaded = false;
        },
        userEdited: (state, action) => {
            const index = state.entities.findIndex(
                (u) => u._id === state.auth.userId
            );
            state.entities[index] = {
                ...state.entities[index],
                ...action.payload
            };
        },
        editRequestFailed: (state, action) => {
            state.error = action.payload;
        }
    }
});
const authRequested = createAction("users/authRequested");
const userCreateRequested = createAction("users/userCreateRequested ");
const createUserFailed = createAction("users/createUserFailed");
const editRequested = createAction("users/editRequested");
const { reducer: usersReducer, actions } = usersSlice;
const {
    usersRequested,
    usersReceived,
    usersRequestFailed,
    authRequestSuccess,
    authRequestFailed,
    userCreated,
    userLoggedOut,
    userEdited,
    editRequestFailed
} = actions;
export const signUp =
    ({ email, password, ...rest }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setToken(data);
            dispatch(authRequestSuccess(data.localId));
            createUser({
                _id: data.localId,
                email,
                rate: randomInt(1, 5),
                completedMeetings: randomInt(0, 400),
                image: `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                )
                    .toString(36)
                    .substring(7)}.svg`,
                ...rest
            });
        } catch (error) {
            dispatch(authRequestFailed(error.message));
        }
    };

export const signIn =
    ({ payload, redirect }) =>
    async (dispatch) => {
        const { email, password } = payload;
        dispatch(authRequested());
        try {
            const data = await authService.login({ email, password });
            dispatch(authRequestSuccess({ userId: data.localId }));
            localStorageService.setToken(data);
            history.push(redirect);
        } catch (error) {
            dispatch(authRequestFailed(error.message));
        }
    };

export const logOut = () => (dispatch) => {
    localStorageService.removeToken();
    dispatch(userLoggedOut());
    history.push("/");
};

const createUser = (payload) => async (dispatch) => {
    dispatch(userCreateRequested());
    try {
        const { data } = await userService.create(payload);
        dispatch(userCreated(data));
        history.push("/users");
    } catch (error) {
        dispatch(createUserFailed(error.message));
    }
};

export const editUser = (data) => async (dispatch) => {
    dispatch(editRequested());
    try {
        const { content } = await userService.editUser(data);
        dispatch(userEdited(data));
        history.goBack();
        return content;
    } catch (error) {
        dispatch(editRequestFailed(error.message));
    }
};

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequested());
    try {
        const { content } = await userService.get();
        dispatch(usersReceived(content));
    } catch (error) {
        dispatch(usersRequestFailed(error.message));
    }
};

export const getUsersList = () => (state) => state.users.entities;
export const getUser = (id) => (state) =>
    state.users.entities.find((user) => user._id === id);
export const getLoggedInStatus = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getIsLoadingStatus = () => (state) => state.users.isLoading;
export const getCurrentUserData = () => (state) => {
    return state.users.entities
        ? state.users.entities.find(
              (user) => user._id === state.users.auth.userId
          )
        : null;
};

export default usersReducer;
