import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { nanoid } from "nanoid";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        pageId: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = false;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequesFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter(
                (comment) => comment._id !== action.payload
            );
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequesFailed,
    commentCreated,
    commentRemoved
} = actions;
const createCommentRequested = createAction("comments/createCommentRequested");
const removeCommentRequested = createAction("comments/removeCommentRequested");

export const loadComments = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComment(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequesFailed(error.message));
    }
};

export const createComment = (data) => async (dispatch) => {
    const comment = {
        ...data,
        created_at: Date.now(),
        _id: nanoid()
    };
    dispatch(createCommentRequested());
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentsRequesFailed());
    }
};

export const removeComment = (commentId) => async (dispatch) => {
    dispatch(removeCommentRequested());

    try {
        const { content } = await commentService.deleteComment(commentId);
        dispatch(commentRemoved(commentId));
        return content;
    } catch (error) {}
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
