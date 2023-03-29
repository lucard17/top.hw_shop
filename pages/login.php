
<div class="row justify-content-center">
    <div class="col col-md-10 col-lg-6">
        <?php if (isset($_SESSION['autorized'])) : ?>
            <h1 class='mb-4'>Здравствуйте <?= "$_SESSION[surname] $_SESSION[name]" ?></h1>
            <form action='' method='post' id="logout-form">
                <div class='form-group'>
                    <div class="row mt-3">
                        <div class="col">
                            <button type="submit" class="btn btn-warning btn-lg w-100" name="logout" id="logout-form-submit">Logout</button>
                        </div>
                    </div>
                </div>

            </form>
        <?php else : ?><!-- if (isset($_SESSION['userName'])) -->
            <h1 class='mb-4'>Login</h1>
            <form action='' method='post' id="login-form">
                <div class='form-floating mb-3'>
                    <input type='text' class='form-control<?= l("class", [" ", ""]) ?>' name='login' id="login-form-login" placeholder="Your login" value="Admin_90">
                    <label for='login'>Login:</label>
                    <div class="invalid-feedback" id="login-form-login-feedback"><?= l("msg", ["", ""]) ?></div>
                </div>
                <div class='form-floating mb-3'>
                    <input type='password' class='form-control<?= p("class", [" ", ""]) ?>' name='password' id="login-form-password" placeholder="Your password" value="Admin_90">
                    <label for='pass'>Password:</label>
                    <div class="invalid-feedback" id="login-form-password-feedback"><?= p("msg", [" ", ""]) ?></div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <button type="submit" class="btn btn-success btn-lg w-100" name="submit" id="login-form-submit">Login</button>
                    </div>
                    <div class="col">
                        <button type="button" class="btn btn-outline-warning btn-lg w-100" id="login-form-clear">Clear form</button>
                    </div>
                </div>
            </form>
        <?php endif; ?><!-- if (isset($_SESSION['userName'])) -->
    </div>
</div>

<?php
function l($type = "class|msg", $additional_strings = ["", ""])
{
    global $login_status;
    if ($type === "class" && $login_status === LOGIN_NOT_EXIST) echo $additional_strings[0] . IS_INVALID_MARK . $additional_strings[1];
    if ($type === "msg" && $login_status === LOGIN_NOT_EXIST) echo $additional_strings[0] . "Пользователь не зарегистрирован" . $additional_strings[1];
}

function p($type = "class|msg", $additional_strings = ["", ""])
{
    global $login_status;
    if ($type === "class" && $login_status === LOGIN_INCORRECT_PASSWORD) echo $additional_strings[0] . IS_INVALID_MARK . $additional_strings[1];
    if ($type === "msg" && $login_status === LOGIN_INCORRECT_PASSWORD) echo $additional_strings[0] . "Неправильный пароль" . $additional_strings[1];
}