import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import userService from "../services/user.service";
import { setToken } from "../services/localStorage.service";

const httpLogin = axios.create();

const LoginContext = React.createContext();

export const useLogin = () => {
    return useContext(LoginContext);
};

const LoginProvider = () => {
    return;
};
