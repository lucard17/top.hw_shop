<div class="row justify-content-center">
    <div class="col col-md-10 col-lg-6">

        <h1 class="mb-4">Registration Form</h1>

        <form action="" method="post" id="reg-form" class="" novalidate>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" name="reg-login" id="reg-login" placeholder="Login" value="admin_gunter" required>
                <label for="floatingInput">Login:</label>
                <div class="is-not-free-feedback">Логин уже используется</div>
                <div class="invalid-feedback" id="reg-login-feedback">Please enter an Email.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="email" class="form-control" name="reg-email" id="reg-email" placeholder="Email" value="gunter@bestmail.mail" required>
                <label for="email">Email address:</label>
                <div class="is-not-free-feedback">Email уже используется</div>
                <div class="invalid-feedback" id="reg-email-feedback">Please enter an Email.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" name="reg-name" id="reg-name" placeholder="Your name" value="Гюнтер" required>
                <label for="name">Name:</label>
                <div class="invalid-feedback" id="reg-name-feedback">Please enter your Name.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" name="reg-surname" id="reg-surname" placeholder="Your sunname" value="о'Дим" required>
                <label for="surname">Surname:</label>
                <div class="invalid-feedback" id="reg-surname-feedback">Please enter your Surname.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" name="reg-country" id="reg-country" placeholder="Your country" value="Темерия" required>
                <label for="country">Coutry:</label>
                <div class="invalid-feedback" id="reg-country-feedback">Please enter your Coutry.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" name="reg-city" id="reg-city" placeholder="Your city" value="Велен" required>
                <label for="city">City:</label>
                <div class="invalid-feedback" id="reg-city-feedback">Please enter your City.</div>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" name="reg-password" id="reg-password" placeholder="Enter your password" value="AAaa!!11" required>
                <label for="pass1">Password:</label>
                <div class="invalid-feedback" id="reg-password-feedback">Please enter your password</div>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" name="reg-password-repeat" id="reg-password-repeat" placeholder="Repeat your password" value="AAaa!!11" required>
                <label for="reg-password-repeat">Confirm Password:</label>
                <div class="invalid-feedback" id="reg-password-repeat-feedback">Please repeat your password</div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <button type="submit" class="btn btn-success btn-lg w-100" name="reg-form-submit" id="reg-form-submit" disabled>Register</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-warning btn-lg w-100" id="reg-form-clear">Clear form</button>
                </div>
            </div>

        </form>
    </div>
</div>

<div class="modal" tabindex="-1" id="reg-modal">
    <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
            <div class="modal-header  border-0 mb-3">
                <h4 class="modal-title">Спасибо за регистрацию!)</h5>
                    <button type="button" class="btn-close btn-lg" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <!-- <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div> -->
            <div class="modal-footer  border-0">
                <button type="button" class="btn  btn-lg btn-outline-success flex-grow-1 mt-3" id="reg-modal-login-btn">Login</button>
            </div>
        </div>
    </div>
</div>