
const modal = new bootstrap.Modal(document.getElementById('reg-modal'));
const modalLoginButton = document.getElementById("reg-modal-login-btn");
modalLoginButton.addEventListener("click", () => document.getElementById("nav-login-btn").click());
const Login = new FormInputDebounse(
    {
        inputElement: document.getElementById("reg-login"),
        feedBackElement: document.getElementById("reg-login-feedback"),
        requestURL: IS_LOGIN_EXIST_URL,
        requestKeyName: 'login',
        validationFN: loginValidation,
        feedbackMessageFN: loginValidationFeedback,
    });
const Email = new FormInputDebounse(
    {
        inputElement: document.getElementById("reg-email"),
        feedBackElement: document.getElementById("reg-email-feedback"),
        feedbackMessageFN: function (string) {
            let feedback = "";
            if (string.length == 0) {
                feedback += "Поле не должно быть пустым<br>";
            } else {
                if (!Email.isValid) {
                    feedback += "Не корректный E-mail адрес<br>";
                }

            }
            return feedback;
        },
        requestURL: IS_EMAIL_EXIST_URL,
        requestKeyName: 'email',
        validationFN: function (string) {
            const regexp = new RegExp(`^(?=[A-Z])[A-Z0-9-._%+]+@[A-Z0-9-_.]+(?<=[A-Z])\.[A-Z]{2,9}$`, "i")
            return regexp.test(string);
        }
    });
const Password = new FormInput({
    inputElement: document.getElementById("reg-password"),
    feedBackElement: document.getElementById("reg-password-feedback"),
    validationFN: passwordValidation,
    feedbackMessageFN: passwordValidationFeedback,
});
const PasswordRepeat = new FormInput({
    inputElement: document.getElementById("reg-password-repeat"),
    feedBackElement: document.getElementById("reg-password-repeat-feedback"),
    validationFN: function (string) {
        return Password.value === string;
    },
    feedbackMessageFN: function (string) {
        return "Пароли не совпадают ";
    },
});

const Name = new FormInput({
    inputElement: document.getElementById("reg-name"),
    feedBackElement: document.getElementById("reg-name-feedback"),
    validationFN: commonValidation,
    feedbackMessageFN: commonValidationFeedback,
});
const Surname = new FormInput({
    inputElement: document.getElementById("reg-surname"),
    feedBackElement: document.getElementById("reg-surname-feedback"),
    validationFN: commonValidation,
    feedbackMessageFN: commonValidationFeedback,
});
const Country = new FormInput({
    inputElement: document.getElementById("reg-country"),
    feedBackElement: document.getElementById("reg-country-feedback"),
    validationFN: commonValidation,
    feedbackMessageFN: commonValidationFeedback,
});
const City = new FormInput({
    inputElement: document.getElementById("reg-city"),
    feedBackElement: document.getElementById("reg-city-feedback"),
    validationFN: commonValidation,
    feedbackMessageFN: commonValidationFeedback,
});
class Form {
    static #formIsValid = false;
    static #element = document.getElementById("reg-form");
    static #submit = document.getElementById("reg-form-submit");
    static #clear = document.getElementById("reg-form-clear");
    static #eventListeners = [
        Form.#element.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            if (Form.#formIsValid) { Form.#sendRegisterData(); }

        }, false),
        Form.#clear.addEventListener('click', event => {
            Form.reset();
            Form.#element.querySelectorAll("input").forEach(input=>input.dispatchEvent(CHANGE_EVENT));
            Form.checkValidity();
        }),
        Password.element.addEventListener("blur", () => {
            PasswordRepeat.checkValidity()
        }),
        Password.element.addEventListener("input", () => {
            PasswordRepeat.checkValidity()
        }),
    ]
    static #state = [
        { name: "reg-login", state: false, checkState: () => Login.isValid },
        { name: "reg-login-free", state: false, checkState: () => Login.isFree },
        { name: "reg-email", state: false, checkState: () => Email.isValid },
        { name: "reg-email-free", state: false, checkState: () => Email.isFree },
        { name: "reg-name", state: false, checkState: () => Name.isValid },
        { name: "reg-surname", state: false, checkState: () => Surname.isValid },
        { name: "reg-country", state: false, checkState: () => Country.isValid },
        { name: "reg-city", state: false, checkState: () => City.isValid },
        { name: "reg-password", state: false, checkState: () => Password.isValid },
        { name: "reg-password-repeat", state: false, checkState: () => PasswordRepeat.isValid }
    ];
    static checkValidity() {
        Form.#formIsValid = Form.#state.every(element => {
            const checkResult = element.checkState();
            element.state = checkResult;
            return checkResult;
        });
        if (Form.#formIsValid) {
            Form.#submit.disabled = false;
        } else {
            Form.#submit.disabled = true;
        }
    }
    static reset() {
        const inputs = Form.#element.querySelectorAll("input");
        inputs.forEach(input => {
            input.value = "";
        })
    }
    static #sendRegisterData() {
        const formData = new FormData(document.forms['reg-form']);
        const promise = fetch(REGISTER_USER_URL, {
            method: 'POST',
            body: formData
        });
        promise.then(response => {
            if (response.ok) {
                modal.show()
            }
        })
    }
}


