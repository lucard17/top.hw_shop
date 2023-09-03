const Login = new FormInput({
    inputElement: document.getElementById("login-form-login"),
    feedBackElement: document.getElementById("login-form-login-feedback"),
    validationFN: loginValidation,
    feedbackMessageFN: loginValidationFeedback,
});
const Password = new FormInput({
    inputElement: document.getElementById("login-form-password"),
    feedBackElement: document.getElementById("login-form-password-feedback"),
    validationFN: passwordValidation,
    feedbackMessageFN: passwordValidationFeedback,
});


class Form {
    static #formIsValid = false;
    static #element = document.getElementById("login-form");
    static #submit = document.getElementById("login-form-submit");
    static #clear = document.getElementById("login-form-clear");
    static #eventListeners = [
        // Form.#element.addEventListener('submit', event => {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     if (Form.#formIsValid) { Form.#sendRegisterData(); }

        // }, false),
        Form.#clear.addEventListener('click', event => {
            Form.reset();
            Form.#element.querySelectorAll("input").forEach(input => input.dispatchEvent(CHANGE_EVENT));
            Form.checkValidity();
        }),
    ]
    static #state = [
        { name: "login", state: false, checkState: () => Login.isValid },
        { name: "password", state: false, checkState: () => Password.isValid },
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
    // static #sendRegisterData() {
    //     const formData = new FormData(document.forms['reg-form']);
    //     const promise = fetch(REGISTER_USER_URL, {
    //         method: 'POST',
    //         body: formData
    //     });
    //     promise.then(response => {
    //         if (response.ok) {
    //             modal.show()
    //         }
    //     })
    // }
}

