export function authErrorGenerator(message) {
    switch (message) {
        case "EMAIL_NOT_FOUND":
            return "Пользователя с таким Email не существует";
        case "INVALID_PASSWORD":
            return "Введен неверный пароль";
        default:
            return "Слишком много попыток входа попробуйте позднее";
    }
}
