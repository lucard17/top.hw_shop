<?php $ROOT = __DIR__;
session_start();
include_once("$ROOT/functions/functions.php");
?>

<?php $pages['catalogue'] = 1; ?>
<?php if (isset($_SESSION['autorized'])) $pages['control panel'] = 4; ?>
<?php if (isset($_SESSION['autorized'])) $pages['cart'] = 5; ?>
<?php if (!isset($_SESSION['autorized'])) $pages['registration'] = 2;  ?>
<?php if (!isset($_SESSION['autorized'])) $pages['login'] = 3;  ?>
<?php if (isset($_SESSION['autorized'])) $pages['logout'] = 3;
?>
<?php
$page = 0;
if (!isset($_GET["product"])) {
    isset($_GET["page"]) ? $page = $_GET["page"] : $page = 1;
}
?>
<?php

?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/bootstrap.css">
    <!-- <link rel="stylesheet" href="css/style.css"> -->
    <!-- <script src="js/imask.js" defer></script> -->
    <!-- <script src="js/index.js" defer></script> -->
    <!-- <script src="js/validation.js" defer></script> -->

    <?php if (getPageName($page)  === 'registration') : ?>
        <link rel="stylesheet" href="css/registration.css">
    <?php endif; ?>
    <?php if (getPageName($page)  === 'control panel' && isset($_SESSION['autorized'])) : ?>
        <link rel="stylesheet" href="css/control panel.css">
    <?php endif; ?>
    <?php if (getPageName($page)  === 'catalogue') : ?>
        <link rel="stylesheet" href="css/catalogue.css">
    <?php endif; ?>
    <?php if (getPageName($page)  === 'cart') : ?>
        <link rel="stylesheet" href="css/cart.css">
    <?php endif; ?>
    <?php if (isset($_GET["product"])) : ?>
        <link rel="stylesheet" href="css/product.css">
    <?php endif; ?>
</head>

<body>
    <nav class="navbar navbar-expand-sm">
        <div class="container">
            <a class="navbar-brand fw-bold align-items-baseline" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav w-100 text-end">
                    <?php $navItemsClasses = [
                        '$common' => ['nav-item text-capitalize fw-bold'],
                        "registration" => ['$common ms-sm-auto'],
                        "control panel" => ['$common ms-sm-auto me-sm-auto'],
                    ];
                    function insertStyles($styles = [], $prefix = "", $suffix = "")
                    {
                        $string = "$prefix";
                        $length = count($styles);
                        foreach ($styles as $index => $style) {
                            $string .= $style . ($index < $length ? " " : "$suffix");
                        }
                        echo $string;
                    }
                    function navItemClasses($pageName)
                    {
                        global $navItemsClasses;
                        if (!isset($navItemsClasses[$pageName])) {
                            insertStyles($navItemsClasses['$common']);
                        } else {
                            $styles = $navItemsClasses[$pageName];
                            foreach ($styles as $index => $style) {
                                $styles[$index] = str_replace('$common', $navItemsClasses['$common'][0], $style);
                            }
                            insertStyles($styles);
                        }
                    }
                    ?>
                    <?php foreach ($pages as $pageName => $pageNumber) { ?>

                        <li class="<?php navItemClasses($pageName) ?>">
                            <a href="<?= $pageNumber == $page ? "#" : "index.php?page=$pageNumber" ?>" class="<?php
                                                                                                                if ($pageName !== 'cart') {
                                                                                                                    echo "nav-link" . ($pageNumber == $page ? ' active' : '');
                                                                                                                } else {
                                                                                                                    echo "btn btn-warning" . ($pageNumber == $page ? ' fw-bold' : '');
                                                                                                                }
                                                                                                                ?>" aria-current="page" id="nav-<?= $pageName ?>-btn">
                                <?= $pageName ?>
                            </a>
                        </li>

                    <?php } ?>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container py-5">
        <?php
        if (isset($_GET["page"])) {
            include_once(getPageURL($page));
        }
        if (isset($_GET["product"])) {
            include_once("pages/product.php");
        }
        ?>
    </div>
    <script src="js/bootstrap.bundle.js" defer></script>
    <script src="js/global.js" defer></script>
    <?php if (getPageName($page)  === 'registration') : ?>
        <script src="js/registration.js" defer></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'login' && !isset($_SESSION['autorized'])) : ?>
        <script src="js/login.js" defer></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'control panel' && isset($_SESSION['autorized'])) : ?>
        <script src="js/control panel.js" defer></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'catalogue') : ?>
        <script src="js/catalogue.js" defer></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'cart') : ?>
        <script src="js/cart.js" defer></script>
    <?php endif; ?>
    <?php if (isset($_GET["product"])) : ?>
        <script src="js/product.js" defer></script>
    <?php endif; ?>

    <?php server_info(); ?>
    <?php include_once("$ROOT/pages/icons.php") ?>
</body>

</html>
<?php ?>