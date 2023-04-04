class Item {
    #name;
    #id;
    #container;
    #type;
    #element;
    #input;
    #parentId
    #buttonDelete;
    #buttonEditStart;
    #buttonEditFinish;

    #selected = false;
    #selectionStyles = ["bg-primary", "text-white", "fw-bold"];
    constructor(id, name, container, type = "sector", parentId = 0) {
        this.#element = document.createElement("div");
        this.#element.classList.add("input-group");
        this.#input = document.createElement("input");
        this.#input.setAttribute("type", "text");
        this.#input.classList.add("form-control");
        this.#input.classList.add("border-primary");
        this.#input.setAttribute("value", name);
        this.#name = name;
        this.#input.setAttribute("data-id", id);
        this.#id = id;
        this.#input.disabled = true;
        this.#element.appendChild(this.#input);

        //Кнопка начала редактирования названия
        this.#buttonEditStart = document.createElement("button");
        this.#buttonEditStart.classList.add("btn");
        this.#buttonEditStart.classList.add("btn-outline-primary");
        this.#buttonEditStart.classList.add("bi");
        this.#buttonEditStart.classList.add("bi-pencil-square");
        this.#element.appendChild(this.#buttonEditStart);

        //Кнопка начала редактирования названия
        this.#buttonEditFinish = document.createElement("button");
        this.#buttonEditFinish.classList.add("btn");
        this.#buttonEditFinish.classList.add("btn-outline-primary");
        this.#buttonEditFinish.classList.add("bi");
        // this.#buttonEditFinish.classList.add("bi-check-square");
        this.#buttonEditFinish.classList.add("bi-database-check");
        this.#buttonEditFinish.hidden = true;
        this.#element.appendChild(this.#buttonEditFinish);

        //Кнопка удаления элемента из списка
        this.#buttonDelete = document.createElement("button");
        this.#buttonDelete.classList.add("btn");
        this.#buttonDelete.classList.add("btn-outline-danger");
        this.#buttonDelete.setAttribute("type", "button");
        this.#buttonDelete.innerText = "DEL";
        this.#element.appendChild(this.#buttonDelete);

        this.#container = container;
        this.#container.appendChild(this.#element);
        this.#type = type;
        this.#parentId = parentId;

        this.#element.addEventListener("click", this.#handleItemClicked.bind(this));
        this.#input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                this.#handleEditFinish(event);
            }
        }.bind(this));
        this.#buttonEditStart.addEventListener("click", this.#handleEditStart.bind(this));
        this.#buttonEditFinish.addEventListener("click", this.#handleEditFinish.bind(this));
        this.#buttonDelete.addEventListener("click", this.#handleDeleteItem.bind(this));
    }
    #handleItemClicked() {
        if (this.#input.disabled === true) {
            //Испускает событие на которое подписывается объект Items при создании экземпляра Item
            this.selected = !this.selected;
            this.#element.dispatchEvent(new CustomEvent("itemClicked", {
                bubbles: true, detail: {
                    id: this.selected === true ? this.#id : 0,
                    eventEmmiter: this
                }
            }))
        }
    }
    #handleEditStart(event) {
        event.stopPropagation();
        this.#input.disabled = false;
        this.#buttonEditStart.hidden = true;
        this.#buttonEditFinish.hidden = false;
    }
    #handleEditFinish(event) {
        event.stopPropagation();
        this.#input.disabled = true;
        this.#buttonEditStart.hidden = false;
        this.#buttonEditFinish.hidden = true;
        const newName = this.#input.value;
        if (newName !== this.#name) {
            // debugger;
            const responce = fetchFormData({ action: "update", type: this.#type, id: this.#id, name: newName });
            responce.then(succes => {
                if (!succes) {
                    this.#input.value = this.#name;
                }
            });
        }
    }
    #handleDeleteItem(event) {
        event.stopPropagation();
        if (confirm(`Вы подтверждаете удаление\\n ${this.#type}: ${this.#name}`)) {
            this.#element.dispatchEvent(new CustomEvent("itemDelete", { bubbles: true, detail: { id: this.id } }));
        };
    }
    get element() { return this.#element }
    get id() { return this.#id }
    get name() { return this.#name }
    get type() { return this.#type }
    get selected() { return this.#selected }
    set selected(bool) {
        if (this.#selected !== bool) {

            this.#selected = bool
            this.#buttonDelete.disabled = bool;
            if (this.#selected) {
                this.#selectionStyles.forEach(style => this.#input.classList.add(style));
            } else {

                this.#selectionStyles.forEach(style => this.#input.classList.remove(style));
            }
        }
    }
    update({ id, name }) {
        if (this.#id == id) {
            this.#name = name;
            this.#input.setAttribute("value", name);
        }
    }
    delete() { this.#element.remove() }

}

class Items extends Array {
    #container;
    #selectedItemId;
    #itemsType;
    #parentId = 0;
    #eventEmitterElement;
    constructor({ container, itemsType, eventEmitterElement = undefined }) {
        super();
        this.#container = container;
        this.#itemsType = itemsType;
        this.#eventEmitterElement = eventEmitterElement;
        if (eventEmitterElement !== undefined) {
            eventEmitterElement.addEventListener("selectedItemChanged", this.#handleSelectedItemChanged.bind(this))
            eventEmitterElement.addEventListener("parentIdChanged", this.#handleParentIdChanged.bind(this))
        }
    }

    render(query_data) {
        if (!Array.isArray(query_data)) return;
        if (query_data.length === 0) {
            this.#container.classList.add("is-empty");
        } else {
            this.#container.classList.remove("is-empty");
        }
        if (this.#eventEmitterElement !== undefined) {
            if (this.#parentId > 0) {
                this.#container.classList.remove("is-undefined");
            } else {
                this.#container.classList.add("is-undefined");
            }
        }
        const query_data_ids = query_data.map(query_row => query_row.id)
        const query_data_names = query_data.map(query_row => query_row.name)
        if (this.length === 0) {
            query_data.forEach(query_row => {
                this.push(this.createItem({
                    id: query_row.id,
                    name: query_row.name,
                    container: this.#container,
                    type: this.#itemsType,
                    p_id: this.#parentId
                }));
            })
        } else {
            let index = 0;
            let findIndex;
            while (index < this.length) {
                findIndex = query_data_ids.findIndex(query_data_id => query_data_id == this[index].id);
                if (findIndex === -1) {
                    this[index].delete();
                    this.splice(index, 1);
                } else {
                    index++;
                }
            }
            query_data_ids.forEach((id, index) => {
                const findIndex = this.findIndex(item => item.id === id);
                if (findIndex === -1) {
                    this.push(this.createItem({
                        id: query_data_ids[index],
                        name: query_data_names[index],
                        container: this.#container,
                        type: this.#itemsType,
                        p_id: this.#parentId
                    }));
                } else {
                    this[findIndex].update({ id: query_data_ids[index], name: query_data_names[index] });
                }

            })
        }


    }
    updateData() {
        if (this.#parentId !== 0) {
            this.#get_items().then(query_data => { this.render(query_data) })
        }
    }
    createItem({ id, name, container, type, p_id }) {
        const newItem = new Item(id, name, container, type, p_id);
        newItem.element.addEventListener("itemClicked", this.#handleItemClicked.bind(this));
        newItem.element.addEventListener("itemDelete", this.#handleItemDelete.bind(this));
        return newItem;
    }
    #handleItemClicked(event) {
        this.#selectedItemId = event.detail.id;
        this.forEach(item => {
            if (item.id !== event.detail.id)
                item.selected = false;
        })
        this.#container.dispatchEvent(new CustomEvent("selectedItemChanged", {
            bubbles: false, detail: {
                id: this.#selectedItemId,
                type: this.#itemsType,
                eventEmmiter: event.detail.eventEmmiter
            }
        }));
    }
    #handleSelectedItemChanged(event) {
        this.#parentId = event.detail.id;
        this.#container.dispatchEvent(new CustomEvent("parentIdChanged", { bubbles: false }))
        if (this.#parentId === 0) {
            this.render([]);
        } else {
            this.#get_items().then(query_data => { this.render(query_data) })
        }
    }
    #get_items() { return get_data({ type: this.#itemsType, p_id: this.#parentId }) }
    #handleItemDelete(event) {
        const id = event.detail.id;
        fetch_data({ action: `delete ${this.#itemsType}`, id, p_id: this.parentId })
            .then(query_data => {
                this.render(query_data)
            })
    }

    #handleParentIdChanged(event) {
        this.#parentId = 0;
        this.render([]);
    }

    get container() { return this.#container; }
    get itemsType() { return this.#itemsType; }
    get selectedItemId() { return this.#selectedItemId; }
    get parentId() { return this.#parentId; }
}

class InputGroup {
    constructor({ element, type, controlledElement }) {
        this.element = element;
        this.type = type;
        this.input = element.querySelector("input");
        this.button = element.querySelector("button");
        this.input.addEventListener("input", this.#validate.bind(this));
        this.input.addEventListener("change", this.#validate.bind(this));
        this.input.addEventListener("paste", this.#validate.bind(this));
        this.controlledElement = controlledElement;
        this.button.addEventListener("click", this.#handleAddButtonClick.bind(this));
    }
    #handleAddButtonClick(event) {
        const name = this.input.value;
        const isValid = commonValidation(name);
        if (!isValid) return;
        const p_id = this.controlledElement.parentId;
        fetch_data({ action: `insert ${this.type}`, name, p_id }).then(query_data => {
            this.controlledElement.render(query_data);
        })
    }
    #validate() {
        const value = this.input.value;
        const isValid = commonValidation(value);
        this.button.disabled = !isValid;
        if (isValid) {
            this.input.classList.remove(IS_INVALID_MARK);
        } else {
            if (value !== "") this.input.classList.add(IS_INVALID_MARK);

        }

    }
}
class ProductForm {
    #modal;
    #container;
    #inputItems = {};
    #eventEmiter;
    #buttonDeny;
    #buttonConfirm;
    #buttonClose;

    #id;
    #type;
    #data;
    constructor({ modal, eventEmitterElement }) {
        this.#modal = modal;
        // this.#modal.show();
        this.#container = modal._element;
        eventEmitterElement.addEventListener("selectedItemChanged", this.#handleSelectedItemChange.bind(this));
        const controls = this.#container.querySelectorAll(".form-control");
        controls.forEach(item => {
            this.#inputItems[item.name] = item;
        });
        log(this.#inputItems);
        this.#buttonConfirm = this.#container.querySelector("#product-form-confirm");
        this.#buttonConfirm.addEventListener("click", this.#handleConfirm.bind(this));

        this.#buttonDeny = this.#container.querySelector("#product-form-deny");
        this.#buttonDeny.addEventListener("click", this.#handleDeny.bind(this));

        this.#buttonClose = this.#container.querySelector("#product-form-close");
        this.#buttonClose.addEventListener("click", this.#handleClose.bind(this));
    };
    #handleSelectedItemChange(event) {
        if (event.detail.id !== 0) {
            this.#id = event.detail.id;
            this.#type = event.detail.type;
            this.#eventEmiter = event.detail.eventEmmiter;
            this.#fetchData();
        }
    }
    #fetchData() {
        return fetchFormData({ action: "select", type: this.#type, id: this.#id })
            .then(product => {
                if (Array.isArray(product) && product.length === 1) {
                    this.#data = product[0];
                    this.#valuesFill();
                    this.show();
                    return true;
                }

            });
    }
    #valuesFill() {
        for (const name in this.#inputItems) {
            this.#inputItems[name].value = this.#data[name];
        }
    }
    #valuesExtract() {
        const values = {};
        for (let item in this.#inputItems) {
            values[item] = this.#inputItems[item].value;
        }
        return values;

    }
    #handleClose(event) {
        this.#eventEmiter.selected = false;
        this.#clearData();

    }
    #clearData() {
        this.#eventEmiter = undefined;
        this.#id = undefined;
        this.#type = undefined;
        this.#data = undefined;
    }
    #handleDeny() {
        this.#valuesFill();
    }
    #handleConfirm(event) {
        const parameters = {
            action: "update",
            type: this.#type,
            id: this.#id,
            ...this.#valuesExtract()
        };
        fetchFormData(parameters).then(succes => {
            if (succes) {
                this.#fetchData().then(succes => {
                    if (succes) {
                        this.#eventEmiter.update({ id: this.#data.id, name: this.#data.name })
                    }
                });
            } else {
                alert("Обновление не удалось")
            }
        })
    }
    show() {
        this.#modal.show();
    }
    hide() {
        this.#modal.hide();
    }
    get container() { return this.#container }
}
const sectorsContainer = document.getElementById("sectors-wrapper");
const categoriesContainer = document.getElementById("categories-wrapper");
const productsContainer = document.getElementById("products-wrapper");
const Sectors = new Items({ container: sectorsContainer, itemsType: "sector" });
const Categories = new Items({ container: categoriesContainer, itemsType: "category", eventEmitterElement: Sectors.container });
const Products = new Items({ container: productsContainer, itemsType: "product", eventEmitterElement: Categories.container });

const SectorsInputGroup = new InputGroup(
    {
        element: document.getElementById("sectors-input-group"),
        type: "sector",
        controlledElement: Sectors
    }
)
const CategoriesInputGroup = new InputGroup(
    {
        element: document.getElementById("categories-input-group"),
        type: "category",
        controlledElement: Categories
    }
)
const ProductsInputGroup = new InputGroup(
    {
        element: document.getElementById("products-input-group"),
        type: "product",
        controlledElement: Products
    }
)
const productForm = new ProductForm({
    modal: new bootstrap.Modal(document.getElementById('product-form')),
    eventEmitterElement: Products.container
});
// modal.show();

get_data().then(query_data => {
    Sectors.render(query_data);
});



function get_data({ type = 'sector', p_id = 0 } = {}) {
    const point = `${window.location.origin}/functions/sectors.php`
    let url = new URL(point);
    url.searchParams.set("q", "select");
    url.searchParams.set("type", type);
    url.searchParams.set("p_id", p_id);
    // url =
    // const promise = fetch("./functions/sectors.php?q=get");
    const promise = fetch(url);
    return promise.then(response => {
        if (response.ok) {
            return response.json()
        }
    })
}
function add_item(data) {
    const promise = fetch("./functions/sectors.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    return promise.then(response => {
        if (response.ok) {
            return response.json()
        }
    })
}
function fetch_data({ action = "", type = "", id = 0, name = "", p_id = 0 } = {}) {
    const parameters = {};
    if (action !== "") { parameters.action = action };
    if (type !== "") { parameters.type = type };
    if (id !== 0) { parameters.id = id };
    if (name !== "") { parameters.name = name };
    if (p_id !== 0) { parameters.p_id = p_id };
    try {
        const promise = fetch("./functions/sectors.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(parameters)
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
function fetchFormData({ action = "", type = "", id = 0, name = "", p_id = 0,
    brand = "", description = "", price = 0 } = {}) {
    const formData = new FormData();

    if (action !== "") { formData.append("action", action) };
    if (type !== "") { formData.append("type", type) };
    if (id !== 0) { formData.append("id", id) };
    if (p_id !== 0) { formData.append("p_id", p_id) };
    if (name !== "") { formData.append("name", name) };
    if (brand !== "") { formData.append("brand", brand) };
    if (description !== "") { formData.append("description", description) };
    if (price !== 0) { formData.append("price", price) };
    try {
        const promise = fetch("./functions/update_item.php", {
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
const form = document.forms[0];