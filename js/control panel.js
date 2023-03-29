class Item {
    #name;
    #id;
    #container;
    #type;
    #parentId;
    #element;
    #input;
    #buttonDelete;
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
        this.#element.addEventListener("click", this.#handleSelectEvent.bind(this));
        this.#buttonDelete.addEventListener("click", this.#handleDeleteItem.bind(this));
    }
    #handleSelectEvent() {
        this.#element.dispatchEvent(new CustomEvent("itemClicked", { bubbles: true, detail: { id: this.selected === false ? this.#id : 0 } }))
    }
    #handleDeleteItem(event) {
        event.stopPropagation();
        this.#element.dispatchEvent(new CustomEvent("itemDelete", { bubbles: true, detail: { id: this.id } }))
        // fetch_data({ action: `delete ${this.#type}`, id: this.#id, p_id: this.#parentId })
        //     .then(query_data => {
        //         actualize(query_data)
        //     })
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
            eventEmitterElement.addEventListener("parentIdReseted", this.#handleParentIdReseted.bind(this))
        }
    }

    actualize(query_data) {
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
            this.forEach((item, index) => {
                findIndex = query_data_ids.findIndex(value => value == item.id);
                if (findIndex === -1) {
                    this[index].delete();
                    this.splice(index, 1);
                }
            })
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
                }

            })
        }


    }
    createItem({ id, name, container, type }) {
        const newItem = new Item(id, name, container);
        newItem.element.addEventListener("itemClicked", this.#handleItemSelected.bind(this));
        newItem.element.addEventListener("itemDelete", this.#handleItemDelete.bind(this));
        return newItem;
    }
    #handleItemSelected(event) {
        this.#selectedItemId = event.detail.id;
        this.forEach(item => {
            item.selected = item.id === event.detail.id;
        })
        this.#container.dispatchEvent(new CustomEvent("selectedItemChanged", { bubbles: false, detail: { id: this.#selectedItemId } }));
    }

    #handleItemDelete(event) {
        const id = event.detail.id;
        fetch_data({ action: `delete ${this.#itemsType}`, id, p_id: this.parentId })
            .then(query_data => {
                this.actualize(query_data)
            })
    }

    #handleParentIdReseted(event) {
        this.#parentId = 0;
        this.actualize([]);
    }
    #handleSelectedItemChanged(event) {
        this.#parentId = event.detail.id;
        if (this.#parentId === 0) {
            this.actualize([]);
            this.#container.dispatchEvent(new CustomEvent("parentIdReseted", { bubbles: false }))
        } else {
            get_data({ type: this.#itemsType, p_id: this.#parentId }).then(query_data => { this.actualize(query_data) })
        }


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
            this.controlledElement.actualize(query_data);
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
get_data().then(query_data => {
    Sectors.actualize(query_data);
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
function fetch_data({ action = "", id = 0, name = "", p_id = 0 } = {}) {
    const parameters = {};
    if (action !== "") { parameters.action = action };
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
function actualizeByType(query_data, type) {
    switch (type) {
        case "sector":
            Sectors.actualize(query_data);
            break;
        case "category":
            Categories.actualize(query_data);
            break;
        case "product":
            Products.actualize(query_data);
            break;
    }
}
function unselectAnotherItems(id, type) {
    function unselect(item) {
        if (item.selected && item.id !== id) {
            item.selectedSwitch()
        }
    }
    switch (type) {
        case "sector":
            Sectors.forEach(unselect)
            break;
        case "category":
            Categories.forEach(unselect)
            break;
        case "product":
            Products.forEach(unselect)
            break;
    }
}