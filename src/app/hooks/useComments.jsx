import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";
import { toast } from "react-toastify";

const CommentContext = React.createContext();

export const useComment = () => {
    return useContext(CommentContext);
};

export const CommentProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { userId } = useParams();
    const [error, setError] = useState(null);
    const [comment, setComment] = useState();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        getComment();
    }, [userId]);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }

    async function createComment(data) {
        const comment = {
            ...data,
            pageId: userId,
            created_at: Date.now(),
            userId: currentUser._id,
            _id: nanoid()
        };
        try {
            const { content } = await commentService.createComment(comment);
            setComment((prevState) => [...prevState, content]);
            return content;
        } catch (error) {
            errorCatcher(error);
        }
    }
    async function getComment() {
        try {
            const { content } = await commentService.getComment(userId);
            setComment(content);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }

    async function removeComment(commentId) {
        try {
            const { content } = await commentService.deleteComment(commentId);
            if (content === null) {
                setComment((prevState) =>
                    prevState.filter((c) => c._id !== commentId)
                );
            }
            return content;
        } catch (error) {
            errorCatcher(error);
        }
    }

    return (
        <CommentContext.Provider
            value={{
                comment,
                createComment,
                isLoading,
                getComment,
                removeComment
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};

CommentProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
