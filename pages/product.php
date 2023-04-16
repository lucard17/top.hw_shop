<?php
include_once('functions/dbconnect.php');
include_once('functions/functions.php');
try {
    $query = "SELECT * FROM products WHERE id=:id";
    $stmt = pdo()->prepare($query);
    $stmt->execute(['id' => $_GET['product']]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (count($result) == 1) {
        $result = $result[0];
    }
    if ($result["images_number"] > 0) {
        $result['images'] =  getProductImagesPathNames($result['id']);
    } else {
        $result['images'] = [];
    }
} catch (PDOException $e) {
    // echo json_encode(false);
    // echo json_encode($query);
    // echo json_encode($parameters);
    // echo json_encode($e);
}
?>
<div class="row justify-content-center ">
    <div class="col col-12 col-md-4">
        <div id="productImagesCarousel" class="carousel slide">
            <div class="carousel-indicators bg-opacity-10 w-100 m-0 py-3">
                <?php if (count($result['images']) > 1) : ?>

                    <?php foreach ($result['images'] as $index => $image) : ?>
                        <button type="button" data-bs-target="#productImagesCarousel" data-bs-slide-to="<?= $index ?>" <?= $index == 0 ? ' class="active"' : "" ?>aria-current="true" aria-label="Slide <?= $index + 1 ?>"></button>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <div class="carousel-inner">
                <?php if (count($result['images']) == 0) : ?>
                    <div class="carousel-item active">
                        <img src="images/no_image.png" class="d-block w-100" alt="no_image">
                    </div>
                <?php else : ?>
                    <?php foreach ($result['images'] as $index => $image) : ?>
                        <div class="carousel-item<?= $index == 0 ? " active" : "" ?>">
                            <img src="<?= $image['src'] ?>" class="d-block w-100" alt="<?= $result['name'] ?>">
                        </div>
                    <?php endforeach; ?>

                <?php endif; ?>


            </div>

            <?php if (count($result['images']) > 1) : ?>
                <button class="carousel-control-prev" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            <?php endif; ?>
        </div>
    </div>
    <div class="col col-12 col-md-8">
        <div class="product-card">
            <div class="product-card_info">
                <h2 class="product-card_header"><?= $result['name'] ?></h2>
                <table>
                    <tr>
                        <td>Производитель:</td>
                        <td><?= $result['brand'] ?></td>
                    </tr>
                    <tr>
                        <td>Код товара:</td>
                        <td><?= $result['id'] ?></td>
                    </tr>
                    
                    <tr>
                        <td>Описание:</td>
                        <td><?= $result['description'] ?></td>
                    </tr>

                </table>
            </div>
            <div class="product-card_buy">
                
                <p class="product-card_price"><?= $result['price'] ?></p>
                <button class="btn btn-warning" onclick="handleButtonBuy(<?= $result['id'] ?>)"><i class="bi bi-cart-plus fs-5"></i></button>
            </div>
        </div>
    </div>
</div>
