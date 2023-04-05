<div class="row justify-content-center">
    <div class="col d-flex flex-column">
        <h1 class='mb-4'>Cart</h1>
    </div>
</div>
<div class="row justify-content-center" id="cart-empty-message">
    <h3 class='mb-4'>Здесь пусто, пока что!)</h3>
</div>
<div class="row justify-content-center">
    <div class="col d-flex flex-column" id="cart-content"></div>
</div>

<div class="row justify-content-center">
    <div class="col-12 mt-3 border-top" id="cart-content">
        <div class="cart-total">
            <div class="fw-bold">Итого:</div>
            <div class="cart-item_price" id="cart-total-sum">20000</div>
            <button class="btn btn-sm  btn-danger cart-item_btn-remove bi bi-trash" id="cart-btn-clear"></button>
        </div>
    </div>
    <div class="col-12 text-center mt-3">
        <button class="btn btn-lg fs-4 btn-warning cart-item_btn-remove me-auto fw-bold" id="cart-btn-buy"><i class="bi bi-bag-fill"></i> Заказать</button>
    </div>
</div>