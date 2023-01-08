import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments/";
import { useDispatch, useSelector } from "react-redux";
import {
    createComment,
    getComments,
    getCommentsLoadingStatus,
    loadComments,
    removeComment
} from "../../store/comments";
import { useParams } from "react-router-dom";
import { getCurrentUserId } from "../../store/users";

const Comments = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const currentUserId = useSelector(getCurrentUserId());
    useEffect(() => {
        dispatch(loadComments(userId));
    }, [userId]);
    const comment = useSelector(getComments());
    const isLoading = useSelector(getCommentsLoadingStatus());
    const handleSubmit = (data) => {
        dispatch(
            createComment({ ...data, pageId: userId, userId: currentUserId })
        );
    };
    const handleRemoveComment = (id) => {
        dispatch(removeComment(id));
    };
    const sortedComments = orderBy(comment, ["created_at"], ["desc"]);
    return (
        <>
            <div className="card mb-2">
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {!isLoading ? (
                            <CommentsList
                                comments={sortedComments}
                                onRemove={handleRemoveComment}
                            />
                        ) : (
                            "Loading..."
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
