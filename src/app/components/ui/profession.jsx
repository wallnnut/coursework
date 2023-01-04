import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getProfession,
    getProfessionsLoadingStatus
} from "../../store/professions";

const Profession = ({ id }) => {
    const prof = useSelector(getProfession(id));
    const isLoading = useSelector(getProfessionsLoadingStatus());
    if (!isLoading) {
        return <p>{prof.name}</p>;
    } else return "Loading...";
};

Profession.propTypes = {
    id: PropTypes.string
};

export default Profession;
