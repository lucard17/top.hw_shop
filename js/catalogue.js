class MenuItem {
    element
    #id;
    #name
    constructor({ id, name }) {
        this.#id = id;
        this.#name = name;
        this.element = createElement('li', { class: "list-group-item", style: "" });
        this.element.innerText = name;
        this.element.addEventListener("click", this.#handleClick.bind(this))
    }
    #handleClick(event) {
        get_products(this.#id).then(result => products.update(result));
        // fetchItems({ action: "select", type: "product", p_id: this.#id }).then(result => products.update(result));
    }
};
class Menu extends Array {
    #container;
    constructor({ json, container }) {
        super();
        this.#container = container;
        json.forEach((row, index) => {
            const i = index + 1;
            //Генерируем и вставляем accordionHeader
            // 
            const accordionItem = createElement("div", { class: "accordion-item" });
            this.#container.appendChild(accordionItem);
            accordionItem
                .appendChild(createElement("div", { class: "accordion-header" }))
                .appendChild(createElement("button", {
                    class: "accordion-button collapsed",
                    type: "button",
                    "data-bs-toggle": "collapse",
                    "data-bs-target": `#section-${i}`,
                    "aria-expanded": "false",
                    "aria-controls": `section-${i}`
                })).innerText = row.name;
            const categoriesContainer = createElement('ul', { class: "list-group list-group-flush" });
            accordionItem
                .appendChild(createElement("div", {
                    id: `section-${i}`,
                    class: "accordion-collapse collapse",
                    'data-bs-parent': "#catalogue-accordion"
                })).appendChild(categoriesContainer);
            const categoryItems = row.categories.map(category => new MenuItem(category));
            this.push(categoryItems);
            categoryItems.forEach(item => { categoriesContainer.appendChild(item.element) });
        });

    }
}
class Products extends Array {
    #container;
    #buttonBuy;
    constructor(container) {
        super();
        this.#container = container;
    }
    clear() {
        this.forEach(item => item.remove());
        this.splice(0);
    };
    update(items) {
        this.clear();
        items.forEach(item => {
            this.#push(this.createElement(item))
        })

    };
    createElement({ id, name, brand, description, price }) {
        this.#buttonBuy = createElement('button', { class: "btn btn-warning" }, [
            createElement('i', { class: "bi bi-cart-plus fs-5" })
        ]);
        this.#buttonBuy.addEventListener("click", () => {
            this.#handleButtonBuy(id);
        })
        return createElement('div', { class: "col col-lg-4" }, [
            createElement('div', { class: "card h-100" }, [
                createElement('div', { class: "card-body d-flex flex-column" }, [
                    createElement('h4', { class: "card-title mb-3" }, [name]),
                    createElement('p', { class: "card-text" }, [`<b>Бренд:</b> ${brand}`]),
                    createElement('p', { class: "card-text flex-grow-1" }, [`<b>Описание:</b> ${description}`]),
                    createElement('div', { class: "d-flex justify-content-between align-items-center" }, [
                        createElement('span', { class: "fs-5" }, [price]),
                        this.#buttonBuy
                    ]),
                ])

            ])
        ]);
        // <div class="col col-lg-4">
        //     <div class="card">
        //         <div class="card-body">
        //             <h5 class="card-title">Special title treatment</h5>
        //             <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        //             <div class="d-flex justify-content-between align-items-center">
        //                 <span class="fs-5">40000</span><button class="btn btn-warning"> <i class="bi bi-cart-plus fs-5"></i></button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    };
    #handleButtonBuy(p_id) {
        cart.addItem(p_id)
    }
    #push(element) {
        this.push(element);
        this.#container.appendChild(element);
    }
}
let menu;
let accordion = document.getElementById("catalogue-accordion");
get_catalogue().then(json => {
    menu = new Menu({
        json,
        container: document.getElementById("catalogue-accordion")
    })
});
const products = new Products(document.getElementById('products-container'))


function get_catalogue() {
    try {
        const promise = fetch("./functions/catalogue.php");
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
function get_products(id) {
    try {
        const promise = fetch(`./functions/products.php?id=${id}`);
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
