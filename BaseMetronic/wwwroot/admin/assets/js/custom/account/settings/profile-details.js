"use strict";

// Class definition
var KTAccountSettingsProfileDetails = function () {
    // Private variables
    var form;
    var submitButton;
    var validation;
    var selectCity;
    var selectDistrict;
    var selectWard;
    var regexFullName = /^[a-zA-ZÀ-Ỹà-ỹ\s']+$/;
    var regexCCCD = /^\d{12}$/;
    var regexPhone = /^((84|0)[3|5|7|8|9])\d{8}\b/;
    // Private functions
    var getWard = async function () {
        try {
            let districtId = selectDistrict.val() || -1;
            let res = await httpService.getAsync(`ward/api/list-by-district/${districtId}`);
            if (res.isSucceeded) {
                selectWard.empty().trigger("change");
                let wardData = res.resources;
                wardData.forEach(function (item) {
                    selectWard.append(
                        new Option(item.name, item.id, false, false)
                    );
                });
                selectWard.val(USER_PROFILE.profile.addressWard || null).trigger("change");
            }
        } catch (e) {
            console.warn(e);
        }
    }
    var getProvince = async function () {
        try {
            let res = await httpService.getAsync(`province/api/list`);
            if (res.isSucceeded) {
                selectCity.empty().trigger("change");
                let provinceData = res.resources;
                provinceData.forEach(function (item) {
                    selectCity.append(
                        new Option(item.name, item.id, false, false)
                    );
                });
                selectCity.val(USER_PROFILE.profile.addressCity || null).trigger("change");
            }

        } catch (e) {
            console.warn(e);
        }
    }
    var getDistrict = async function () {
        try {
            let provinceId = selectCity.val() || -1;
            let res = await httpService.getAsync(`district/api/list-by-province/${provinceId}`);
            if (res.isSucceeded) {
                selectDistrict.empty().trigger("change");
                let data = res.resources;
                data.forEach(function (item) {
                    selectDistrict.append(
                        new Option(item.name, item.id, false, false)
                    );
                });
                selectDistrict.val(USER_PROFILE.profile.addressDistrict || null).trigger("change");
            }
        } catch (e) {
            console.warn(e);
        }
    }


    var initValidation = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    fullName: {
                        validators: {
                            notEmpty: {
                                message: 'Họ và tên không được để trống'
                            },
                            regexp: {
                                regexp: regexFullName,
                                message: 'Họ và tên không được chứa kí tự đặc biệt'
                            },
                        }
                    },
                    phone: {
                        validators: {
                            notEmpty: {
                                message: 'Số điện thoại không được để trống'
                            },
                            regexp: {
                                regexp: regexPhone,
                                message: 'Số điện thoại phải đúng định dạng'
                            },
                        }
                    },
                    idCardNumber: {
                        validators: {
                            regexp: {
                                regexp: regexCCCD,
                                message: 'Mã căn cước công dân phải đúng định dạng'
                            },
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );
    }

    var handleForm = function () {
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            validation.validate().then(function (status) {
                if (status == 'Valid') {
                    swal.fire({
                        text: "Bạn có chắc chắn muốn cập nhật hồ sơ của bạn ?",
                        icon: "warning",
                        buttonsStyling: false,
                        showDenyButton: true,
                        confirmButtonText: "Có",
                        denyButtonText: 'Không',
                        customClass: {
                            confirmButton: "btn btn-primary",
                            denyButton: "btn btn-light-danger"
                        }
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                let model = {
                                    photo: $("#profile__photo").attr("file-path") || "",
                                    doB: $("#kt_account_profile_details_form [name=dob]").val() != "" ? moment($("#kt_account_profile_details_form [name=dob]").val(), "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : undefined,
                                    fullName: $("#kt_account_profile_details_form [name=fullName]").val() || "",
                                    phone: $("#kt_account_profile_details_form [name=phone]").val() || "",
                                    idCardNumber: $("#kt_account_profile_details_form [name=idCardNumber]").val() || "",
                                    addressCity: $("#kt_account_profile_details_form [name=addressCity]").val(),
                                    addressDistrict: $("#kt_account_profile_details_form [name=addressDistrict]").val(),
                                    addressWard: $("#kt_account_profile_details_form [name=addressWard]").val(),
                                    addressDetail: $("#kt_account_profile_details_form [name=addressDetail]").val() || "",
                                }
                                let res = await httpService.putAsync("account/api/user-update-profile", model);
                                if (res.isSucceeded) {
                                    swal.fire({
                                        text: "Hố sơ của bạn đã được cập nhật thành công!",
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
                                    let contentError = '<p>Đã có lỗi xảy ra khi cập nhật hồ sơ, xin vui lòng thử lại sau!</p><ul>';
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
                                    text: "Đã có lỗi xảy ra khi cập nhật hồ sơ, xin vui lòng thử lại sau!",
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
                        text: "Xin lỗi, có vẻ như đã phát hiện một số lỗi về hồ sơ của bạn, vui lòng thử lại.",
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn fw-bold btn-light-primary"
                        }
                    });
                }
            });
        });
    }

    // Public methods
    return {
        init: function () {
            document.querySelectorAll(".datepicker").forEach(function (item) {
                new tempusDominus.TempusDominus(item, datePickerOption);
            })
            form = document.getElementById('kt_account_profile_details_form');

            if (!form) {
                return;
            }

            submitButton = form.querySelector('#kt_account_profile_details_submit');
            selectCity = $(form).find("[name=addressCity]");
            selectDistrict = $(form).find("[name=addressDistrict]");
            selectWard = $(form).find("[name=addressWard]");

            getProvince();
            selectCity.on("change", async function (e) {
                await getDistrict();
            })

            selectDistrict.on("change", async function (e) {
                await getWard();
            })

            $("#profile__photo").on("change", function (e) {
                let filePath = $(this).attr("file-path");
                let parent = $(this).parent();
                if (filePath && filePath.trim().length > 0) {
                    parent.removeClass("image-input-empty");
                }
                else {
                    parent.addClass("image-input-empty");
                }
            })
            $(form).find("[type=reset]").on("click", function (e) {
                e.preventDefault();
                USER_PROFILE.reloadProfile();
                validation.resetForm();
            })
            initValidation();
            handleForm();
        }
    }
}();

