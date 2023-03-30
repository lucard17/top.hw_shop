<?php $ROOT = __DIR__;
session_start();
include_once("$ROOT/functions/functions.php");
?>

<?php if (isset($_SESSION['autorized'])) $pages['control panel'] = 3; ?>
<?php if (!isset($_SESSION['autorized'])) $pages['registration'] = 0;  ?>
<?php if (!isset($_SESSION['autorized'])) $pages['login'] = 1;  ?>
<?php if (isset($_SESSION['autorized'])) $pages['logout'] = 1;
?>
<?php isset($_GET["page"]) ? $page = $_GET["page"] : $page = 0; ?>
<?php

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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
</head>

<body>
    <nav class="navbar navbar-expand-sm bg-light">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav w-100 text-end">
                    <?php $navItemsStyles = [
                        "registration" => ["ms-sm-auto"],
                        "control panel" => ["ms-sm-auto"]
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
                    function navItemStyle($prefix = "", $suffix = "")
                    {
                        global $pageName;
                        global $navItemsStyles;
                        if (isset($navItemsStyles[$pageName])) {
                            insertStyles($navItemsStyles[$pageName], $prefix, $suffix);
                        }
                    }
                    ?>
                    <?php foreach ($pages as $pageName => $pageNumber) { ?>

                        <li class="nav-item text-capitalize fw-bold <?php navItemStyle(" ") ?>">
                            <a href="<?= $pageNumber == $page ? "#" : "index.php?page=$pageNumber" ?>" class="nav-link <?= $pageNumber == $page ? ' active' : '' ?>" aria-current="page" id="nav-<?= $pageName ?>-btn">
                                <?= $pageName ?>
                            </a>
                        </li>

                    <?php } ?>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container py-5">
        <?php include_once(getPageURL($page)); ?>
    </div>

    <script src="js/bootstrap.bundle.js"></script>
    <?php if (getPageName($page)  === 'registration') : ?>
        <script src="js/global.js"></script>
        <script src="js/registration.js"></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'login' && !isset($_SESSION['autorized'])) : ?>
        <script src="js/global.js"></script>
        <script src="js/login.js"></script>
    <?php endif; ?>
    <?php if (getPageName($page)  === 'control panel' && isset($_SESSION['autorized'])) : ?>
        <script src="js/global.js"></script>
        <script src="js/control panel.js" defer></script>
    <?php endif; ?>
    <!-- <?php include_once("$ROOT/pages/server_info.php") ?> -->
    <?php include_once("$ROOT/pages/icons.php") ?>
</body>

</html>
<?php ?>