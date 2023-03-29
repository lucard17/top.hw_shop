const d = document;
const log = console.log;
const IS_VALID_MARK = "is-valid"
const IS_INVALID_MARK = "is-invalid"
const IS_NOT_FREE_MARK = "is-not-free"
const LOGIN_MIN_LENGTH = 3;
const LOGIN_MAX_LENGTH = 30;
const LOGIN_REGEXP = new RegExp(`^(?=[A-Za-z])[A-Za-z0-9'_\\-.]{${LOGIN_MIN_LENGTH},${LOGIN_MAX_LENGTH}}(?<!\\.)$`);
const PASSWORD_REXEXP = new RegExp(`^(?=.*[A-Z]+.*)(?=.*[a-z]+.*)(?=.*[0-9]+.*)(?=.*[_-~!@#$%^&*(){}\\[\\]+\`'";:<>\\/\\\|]+.*).{8,50}$`);
const COMMON_REGEXP = new RegExp(`^(?=[A-Za-zА-Яа-яЁё])[A-Za-zА-Яа-яё0-9'\\-\\s]{2,50}(?<![\\s\\-'])$`);
const DEBOUNCE_TIMEOUT = 1000;
const REGISTER_USER_URL = "./functions/register.php"
const IS_LOGIN_EXIST_URL = "./functions/is_login_exist.php"
const IS_EMAIL_EXIST_URL = "./functions/is_email_exist.php"
const CHANGE_EVENT = new Event("change");


class FormInput {
    #element;
    #feedBackElement;
    #eventListeners;
    #value;
    #isValid;
    #getFeedbackMessage;
    #isItValid;
    constructor({ inputElement, feedBackElement, feedbackMessageFN, validationFN }) {
        this.#element = inputElement;
        this.#feedBackElement = feedBackElement;
        this.#eventListeners = [
            this.#element.addEventListener("blur", this.#eventHandler.bind(this)),
            this.#element.addEventListener("input", this.#eventHandler.bind(this)),
            this.#element.addEventListener("change", function () {
                if (this.#element.value == "") {
                    this.#isValid = false;
                    this.#element.classList.remove(IS_INVALID_MARK);
                    this.#element.classList.remove(IS_VALID_MARK);
                }
            }.bind(this)),
        ];
        this.#getFeedbackMessage = feedbackMessageFN;
        this.#isItValid = validationFN.bind(this);
    }
    #eventHandler() {
        this.#value = this.#element.value;
        this.checkValidity();
        this.#formatElement();
    }
    #formatElement() {
        if (this.#isValid) {
            this.#element.classList.remove(IS_INVALID_MARK);
            this.#element.classList.add(IS_VALID_MARK);
        } else {
            this.#element.classList.remove(IS_VALID_MARK);
            this.#element.classList.add(IS_INVALID_MARK);
            this.#feedBackElement.innerHTML = this.#getFeedbackMessage(this.#value);
        }
    }

    set isValid(isValid) {
        this.#isValid = isValid;
        this.#formatElement();
    }
    checkValidity() {
        this.isValid = this.#isItValid(this.value);
        setTimeout(Form.checkValidity, 0);
        return this.#isValid;
    }
    get isValid() {
        if (this.#isValid === undefined && this.value !== "") {
            this.checkValidity();
        }
        return this.#isValid;
    }
    get value() {
        this.#value = this.#element.value
        return this.#value
    }
    get element() { return this.#element }
}
class FormInputDebounse {
    #element;
    #feedBackElement;
    #eventListeners;
    #value;
    #isValid;
    #getFeedbackMessage;
    #isItValid;

    #isFree;
    #requestKeyName;
    #requestURL;
    #isExistDebounce;

