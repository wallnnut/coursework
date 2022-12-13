/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { useQuality } from "../../../hooks/useQualitites";
const Quality = ({ id }) => {
    const { getQuality, isLoading } = useQuality();
    const quality = getQuality(id);
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
