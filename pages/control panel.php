<div class="row justify-content-center">
    <div class="col col-md-10 col-lg-6">
        <h1 class="mb-4">Control panel</h1>
    </div>
</div>
<div class="row g-5">
    <div class="col col-12 col-lg-4  d-flex flex-column">
        <h2 class="mb-4 text-center">Sectors</h2>
        <div class="card flex-grow-1">
            <div class="card-body d-flex flex-column">
                <div id="sectors-wrapper" class="d-flex flex-column gap-2 item-set flex-grow-1 is-empty">
                    <span class="is-empty-message"> Здесь пока нет записей</span>
                </div>
                <hr>
                <div class="input-group" id="sectors-input-group">
                    <input type="text" class="form-control border-success" placeholder="Sector name" value="sector" aria-label="" id="sector-add-input">
                    <button class="btn btn-success" type="button" id="sector-add-button">Add</button>
                </div>
                <!-- <div class="invalid-feedback">Не должно быть пустым</div> -->
            </div>
        </div>


    </div>
    <div class="col col-12 col-lg-4 d-flex flex-column">
        <h2 class="mb-4">Categories</h2>
        <div class="card flex-grow-1">
            <div class="card-body d-flex flex-column">
                <div id="categories-wrapper" class="d-flex flex-column gap-2 item-set flex-grow-1 is-empty is-undefined">
                    <span class="is-empty-message"> Здесь пока нет записей</span>
                    <span class="is-undefined-message">Сектор не выбран</span>
                </div>
                <hr>
                <div class="input-group" id="categories-input-group">
                    <input type="text" class="form-control border-success" placeholder="Category name" value="category" aria-label="" id="category-add-input">
                    <button class="btn btn-success" type="button" id="category-add-button">Add</button>
                </div>
                <!-- <div class="invalid-feedback">Не должно быть пустым</div> -->
            </div>
        </div>
    </div>
    <div class="col col-12 col-lg-4 d-flex flex-column">
        <h2 class="mb-4">Products</h2>
        <div class="card flex-grow-1">
            <div class="card-body d-flex flex-column">
                <div id="products-wrapper" class="d-flex flex-column gap-2 item-set flex-grow-1 is-empty is-undefined">
                    <span class="is-empty-message">Здесь пока нет записей</span>
                    <span class="is-undefined-message">Категория не выбрана</span>
                </div>
                <hr>
                <div class="input-group" id="products-input-group">
                    <input type="text" class="form-control border-success" placeholder="Product name" value="product" aria-label="" id="product-add-input">
                    <button class="btn btn-success" type="button" id="product-add-button">Add</button>
                </div>
                <!-- <div class="invalid-feedback">Не должно быть пустым</div> -->
            </div>
        </div>
    </div>
</div>