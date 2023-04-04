<div class="row justify-content-center">
    <div class="col col-md-10 col-lg-6">
        <h1 class="mb-4">Control panel</h1>
    </div>
</div>
<div class="row g-5">
    <div class="col col-12 col-lg-4  d-flex flex-column">
        <h2 class="mb-4">Sectors</h2>
        <div class="card flex-grow-1">
            <div class="card-body d-flex flex-column">
                <div id="sectors-wrapper" class="d-flex flex-column gap-2 item-set flex-grow-1 is-empty">
                    <span class="is-empty-message"> Здесь пока нет записей</span>
                </div>
                <hr>
                <div class="input-group" id="sectors-input-group">
                    <input type="text" class="form-control border-success" placeholder="Sector name" value="sector" aria-label="" id="sector-add-input">
                    <button class="btn btn-success bi bi-database-add" type="button" id="sector-add-button"></button>
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
                    <button class="btn btn-success bi bi-database-add" type="button" id="category-add-button"></button>
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
                    <button class="btn btn-success bi bi-database-add" type="button" id="product-add-button"></button>
                </div>
                <!-- <div class="invalid-feedback">Не должно быть пустым</div> -->
            </div>
        </div>
    </div>
</div>
<div class="modal modal-xl fade" id="product-form" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered ">
        <form class="modal-content">
            <div class="modal-header  border-0 mb-3">
                <h4 class="modal-title">Редактирование продукта</h4>
                
                <button type="button" class="btn-close btn-lg" data-bs-dismiss="modal" aria-label="Close" id="product-form-close" ></button>
            </div>
            <div class="modal-body">
                <div class="form-group pb-3">
                    <label for="product-name">Name:</label>
                    <input type="text" name="name" id="product-name" class="form-control">
                </div>
                <div class="form-group pb-3">
                    <label for="product-brand">Brand:</label>
                    <input type="text" name="brand" id="product-brand" class="form-control">
                </div>
                <div class="form-group pb-3">
                    <label for="product-description">Description:</label>
                    <textarea class="form-control" id="product-description" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="product-price">Price:</label>
                    <input type="number" name="price" id="product-price" class="form-control" min="0">
                </div>
            </div>
            <div class="modal-footer  border-0">
                <button type="button" class="btn btn-lg btn-success flex-grow-1 mt-3 " id="product-form-confirm">
                    <i class="bi bi-database-check"></i> Accept
                </button>
                <button type="button" class="btn btn-lg btn-danger flex-grow-1 mt-3" id="product-form-deny">
                    <i class="bi bi-database-x"></i> Deny
                </button>
            </div>
        </form>
    </div>
</div>