"use strict";

// Class definition
var KTAccountSettingsSigninMethods = function () {
    var signInForm;
    var signInMainEl;
    var signInEditEl;
    var passwordMainEl;
    var passwordEditEl;
    var signInChangeEmail;
    var signInCancelEmail;
    var passwordChange;
    var passwordCancel;
    var changePasswordValidator;
    var changeEmailValidator;
    var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    var toggleChangeEmail = function () {
        signInMainEl.classList.toggle('d-none');
        signInChangeEmail.classList.toggle('d-none');
        signInEditEl.classList.toggle('d-none');
    }

    var toggleChangePassword = function () {
        passwordMainEl.classList.toggle('d-none');
        passwordChange.classList.toggle('d-none');
        passwordEditEl.classList.toggle('d-none');
    }

    // Private functions
    var initSettings = function () {
        if (!signInMainEl) {
            return;
        }

        // toggle UI
        signInChangeEmail.querySelector('button').addEventListener('click', function () {
            changeEmailValidator.resetForm(true);
            toggleChangeEmail();
        });

        signInCancelEmail.addEventListener('click', function () {
            toggleChangeEmail();
        });

        passwordChange.querySelector('button').addEventListener('click', function () {
            changePasswordValidator.resetForm(true);
            toggleChangePassword();
        });

        passwordCancel.addEventListener('click', function () {
            toggleChangePassword();
        });
    }

    var handleChangeEmail = function (e) {

        if (!signInForm) {
            return;
        }

        changeEmailValidator = FormValidation.formValidation(

            signInForm,
            {
                fields: {
                    emailaddress: {
                        validators: {
                            notEmpty: {
                                message: 'Địa chỉ e-mail không được để trống'
                            },
                            emailAddress: {
                                message: 'Địa chỉ e-mail không đúng định dạng'
                            }
                        }
                    },

                    confirmemailpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu xác thực không được để trống'
                            },
                            regexp: {
                                regexp: regexPassword,
                                message: 'Mật khẩu không đúng định dạng'
                            }
                        }
                    }
                },

                plugins: { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );


        signInForm.querySelector('#kt_signin_submit').addEventListener('click', function (e) {
            e.preventDefault();
            changeEmailValidator.validate().then( function (status) {
                if (status == 'Valid') {
                    swal.fire({
                        text: "Bạn có chắc chắn muốn cập nhật địa chỉ e-mail của bạn ?",
                        icon: "warning",
                        buttonsStyling: false,
                        showDenyButton: true,
                        confirmButtonText: "Có",
                        denyButtonText: 'Không',
                        customClass: {
                            confirmButton: "btn btn-primary",
                            denyButton: "btn btn-light-danger"
                        }
                    }).then(async  (result) => {
                        if (result.isConfirmed) {
                            try {
                                let model = {
                                    emailAddress: $("#kt_signin_change_email [name=emailaddress]").val() || "",
                                    confirmEmailPassword: $("#kt_signin_change_email [name=confirmemailpassword]").val() || ""
                                }
                                let res = await httpService.putAsync("account/api/change-email", model);
                                if (res.isSucceeded) {
                                    swal.fire({
                                        text: "Địa chỉ e-mail đã được cập nhật thành công!",
                                        title: "Quản lý hệ thống",
                                        icon: "success",
                                        buttonsStyling: false,
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light-primary"
                                        }
                                    }).then(function () {
                                        window.location.reload();
                                    });
                                }
                                else {
                                    let contentError = '<p>Đã có lỗi xảy ra khi cập nhật địa chỉ e-mail, xin vui lòng thử lại sau!</p><ul>';
                                    res.errors.forEach(function (item, index) {
                                        contentError += "<li class='text-start'>" + item + '</li>';
                                    });
                                    contentError += '</ul>';
                                    swal.fire({
                                        icon: "error",
                                        title: "Quản lý hệ thống",
                                        html: contentError,
                                        buttonsStyling: false,
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light-primary"
                                        }
                                    });
                                }
                            } catch (e) {
                                swal.fire({
                                    text: "Đã có lỗi xảy ra khi cập nhật địa chỉ e-mail xin vui lòng thử lại sau!",
                                    icon: "error",
                                    title: "Quản lý hệ thống",
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light-primary"
                                    }
                                });
                            }
                        }
                    });
                } else {
                    swal.fire({
                        text: "Xin lỗi, có vẻ như đã phát hiện một số lỗi nhập thông tin, vui lòng thử lại.",
                        icon: "error",
                        title: "Quản lý hệ thống",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    });
                }
            });
        });
    }

    var handleChangePassword = function (e) {
        // form elements
        var passwordForm = document.getElementById('kt_signin_change_password');

        if (!passwordForm) {
            return;
        }

        changePasswordValidator = FormValidation.formValidation(
            passwordForm,
            {
                fields: {
                    currentpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu hiện tại không được để trống'
                            },
                            regexp: {
                                regexp: regexPassword,
                                message: 'Mật khẩu không đúng định dạng'
                            }
                        }
                    },

                    newpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu mới không được để trống'
                            },
                            regexp: {
                                regexp: regexPassword,
                                message: 'Mật khẩu không đúng định dạng!'
                            }
                        },
                    },

                    confirmpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu xác nhận không được để trống'
                            },
                            regexp: {
                                regexp: regexPassword,
                                message: 'Mật khẩu không đúng định dạng!'
                            },
                            identical: {
                                compare: function () {
                                    return passwordForm.querySelector('[name="newpassword"]').value;
                                },
                                message: 'Mật khẩu mới và mật khẩu xác nhận phải giống nhau'
                            }
                        }
                    },
                },

                plugins: { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        passwordForm.querySelector('#kt_password_submit').addEventListener('click', function (e) {
            e.preventDefault();
            changePasswordValidator.validate().then(function (status) {
                if (status == 'Valid') {
                    swal.fire({
                        text: "Bạn có chắc chắn muốn cập nhật mật khẩu của bạn ?",
                        icon: "warning",
                        buttonsStyling: false,
                        showDenyButton: true,
                        confirmButtonText: "Có",
                        denyButtonText: 'Không',
                        customClass: {
                            confirmButton: "btn btn-primary",
                            denyButton: "btn btn-light-danger"
                        }
                    }).then(async  (result) => {
                        if (result.isConfirmed) {
                            try {
                                let model = {
                                    currentPassword: $("#kt_signin_change_password [name=currentpassword]").val() || "",
                                    newPassword: $("#kt_signin_change_password [name=newpassword]").val() || "",
                                    confirmPassword: $("#kt_signin_change_password [name=confirmpassword]").val() || ""
                                }
                                let res = await httpService.putAsync("account/api/change-password", model);
                                if (res.isSucceeded) {
                                    swal.fire({
                                        text: "Mật khẩu đã được cập nhật thành công!",
                                        title: "Quản lý hệ thống",
                                        icon: "success",
                                        buttonsStyling: false,
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light-primary"
                                        }
                                    }).then(function () {
                                        passwordForm.reset();
                                        changePasswordValidator.resetForm(true); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
                                        toggleChangePassword();
                                    });
                                }
                                else {
                                    let contentError = '<p>Đã có lỗi xảy ra khi cập nhật mật khẩu, xin vui lòng thử lại sau!</p><ul>';
                                    res.errors.forEach(function (item, index) {
                                        contentError += "<li class='text-start'>" + item + '</li>';
                                    });
                                    contentError += '</ul>';
                                    swal.fire({
                                        icon: "error",
                                        title: "Quản lý hệ thống",
                                        html: contentError,
                                        buttonsStyling: false,
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light-primary"
                                        }
                                    });
                                }
                            } catch (e) {
                                swal.fire({
                                    text: "Đã có lỗi xảy ra khi cập nhật mật khẩu, xin vui lòng thử lại sau!",
                                    icon: "error",
                                    title: "Quản lý hệ thống",
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light-primary"
                                    }
                                });
                            }
                        }
                    });    
                } else {
                    swal.fire({
                        text: "Xin lỗi, có vẻ như đã phát hiện một số lỗi về mật khẩu, vui lòng thử lại.",
                        icon: "error",
                        title: "Quản lý hệ thống",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    });
                }
            });
        });
    }

    // Public methods
    return {
        init: function () {
            signInForm = document.getElementById('kt_signin_change_email');
            signInMainEl = document.getElementById('kt_signin_email');
            signInEditEl = document.getElementById('kt_signin_email_edit');
            passwordMainEl = document.getElementById('kt_signin_password');
            passwordEditEl = document.getElementById('kt_signin_password_edit');
            signInChangeEmail = document.getElementById('kt_signin_email_button');
            signInCancelEmail = document.getElementById('kt_signin_cancel');
            passwordChange = document.getElementById('kt_signin_password_button');
            passwordCancel = document.getElementById('kt_password_cancel');

            initSettings();
            handleChangeEmail();
            handleChangePassword();
        }
    }
}();

// On document ready
$(document).ready(function (e) {
    KTAccountSettingsSigninMethods.init();
})
