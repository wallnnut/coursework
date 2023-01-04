/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getQualitiesLoadingStatus,
    getQuality
} from "../../../store/qualities";
const Quality = ({ id }) => {
    const quality = useSelector(getQuality(id));
    const isLoading = useSelector(getQualitiesLoadingStatus());
    if (!isLoading) {
        return (
            <span className={"badge m-1 bg-" + quality.color}>
                {quality.name}
            </span>
        );
    }
    return "Loading...";
};
Quality.propTypes = {
    qualitites: PropTypes.array
};

export default Quality;
