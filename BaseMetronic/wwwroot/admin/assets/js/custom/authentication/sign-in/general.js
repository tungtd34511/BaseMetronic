"use strict";

// Class definition
var KTSigninGeneral = function() {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleValidation = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
			form,
			{
				fields: {					
					'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Địa chỉ email không đúng định dạng',
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
                            }
                        }
                    } 
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
				}
			}
		);	
    }

    var handleSubmitAjax = function(e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(async function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;
                    
                    try {
                        let data = {
                            email: form.querySelector('[name="email"]').value,
                            password: form.querySelector('[name="password"]').value
                        };
                        let res = await httpService.postAsync("account/api/sign-in", data);
                        if (res.isSucceeded) {
                            var accountName = res.resources.accountFullName;
                            Swal.fire({
                                title: '<h3 class="text-primary">🎉 Chào mừng!</h3>',
                                html: `
                <div class="alert alert-success">
                    Xin chào <strong>${accountName}</strong>! Bạn đã đăng nhập thành công.
                </div>
                <p class="text-muted" style="font-size: 14px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>`,
                                icon: 'success',
                                confirmButtonText: '<span class="text-white">Bắt đầu ngay</span>',
                                customClass: {
                                    popup: 'border-0 shadow',            // Sử dụng Bootstrap class cho viền và bóng
                                    confirmButton: 'btn btn-primary',    // Nút "Bắt đầu ngay" dùng class Bootstrap
                                    title: 'text-primary',               // Tiêu đề với màu xanh Bootstrap
                                    htmlContainer: 'text-muted',         // Nội dung có màu xám nhẹ
                                    icon: 'text-success'                 // Màu biểu tượng thành công
                                },
                            }).then(() => {
                                localStorage.setItem("Authorization", res.resources.token)
                                document.cookie = `Authorization=${res.resources.token};path=/;`;

                                const currentUrl = (new URL(location.href)).searchParams.get("returnurl");
                                if (currentUrl && currentUrl.length>0) {
                                    location.href = currentUrl;
                                    return;
                                }
                                const redirectUrl = form.getAttribute('data-kt-redirect-url');
                                if (redirectUrl) {
                                    location.href = redirectUrl;
                                }
                            });
                           
                        }
                        else {
                            // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            Swal.fire({
                                text: "Xin lỗi, email hoặc mật khẩu không đúng, vui lòng thử lại.",
                                icon: "error",
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }

                    } catch (e) {
                        console.warn(e);
                        Swal.fire({
                            text: "Xin lỗi, có vẻ như đã phát hiện một số lỗi, vui lòng thử lại.",
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
                        text: "Xin lỗi, có vẻ như đã phát hiện một số lỗi, vui lòng thử lại.",
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
		});
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');
            
            handleValidation();
            handleSubmitAjax(); // use for ajax submit
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSigninGeneral.init();
});
