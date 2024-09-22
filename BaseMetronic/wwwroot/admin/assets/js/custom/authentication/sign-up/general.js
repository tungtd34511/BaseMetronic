"use strict";

// Class definition
var KTSignupGeneral = function() {
    // Elements
    var form;
    var submitButton;
    var validator;
    var passwordMeter;

    // Handle form
    var handleForm  = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
			form,
			{
				fields: {
					'firstName': {
						validators: {
							notEmpty: {
								message: 'Họ không được để trống'
							}
						}
                    },
                    'lastName': {
						validators: {
							notEmpty: {
								message: 'Tên không được để trống'
							}
						}
					},
					'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Địa chỉ email không chính xác',
                            },
							notEmpty: {
								message: 'Địa chỉ email không được để trống'
							}
						}
					},
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu không được để trống'
                            },
                            callback: {
                                message: 'Vui lòng nhập mật khẩu đúng định dạng',
                                callback: function(input) {
                                    if (input.value.length > 0) {
                                        return validatePassword();
                                    }
                                }
                            }
                        }
                    },
                    'confirmPassword': {
                        validators: {
                            notEmpty: {
                                message: 'Mật khẩu xác nhận không được để trống'
                            },
                            identical: {
                                compare: function() {
                                    return form.querySelector('[name="password"]').value;
                                },
                                message: 'Mật khẩu và mật khẩu xác nhận không giống nhau'
                            }
                        }
                    },
                    'toc': {
                        validators: {
                            notEmpty: {
                                message: 'Bạn phải đồng ý với chính xác và điều khoản'
                            }
                        }
                    }
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger({
                        event: {
                            password: false
                        }  
                    }),
					bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
				}
			}
		);

        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            validator.revalidateField('password');

            validator.validate().then(async function(status) {
		        if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;

                    // Simulate ajax request
                    try {
                        let data = {
                            firstName: $(form).find("[name=firstName]").val().trim(),
                            middleName: $(form).find("[name=middleName]").val().trim(),
                            lastName: $(form).find("[name=lastName]").val().trim(),
                            email: $(form).find("[name=email]").val(),
                            password: $(form).find("[name=password]").val(),
                            confirmPassword: $(form).find("[name=confirmPassword]").val(),
                            toc: $(form).find("[name=toc]").is(":checked")
                        }
                        let res = await httpService.postAsync("account/api/sign-up", data);
                        if (res.isSucceeded) {
                            // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            Swal.fire({
                                text: "Tài khoản của bạn đã được đăng ký thành công, vui lòng tiếp tục đăng nhập!",
                                icon: "success",
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    var redirectUrl = form.getAttribute('data-kt-redirect-url');
                                    if (redirectUrl) {
                                        location.href = redirectUrl;
                                    }
                                }
                            });
                        }
                        else {
                            var errors = res.errors || [];
                            let html = "";
                            if (errors.length > 0) {
                                html = `
                                        <ul class="list-group">
                                            ${errors.map(error => `<li class="list-group-item list-group-item-danger">${error}</li>`).join('')}
                                        </ul>
                                    `;
                            }
                            // Hiển thị thông báo SweetAlert với Bootstrap styling
                            Swal.fire({
                                title: '<h4 class="text-danger">Đã có lỗi xảy ra khi thực hiện đăng ký tài khoản!</h4>',
                                icon: 'error',
                                html: html,
                                customClass: {
                                    confirmButton: 'btn btn-danger'
                                }
                            });
                        }
                    } catch (e) {
                        console.warn(e);
                        Swal.fire({
                            text: "Rất tiếc, đã có lỗi xảy ra khi thực hiện đăng ký tài khoản. Xin vui lòng thử lại sau!",
                            icon: "error",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                    finally {
                        // Hide loading indication
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;
                    }					
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Rất tiếc, có vẻ như đã phát hiện ra một số lỗi, vui lòng thử lại.",
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
		    });
        });

        // Handle password input
        form.querySelector('input[name="password"]').addEventListener('input', function() {
            if (this.value.length > 0) {
                validator.updateFieldStatus('password', 'NotValidated');
            }
        });
    }

    // Password input validation
    var validatePassword = function() {
        return (passwordMeter.getScore() === 100);
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            // Elements
            form = document.querySelector('#kt_sign_up_form');
            submitButton = document.querySelector('#kt_sign_up_submit');
            passwordMeter = KTPasswordMeter.getInstance(form.querySelector('[data-field="password"]'));

            handleForm ();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSignupGeneral.init();
});
