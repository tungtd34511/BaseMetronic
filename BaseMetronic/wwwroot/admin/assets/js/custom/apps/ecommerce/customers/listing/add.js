"use strict";

// Class definition
var KTModalCustomersAdd = function () {
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var form;
    var modal;
    var customerCategoryData = [];
    var customerCategorySelect;
    // Init form inputs
    var loadDataSelectCustomerCategory = async function () {
        try {
            let res = await httpService.getAsync("customercategory/api/list");
            customerCategoryData = res.resources;
        } catch (e) {
            console.warn(e);
            customerCategoryData = [];
        }
    }
    var handleForm = async function () {
        customerCategorySelect = $(form.querySelector("[name=customerCategoryId]"))
        await loadDataSelectCustomerCategory();
        customerCategoryData.forEach(function (item) {
            $(customerCategorySelect).append(new Option(item.name, item.id, false, false));
        })
        $(customerCategorySelect).val(null).trigger("change");
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'fullName': {
                        validators: {
                            notEmpty: {
                                message: 'Tên khách hàng không được để trống'
                            }
                        }
                    },
                    'phone': {
                        validators: {
                            notEmpty: {
                                message: 'Số điện thoại không được để trống'
                            },
                            regexp: {
                                regexp: regexPhone,
                                message: 'Số điện thoại không đúng định dạng'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );
        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    if (status == 'Valid') {
                        let fullname = $(form.querySelector("[name=fullName]")).val();
                        let phone = $(form.querySelector("[name=phone]")).val();
                        var gender = $(form.querySelector("[name=gender]")).val();
                        var customerCategoryId = $(form.querySelector("[name=customerCategoryId]")).val();
                        var description = $(form.querySelector("[name=Description]")).val();

                        Swal.fire({
                            title: 'Thêm khách hàng mới?',
                            text: "Thêm khách hàng " + fullname,
                            icon: 'info',
                            showCancelButton: true,
                            customClass: {
                                confirmButton: "btn btn-primary",
                                cancelButton: "btn btn-active-light",
                            },
                            confirmButtonText: 'Xác nhận',
                            cancelButtonText: 'Huỷ'
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                try {
                                    submitButton.setAttribute('data-kt-indicator', 'on');
                                    // Disable submit button whilst loading
                                    submitButton.disabled = true;
                                    let updatingObj = {
                                        "customerCategoryId": customerCategoryId,
                                        "fullName": fullname,
                                        "phone": phone,
                                        "description": description,
                                        "gender": gender
                                    };
                                    let res = await httpService.postAsync("customer/api/add2", updatingObj);
                                    if (res.isSucceeded) {
                                        Swal.fire({
                                            text: "Khách hàng đã được thêm mới thành công!",
                                            icon: "success",
                                            buttonsStyling: false,
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            // Reset Data
                                            form.reset();
                                            validator.resetForm(true);
                                            // Bỏ disable địa chỉ giao hàng
                                            ORDER.removeDisabledShip();

                                            let customer = {
                                                id: res.resources.id,
                                                fullName: res.resources.fullName,
                                                phone: res.resources.phone,
                                            }

                                            ORDER.customerSelect.select2("trigger", "select", {
                                                data: customer
                                            });
                                            // Hide modal
                                            modal.hide();
                                        });
                                        
                                    }
                                    else {
                                        let contentError = '<p>Đã có lỗi xảy ra khi thêm mới khách hàng, xin vui lòng thử lại sau!</p><ul>';
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
                                        text: "Đã có lỗi xảy ra khi thêm mới khách hàng, xin vui lòng thử lại sau!",
                                        icon: "error",
                                        title: "Quản lý hệ thống",
                                        buttonsStyling: false,
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light-primary"
                                        }
                                    });
                                    console.warn(e);
                                }
                                finally {
                                    submitButton.removeAttribute('data-kt-indicator');
                                    // Enable submit button after loading
                                    submitButton.disabled = false;
                                }
                            }
                        })
                    } else {
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
            }
        });

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "Bạn có chắc chắn muốn hủy không?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form
                    validator.resetForm(true)
                    modal.hide(); // Hide modal		
                }
            });
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "Bạn có chắc chắn muốn hủy không?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form
                    validator.resetForm(true)
                    modal.hide(); // Hide modal					
                }
            });
        })
    }

    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_add_customer'));

            form = document.querySelector('#kt_modal_add_customer_form');
            submitButton = form.querySelector('#kt_modal_add_customer_submit');
            cancelButton = form.querySelector('#kt_modal_add_customer_cancel');
            closeButton = form.querySelector('#kt_modal_add_customer_close');
            $("#kt_modal_add_customer").on("show.bs.modal", function () {
                $(form.querySelector("[name=gender]")).val("Nam").trigger("change");
                $(form.querySelector("[name=customerCategoryId]")).val("1005").trigger("change");
            })
            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalCustomersAdd.init();
});