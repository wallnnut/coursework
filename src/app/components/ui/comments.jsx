import { orderBy } from "lodash";
import React from "react";
import CommentsList, { AddCommentForm } from "../common/comments/";
import { useComment } from "../../hooks/useComments";

const Comments = () => {
    const { createComment, comment, removeComment } = useComment();

    const handleSubmit = (data) => {
        createComment(data);
    };
    const handleRemoveComment = (id) => {
        removeComment(id);
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
                        <CommentsList
                            comments={sortedComments}
                            onRemove={handleRemoveComment}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