    constructor({ inputElement, feedBackElement, feedbackMessageFN, validationFN, requestKeyName, requestURL }) {
        this.#element = inputElement;
        this.#feedBackElement = feedBackElement;
        this.#eventListeners = [
            this.#element.addEventListener("blur", this.#eventHandler.bind(this)),
            this.#element.addEventListener("input", this.#eventHandler.bind(this)),
            this.#element.addEventListener("change", function () {
                if (this.#element.value == "") {
                    this.#isValid = false;
                    this.#isFree = false;
                    this.#element.classList.remove(IS_INVALID_MARK);
                    this.#element.classList.remove(IS_VALID_MARK);
                }
            }.bind(this)),
        ];
        this.#isExistDebounce = getDebounceFunction(this.#isExist.bind(this));
        this.#getFeedbackMessage = feedbackMessageFN;
        this.#isItValid = validationFN.bind(this);
        this.#requestKeyName = requestKeyName;
        this.#requestURL = requestURL;
    }
    #eventHandler(event) {
        this.#value = this.#element.value;
        switch (event.type) {
            case 'blur':
                this.checkValidity();
                this.isItFree(0);
                this.#formatElement();
                break;
            case 'input':
                this.checkValidity();
                this.isItFree(DEBOUNCE_TIMEOUT)
                this.#formatElement();
                break;
        }

    }
    #formatElement() {
        if (this.#isValid) {
            this.#element.classList.remove(IS_INVALID_MARK);
            if (this.#isFree) this.#element.classList.add(IS_VALID_MARK);
        } else {
            this.#element.classList.remove(IS_VALID_MARK);
            this.#element.classList.add(IS_INVALID_MARK);
            this.#element.classList.remove(IS_NOT_FREE_MARK);
            this.#feedBackElement.innerHTML = this.#getFeedbackMessage(this.#value);
        }
    }
    set isValid(isValid = this.#isValid) {
        this.#isValid = isValid;

    }
    get isValid() {
        if (this.#isValid === undefined && this.value !== "") {
            this.checkValidity();
        }
        return this.#isValid;
    }


    get element() { return this.#element }

    checkValidity() {
        this.isValid = this.#isItValid(this.#value);
        return this.#isValid;
    }
    set isFree(value) {
        this.#isFree = value;
        if (this.#isFree) {
            this.#element.classList.remove(IS_NOT_FREE_MARK);
            setTimeout(Form.checkValidity, 0);
        } else {
            this.#element.classList.add(IS_NOT_FREE_MARK);
            this.#element.classList.remove(IS_VALID_MARK);
            this.#element.classList.add(IS_INVALID_MARK);
            this.#feedBackElement.innerHTML = this.#getFeedbackMessage(this.#value);
        }
    }
    get isFree() {
        return this.#isFree;
    }
    isItFree(timeout) {
        this.#isExistDebounce(timeout).then(exist => {
            if (this.#isValid) {
                this.isFree = !exist;
                this.#formatElement();
            }
        })
    }

    #isExist() {
        return new Promise((resolve, reject) => {
            const promise = fetch(this.#requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [this.#requestKeyName]: this.#value })
            });
            promise.then(response => {
                if (response.ok) {
                    resolve(response.json())
                }
                else {
                    reject(response.status);
                }
            })
        })
    };
}
function getDebounceFunction(callback) {
    let timer;
    return function (timeout = DEBOUNCE_TIMEOUT, isValid = true) {
        clearTimeout(timer);
        if (isValid) {
            return new Promise(
                resolve => {
                    timer = setTimeout(() => {
                        resolve(callback());
                    }, timeout);
                }
            );
        } else {
            return new Promise(resolve => {
                resolve(false);
            });
        }
    }
}
function commonValidationFeedback(string) {
    let feedback = "";
    if (string.length == 0) {
        feedback += "Поле не должно быть пустым<br>";
    } else {
        if (string.length >= 2 && string.length <= 50) {
            if (!(/^[A-Za-zА-Яа-яёЁ]/.test(string))) feedback += "Строка должна начинаться с буквы<br>";
            if (!(/^[A-Za-zА-Яа-яЁё0-9'\-\s]+$/.test(string))) feedback += "Допускаюстя буквы, цифры, пробелы, символы: ',-,<br>";
            if (/['\-\s]$/.test(string)) feedback += "Строка не может заканчиваться символом<br>";

        } else {
            if (string.length < 2) feedback += "Строка слишком короткая<br>";
            if (string.length > 50) feedback += "Строка слишком длинная<br>";
        }
    }
    return feedback;
}
function commonValidation(string) {
    return COMMON_REGEXP.test(string);
}
function passwordValidation(string) {
    return PASSWORD_REXEXP.test(string);
}
function passwordValidationFeedback(string) {
    let feedback = "";
    if (string.length == 0) {
        feedback += "Пароль должен быть!)<br>";
    } else {
        // if (string.length >= 8 && string.length <= 50) {
        if (!(/[a-z]/.test(string)) && !(/[A-Z]/.test(string))) {
            feedback += "Пароль должен содержать какие-нибудь буквы<br>";
        } else {
            if (!(/[A-Z]/.test(string))) feedback += "Пароль должен содержать заглавные буквы тоже<br>";
        }
        if ((/[A-Z]/.test(string)) && !(/[a-z]/.test(string))) {
            feedback += "Пароль должен содержать строчные буквы тоже<br>";
        }
        if (!(/[0-9]/.test(string))) feedback += "Пароль должен содержать цифры<br>";
        if (!(/[_-~!@#$%^&*(){}\[\]+\`'";:<>\/\\|]/.test(string))) feedback += "Пароль должен содержать символы<br>";
        if (string.length < 8) feedback += "Пароль должнен быть длиннее)<br>";
        if (string.length > 50) feedback += "И как вы это запомните?)<br>";

    }
    return feedback;
}

function loginValidation(string) {

    return LOGIN_REGEXP.test(string);
}

function loginValidationFeedback(string) {
    let feedback = "";
    if (string.length == 0) {
        feedback += "Поле не должно быть пустым<br>";
    } else {
        if (string.length >= LOGIN_MIN_LENGTH && string.length <= LOGIN_MAX_LENGTH) {
            if (!(/^[A-Za-z]/.test(string))) feedback += "Логин должен начинаться с буквы<br>";
            if (!(/^[A-Za-z0-9'\-._]+$/.test(string))) feedback += "Допускаются латинские буквы, цифры, символы: .-_'<br>";
            if (/\.$/.test(string)) feedback += "Логин не может заканчиваться точкой<br>";

        } else {
            if (string.length < LOGIN_MIN_LENGTH) feedback += "Логин слишком короткий<br>";
            if (string.length > LOGIN_MAX_LENGTH) feedback += "Логин слишком длинный<br>";
        }
    }
    return feedback;
}
function setValidationStyle(element, isValid = null) {
    if (isValid === null) {
        element.classList.remove(IS_INVALID_MARK);
        element.classList.remove(IS_VALID_MARK);
        return;
    }
    if (isValid) {
        element.classList.remove(IS_INVALID_MARK);
        element.classList.add(IS_VALID_MARK);
        return;
    } else {
        element.classList.remove(IS_VALID_MARK);
        element.classList.add(IS_INVALID_MARK);
        return;
    }

}

