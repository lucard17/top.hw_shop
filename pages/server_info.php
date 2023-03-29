<?php ?>
<?= "<hr>" ?>
<?= "\$_SERVER[DOCUMENT_ROOT]: " . $_SERVER['DOCUMENT_ROOT']  ?>
<?= "<hr>" ?>
<?= "GET info:<br>" ?>
<?php foreach ($_GET as $key => $value) {
    echo "\$_GET ($key) : $value <br>";
} ?>
<?= "<hr>" ?>
<?= "POST info:<br>" ?>
<?php foreach ($_POST as $key => $value) {
    echo "\$_POST ($key) : $value <br>";
} ?>
<?= "<hr>" ?>
<?= "SESSION info:<br>" ?>
<?= "session_id():" . session_id()  ?>
<?php foreach ($_SESSION as $key => $value) {
    echo "\$_SESSION ($key) : $value <br>";
} ?>
<?= "<hr>" ?>

<?php
// foreach ($_SERVER as $key => $value) {
//     echo "\$_SERVER[$key]: $value <br>";
// }
?> 