/*eslint-disable */
import React, { useState, useEffect } from "react";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import { useAuth } from "../../../hooks/useAuth";
import { useQuality } from "../../../hooks/useQualitites";
import { useProfession } from "../../../hooks/useProfession";
import { useUser } from "../../../hooks/useUser";
import { Redirect, useParams } from "react-router-dom";

const EditUserPage = () => {
    const { userId, pageId } = useParams();
    const [errors, setErrors] = useState({});
    const { currentUser, editUser } = useAuth();
    const { getUserById } = useUser();
    const user = getUserById(userId);
    const { email, name, profession, qualities: userQualities, sex } = user;
    const { professions } = useProfession();
    const { qualities } = useQuality();
    const qualArray = qualities.map((qual) => {
        return {
            label: qual.name,
            value: qual._id,
            color: qual.color
        };
    });
    const profArray = professions.map((prof) => {
        return {
            label: prof.name,
            value: prof._id
        };
    });

    const getQualities = (elements) => {
        const qualitiesArray = [];
        for (const elem of elements) {
            for (const quality in qualities) {
                if (elem.value === qualArray[quality].value) {
                    qualitiesArray.push(qualArray[quality].value);
                }
            }
        }
        return qualitiesArray;
    };

    const defaultValue =
        qualities && qualArray.filter((q) => userQualities.includes(q.value));

    const [data, setData] = useState({
        name: name,
        email: email,
        profession: profession,
        sex: sex,
        qualities: userQualities
    });
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validatorConfig = {
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        }
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    useEffect(() => {
        validate();
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { qualities } = data;
        const newData = {
            ...data,
            qualities: getQualities(qualities)
        };
        try {
            editUser(newData);
        } catch (error) {
            setErrors(error);
        }
    };
    return (
        <>
            {currentUser._id === userId ? (
                user &&
                professions &&
                qualities && (
                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 shadow p-4">
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="Фамилия имя"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                    />
                                    <TextField
                                        label="Почта"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                    <SelectField
                                        label="Выбери свою профессию"
                                        options={profArray}
                                        name="profession"
                                        onChange={handleChange}
                                        value={data.profession}
                                        error={errors.profession}
                                    />
                                    <RadioField
                                        options={[
                                            { name: "Male", value: "male" },
                                            { name: "Female", value: "female" },
                                            { name: "Other", value: "other" }
                                        ]}
                                        value={data.sex}
                                        name="sex"
                                        onChange={handleChange}
                                        label="Выберите ваш пол"
                                    />
                                    <MultiSelectField
                                        options={qualArray}
                                        onChange={handleChange}
                                        defaultValue={defaultValue}
                                        name="qualities"
                                        label="Выберите ваши качества"
                                    />
                                    <button
                                        className="btn btn-primary w-100 mx-auto"
                                        type="submit"
                                        disabled={!isValid}
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <Redirect to={"/users/" + currentUser._id + "/edit"} />
            )}
        </>
    );
};

export default EditUserPage;
