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

function createElement(type, attributes = {}, childs = [], key = "") {
    const element = document.createElement(type);
    for (attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    childs.forEach(child => {
        if (child instanceof Node) {
            element.appendChild(child);
        } else {
            element.innerHTML = child;
        }

    });
    if (key !== "") {
        this[key] = element;
    }
    return element;
}



class Cart {
    #container;
    #cartButton;
    #cartButtonBage;
    #isEmptyMessage;
    #totalSum;
    #buttonClear;
    #buttonBuy;
    #totalCount
    #totalPrice
    #cartItems = [];
    constructor({ cartButton }) {
        this.#cartButton = cartButton;
        this.#cartButtonBage = createElement('span', { class: "badge text-bg-secondary", hidden: true })
        this.#cartButton.appendChild(this.#cartButtonBage);
        this.actualizeCardTotalCount();
    }
    actualizeCardTotalCount() {
        this.getTotalCount().then(result => {
            if (Array.isArray(result) && result.length === 1) {
                this.#setTotalCount(result[0].totalCount);
                this.#getTotalSum();
                // this.isEmpty();
            }
        }
        )
    }
    #getTotalSum() {
        if (this.#cartItems.length === 0) return false;
        const totalSum = this.#cartItems.reduce((sum, item) => {
            if (item.checked) {
                return sum + item.count * item.price;
            } else {
                return sum;
            }
        }, 0);
        this.totalSum = totalSum;
        return totalSum;
    }
    set totalSum(value) {
        this.#totalSum.innerText = value;
    }
    #setTotalCount(totalCount) {
        this.#totalCount = totalCount;
        this.#cartButtonBage.innerText = totalCount;
        if (totalCount > 0) {
            this.#cartButtonBage.hidden = false;
        } else {
            this.#cartButtonBage.hidden = true;
        }
    }
    attachElements({ itemsContainer, isEmptyMessage, totalSum, buttonClear, buttonBuy }) {
        this.#container = itemsContainer;
        this.#isEmptyMessage = isEmptyMessage;
        this.#totalSum = totalSum;
        this.#buttonClear = buttonClear;
        this.#buttonClear.addEventListener("click", this.#handleButtonClear.bind(this))
        this.#buttonBuy = buttonBuy;
        this.#actualizeCartItems();
    }
    isEmpty() {
        if (this.#cartItems.length === 0) {
            this.#isEmptyMessage.hidden = false;
            return true;
        } else {
            this.#isEmptyMessage.hidden = true;
            return false;
        }

    }
    //Производит запрос данных,
    #actualizeCartItems() {
        this.getItems().then(result => {
            if (result !== false) {
                if (Array.isArray(result) && result.length > 0) {
                    this.#renderCart(result);
                }
            }
        })
    }
    #renderCart(data) {
        data.forEach(row => {
            this.#push(this.#createItem(row));
        });
        this.isEmpty();
        this.#getTotalSum();

    }
    #push(item) {
        this.#cartItems.push(item);
        this.#container.appendChild(item)
    }
    #remove(item) {
        this.#cartItems.forEach((element, index) => {
            if (element === item) {
                item.remove();
                this.#cartItems.splice(index, 1);
                this.actualizeCardTotalCount();
            }
        })

    }
    #createItem({ id, name, price, count }) {
        const newItem = new CartItem({ id, name, price, count });
        newItem.addEventListener('itemChecked', () => {
            this.#getTotalSum();
        });
        newItem.addEventListener('countDecrease', this.#handleCountChange.bind(this));
        newItem.addEventListener('countIncreace', this.#handleCountChange.bind(this));
        newItem.addEventListener('itemDelete', this.#handleItemDelete.bind(this));
        return newItem;
    }
    #handleCountChange(event) {
        const { id, srcElement, count } = event.detail;
        this.#changeCount(id, count).then(response => {
            if (response === true) {
                srcElement.count = count;
                this.actualizeCardTotalCount();
            }
        })
    }
    #handleItemDelete(event) {
        const { id, srcElement } = event.detail;
        this.#deleteItem(id).then(response => {
            if (response === true) {
                this.#remove(srcElement)
            }
        })

    }
    #handleButtonClear() {
        if (confirm(`Вы хотите очистить корзину?`)) {
            this.#clearCart();
        };

    }
    getTotalCount() {
        //получает общее количество единиц товаров в корзине
        return this.#fetch({ action: 'get_total_count' })
    }
    addItem(p_id) {
        //Добавляет предмет в корзину, если еще нет - создает, если уже есть - +1
        return this.#fetch({ action: 'add', p_id }).then(result => {
            if (result === true) {
                this.actualizeCardTotalCount();
            }
            return result;
        })
    }
    #changeCount(p_id, count) {
        //Изменяет количество предметов в корзине;
        return this.#fetch({ action: 'update', p_id, count })
    }
    #deleteItem(p_id) {
        //Удаляет товар из корзины;
        return this.#fetch({ action: 'delete', p_id })
    }
    #clearCart() {
        //Очищает корзину;
        return this.#fetch({ action: 'clear' })
    }
    getItems() {
        //запрашивает элементы корзины
        return this.#fetch({ action: 'get' })
    }
    #fetch({ action = 'get', p_id = 0, count = 0 }) {
        //Формирует запрос, возвращает результат true||false||JSON с данными
        const formData = new FormData();

        formData.append("action", action)

        if (p_id !== 0) { formData.append("p_id", p_id) };

        if (count !== 0) { formData.append("count", count) };

        try {
            const promise = fetch("./functions/cart.php", {
                method: 'POST',
                body: formData
            });
            return promise.then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
        } catch (e) {
            const error = e;
            log(error);
        }
    }


}
class CartItem extends HTMLElement {
    #id;
    #name;
    #price;
    #count;
    #checked = true;
    #checkBox;
    #counter;
    #counterButtonDecrease;
    #counterButtonIncrease;
    #priceElement;
    #buttonDelete;
    constructor({ id, name, price, count }) {
        super();
        this.#id = id;
        this.#name = name;
        this.className = "cart-item"
        this.#checkBox = createElement("input", {
            class: "form-check-input cart-item_checkbox",
            type: "checkbox", checked: true
        })
        this.appendChild(this.#checkBox);
        this.appendChild(createElement("div", {
            class: "cart-item_name"
        }, [name]));
        this.#counterButtonDecrease = createElement("button", {
            class: "bi bi-caret-left-fill cart-item_btn-counter"
        })

        this.#counter = createElement("span", {
            class: "cart-item_counter"
        }, [" "])
        this.#counterButtonIncrease = createElement("button", {
            class: "bi bi-caret-right-fill cart-item_btn-counter"
        })


        this.appendChild(createElement("div", {
        }, [
            this.#counterButtonDecrease,
            this.#counter,
            this.#counterButtonIncrease]
        ));
        this.count = count;
        this.#priceElement = createElement('div', {
            class: "cart-item_price"
        });
        this.appendChild(this.#priceElement);
        this.price = price;
        this.#buttonDelete = createElement("button", { class: "btn btn-sm cart-item_btn-remove bi bi-trash" })
        this.appendChild(this.#buttonDelete);
        this.#checkBox.addEventListener("click", () => {
            this.#checked = this.#checkBox.checked;
            this.dispatchEvent(
                new CustomEvent("itemChecked", {
                    detail: {
                        id: this.#id,
                        srcElement: this
                    }
                }));
        })
        this.#counterButtonDecrease.addEventListener('click', () => {
            if (this.count > 1) {
                this.dispatchEvent(
                    new CustomEvent("countDecrease", {
                        detail: {
                            id: this.#id,
                            count: this.count - 1,
                            srcElement: this
                        }
                    }));
            }
        })
        this.#counterButtonIncrease.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent("countIncreace", {
                    detail: {
                        id: this.#id,
                        count: this.count + 1,
                        srcElement: this
                    }
                }));
        });
        this.#buttonDelete.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent("itemDelete", {
                    detail: {
                        id: this.#id,
                        srcElement: this
                    }
                }));
        });

    }
    get id() { return this.#id };
    get name() { return this.#name };
    get price() { return this.#price };
    set price(value) { this.#priceElement.innerText = value; this.#price = value; }
    get count() { return this.#count };
    set count(value) { this.#counter.innerText = value; this.#count = value; }
    get checked() { return this.#checked; }

}
customElements.define('card-item', CartItem);
const cart = new Cart({ cartButton: document.getElementById("nav-cart-btn") });

