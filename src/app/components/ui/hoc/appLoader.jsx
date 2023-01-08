import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
    getIsLoadingStatus,
    getLoggedInStatus,
    loadUsersList
} from "../../../store/users";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessions } from "../../../store/professions";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getLoggedInStatus());
    const usersLoadingStatus = useSelector(getIsLoadingStatus());

    useEffect(() => {
        dispatch(loadQualitiesList());
        dispatch(loadProfessions());
        if (isLoggedIn) dispatch(loadUsersList());
    }, [isLoggedIn]);

    if (usersLoadingStatus) return "Loading...";

    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AppLoader;
