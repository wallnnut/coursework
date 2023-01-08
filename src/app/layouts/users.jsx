/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UsersLoader from "../components/ui/hoc/usersLoader";
import { getCurrentUserId } from "../store/users";
const Users = () => {
    const { userId, pageId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());

    return (
        <>
            <UsersLoader>
                {userId ? (
                    pageId ? (
                        userId === currentUserId ? (
                            <EditUserPage />
                        ) : (
                            <Redirect to={`/users/${currentUserId}/edit`} />
                        )
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
            </UsersLoader>
        </>
    );
};
export default Users;

