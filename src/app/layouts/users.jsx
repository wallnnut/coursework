/* eslint-disable */
import React from "react";
import { useParams } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUser";
const Users = () => {
    const { userId, pageId } = useParams();
    return (
        <>
            <UserProvider>
                {userId ? (
                    pageId ? (
                        <EditUserPage />
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
            </UserProvider>
        </>
    );
};
export default Users;
// {userId ? (

//     pageId ? (<EditUserPage />)

//     <UserPage userId={userId} />
// ) : (
//     <UsersListPage />
// )}
