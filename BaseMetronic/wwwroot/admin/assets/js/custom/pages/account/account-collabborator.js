﻿"use strict";
var onChangePassword = false;
var dataSource = [];
var updatingItemId = 0;
var editObj;
var tableUpdating = 0;
var table;
let regexPhone = /^((84|0)[3|5|7|8|9])\d{8}\b/;
let regexUserName = /^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/;
let regexFullName = /^[a-zA-ZÀ-Ỹà-ỹ\s']+$/;
let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const submitButton = document.getElementById('btnUpdateItem');
const enableBtnSubmit = () => {
    submitButton.setAttribute('data-kt-indicator', 'off');
    submitButton.disabled = false;
};
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return '';
}
function getListWard() {
    return new Promise(function (resolve, reject) {
        let districtId = $('#account-addressDistrictt').val() || 0;
        $.ajax({
            url: systemURL + `ward/api/list-by-district/${districtId}`,
            type: 'GET',
            async: true,
            contentType: 'application/json',
            success: function (responseData) {
                // debugger;
                if (responseData.status == 200 && responseData.message === 'SUCCESS') {
                    let wardData = responseData.data;
                    $('#account-addressWard').empty();
                    wardData.forEach(function (item) {
                        $('#account-addressWard').append(
                            new Option(item.name, item.id, false, false)
                        );
                    });
                    resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
                } else {
                    reject('Không thể lấy dữ liệu phường/xã.'); // Từ chối promise nếu có lỗi
                }
            },
            error: function (e) {
                reject('Lỗi khi gọi API lấy dữ liệu phường/xã.'); // Từ chối promise nếu có lỗi
            },
        });
    });
}
function getListDistrict() {
    return new Promise(function (resolve, reject) {
        let provinceId = $('#account-addressCity').val() || 0;
        $.ajax({
            url: systemURL + `district/api/list-by-province/${provinceId}`,
            type: 'GET',
            async: true,
            contentType: 'application/json',
            success: function (responseData) {
                // debugger;
                if (responseData.status == 200 && responseData.message === 'SUCCESS') {
                    let districtData = responseData.data;
                    $('#account-addressDistrictt').empty();
                    districtData.forEach(function (item, index) {
                        if (index == districtData.length - 1) {
                            $('#account-addressDistrictt')
                                .append(new Option(item.name, item.id, false, false));
                        } else {
                            $('#account-addressDistrictt').append(
                                new Option(item.name, item.id, false, false)
                            );
                        }
                    });
                    resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
                } else {
                    reject('Không thể lấy dữ liệu quận/huyện.'); // Từ chối promise nếu có lỗi
                }
            },
            error: function (e) {
                reject('Lỗi khi gọi API lấy dữ liệu quận/huyện.'); // Từ chối promise nếu có lỗi
            },
        });
    });
}
function getProvince() {
    $('#account-addressDistrictt').empty();
    var provinceData = [];
    $.ajax({
        url: systemURL + 'province/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            // debugger;
            var data = responseData.data;
            provinceData = data;
            provinceData.forEach(function (item) {
                $('#account-addressCity').append(
                    new Option(item.name, item.id, false, false)
                );
            });
        },
        error: function (e) {
            //console.log(e.message);
        },
    });
}

submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    submitButton.setAttribute('data-kt-indicator', 'on');
    // Disable button to avoid multiple click
    submitButton.disabled = true;
    // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
    updateItem(updatingItemId);
});
$('#search-input').on('input', function () {
    table.search($(this).val()).draw();
});
$(document).ready(function () {
    loadData();
    getProvince();
    //getListDistrict();
    //getListWard();
    $('#account-addressCity').change(() => {
        getListDistrict();
    });
    $('#account-addressDistrictt').change(() => {
        getListWard();
    });

    //getListDistrict();
    // Datetime picker
    document.querySelectorAll('.datepicker').forEach(function (item) {
        new tempusDominus.TempusDominus(item, datePickerOption);
    });
    $('.datepicker').on('dp.change', function (e) {
        // console.log(this.value);
        this.value = moment(this.value).format('YYYY-MM-DD HH:mm:ss');
        // console.log(this.value);
    });
    //Flat pickr format
    $('#filterCreatedTime_input').flatpickr({
        dateFormat: 'd/m/Y',
        mode: 'range',
    });
    $('#open-flatpickr').click(function () {
        $('#filterCreatedTime_input').click();
    });
    $('#clear-flatpickr').click(function () {
        $('#filterCreatedTime_input').val('');
    });

    $('#filterDoB_input').flatpickr({
        dateFormat: 'd/m/Y',
        mode: 'range',
    });
    $('#account-doB').flatpickr({
        dateFormat: 'd/m/Y',
    });
    $('#open-flatpickr-DoB').click(function () {
        $('#filterDoB_input').click();
    });
    $('#clear-flatpickr-DoB').click(function () {
        $('#filterDoB_input').val('');
    });

    $('#filterLockoutEndDate_input').flatpickr({
        dateFormat: 'd/m/Y',
        mode: 'range',
    });
    $('#open-flatpickr-LockoutEndDate').click(function () {
        $('#filterLockoutEndDate_input').click();
    });
    $('#clear-flatpickr-LockoutEndDate').click(function () {
        $('#filterLockoutEndDate_input').val('');
    });

    $('.dataSelect').select2();

    $('#btnTableSearch').click(function () {
        tableSearch();
    });

    $('#tableData thead:nth-child(2) tr th input').keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            $('#btnTableSearch').click();
        }
    });
    $('#btnTableResetSearch').click(function () {
        $('.tableheaderFillter').val('').trigger('change');
        tableSearch();
    });
    $('#reset_Password').click(() => {
        $('#account-password').prop('disabled', false);
        onChangePassword = true;
    });

    //action duyệt
    $("#tableData tbody").on("click", ".checkIsApproved", function () {
        quickApproved($(this).is(":checked"), $(this).attr("data-id"));
    })

    $('#modal-id').on('show.bs.modal', function (event) {
        $(this).find('.nav a:first').tab('show');
    })
});
function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}
function loadData() {
    initTable();
}
function initTable() {
    table = $('#tableData').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [4, 'desc'],
        oLanguage: {
            sUrl: '/js/Vietnamese.json',
        },
        ajax: {
            url: systemURL + 'account/api/list-server-side',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: function (d) {
                d.searchAll = $('#search-input').val();
                d.accountStatusIds = $('#filterAccountStatusId').val();
                d.accountTypeIds = $('#filterAccountTypeId').val();
                d.roleIds = [role_collabborator];
                return JSON.stringify(d);
            },
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    var stt = meta.row + 1 + info.page * info.length;
                    return stt; // This contains the row index
                },
            },
            {
                data: 'fullName',
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + '<span>';
                },
            },

            {
                data: 'username',
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + '<span>';
                },
            },
            {
                data: 'phone',
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data.toPhoneNumber() + '<span>';
                },
            },

            {
                data: 'createdTime',
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = moment(data).format('DD/MM/YYYY HH:mm:ss');
                    return displayValue;
                },
            },
            {
                data: 'accountStatusId',
                render: function (data, type, row, meta) {
                    //return `<span id="row${row.id
                    //    }-column-id" class="badge py-3 px-4" style="color:${row.accountStatusColor
                    //    }; background-color:${customBagdeColor(
                    //        row.accountStatusColor
                    //    )}; font-size: 13px">${row.accountStatusName}<span></span></span>`;

                    return `<span id='row` + row.id + `-column-accountStatusName'><div class="form-check form-switch form-check-custom form-check-solid justify-content-center"><input class="form-check-input checkIsApproved" data-id="${row.id}" type="checkbox" value="" ${data == account_status_activate ? 'checked=""' : ''} id="kt_flexSwitchCustomDefault_1_1"></div></span>`

                        ;
                },
            },
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    return (
                        "<div class='d-flex justify-content-center gap-2'>" +
                        "<a type='button' title='Cập nhật' onclick='editItem(" +
                        row.id +
                        ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-primary svg-icon  svg-icon-1'> <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.3' fill-rule='evenodd' clip-rule='evenodd' d='M2 4.63158C2 3.1782 3.1782 2 4.63158 2H13.47C14.0155 2 14.278 2.66919 13.8778 3.04006L12.4556 4.35821C11.9009 4.87228 11.1726 5.15789 10.4163 5.15789H7.1579C6.05333 5.15789 5.15789 6.05333 5.15789 7.1579V16.8421C5.15789 17.9467 6.05333 18.8421 7.1579 18.8421H16.8421C17.9467 18.8421 18.8421 17.9467 18.8421 16.8421V13.7518C18.8421 12.927 19.1817 12.1387 19.7809 11.572L20.9878 10.4308C21.3703 10.0691 22 10.3403 22 10.8668V19.3684C22 20.8218 20.8218 22 19.3684 22H4.63158C3.1782 22 2 20.8218 2 19.3684V4.63158Z' fill='currentColor'></path><path d='M10.9256 11.1882C10.5351 10.7977 10.5351 10.1645 10.9256 9.77397L18.0669 2.6327C18.8479 1.85165 20.1143 1.85165 20.8953 2.6327L21.3665 3.10391C22.1476 3.88496 22.1476 5.15129 21.3665 5.93234L14.2252 13.0736C13.8347 13.4641 13.2016 13.4641 12.811 13.0736L10.9256 11.1882Z' fill='currentColor'></path><path d='M8.82343 12.0064L8.08852 14.3348C7.8655 15.0414 8.46151 15.7366 9.19388 15.6242L11.8974 15.2092C12.4642 15.1222 12.6916 14.4278 12.2861 14.0223L9.98595 11.7221C9.61452 11.3507 8.98154 11.5055 8.82343 12.0064Z' fill='currentColor'></path></svg></span></span></a>" +
                        "<a type='button' title='Cập nhật' onclick='deleteItem(" +
                        row.id +
                        ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-danger svg-icon  svg-icon-1'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z' fill='currentColor'></path><path opacity='0.5' d='M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z' fill='currentColor'></path><path opacity='0.5' d='M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z' fill='currentColor'></path></svg></span></a>"
                    );
                },
            },
        ],
        columnDefs: [
            { targets: 'no-sort', orderable: false },
            { targets: 'no-search', searchable: false },
            { orderable: false, targets: [-1, 0] },
        ],
        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100],
        ],
        drawCallback: function () {
            $('#tableData tfoot').html('');
            $('#tableData thead:nth-child(1) tr')
                .clone(true)
                .appendTo('#tableData tfoot');
            $('#tableData tfoot tr').addClass('border-top');
        },
    });
}
function validateInput(id) {
    let updatingItemId = id;
    let idStatus = $('#account-accountStatusId').val();
    let idType = $('#account-accountTypeId').val();
    let idRole = $('#account-roleId').val();
    let userName = $('#account-username').val();
    let password = $('#account-password').val();
    let fullName = $('#account-fullName').val();
    let phone = $('#account-phone').val();
    let email = $('#account-email').val();
    var errorList = [];
    if (idStatus == null) {
        errorList.push('Trạng thái tài khoản không được để trống.');
    }
    if (idType == null) {
        errorList.push('Loại tài khoản không được để trống.');
    }
    if (idRole == null) {
        errorList.push('Quyền không được để trống.');
    }
    if (userName == '') {
        errorList.push('Tên tài khoản không được để trống.');
    } else if (!userName.match(regexUserName)) {
        errorList.push('Tên tài khoản không được chứa kí tự đặc biệt.');
    }
    if (password == '' && id == 0) {
        errorList.push('Mật khẩu không được để trống.');
    } else if (
        (password.length < 6 && id == 0) ||
        (onChangePassword && password.length < 6)
    ) {
        errorList.push('Mật khẩu phải có ít nhất 6 kí tự.');
    }
    if (fullName == '') {
        errorList.push('Họ và tên không được để trống.');
    } else if (!fullName.match(regexFullName)) {
        errorList.push('Họ và tên không được chứa kí tự đặc biệt.');
    }
    if (fullName.length > 255) {
        errorList.push('Họ và tên có độ dài tối đa là 255 ký tự.');
    }
    if (email == '') {
        errorList.push('Email không được để trống.');
    } else if (!email.match(regexEmail)) {
        errorList.push('Email không hợp lệ.');
    }
    if (phone == '') {
        errorList.push('Số điện thoại được để trống.');
    } else if (!phone.match(regexPhone)) {
        errorList.push('Số điện thoại không hợp lệ.');
    }

    if (errorList.length > 0) {
        var contentError = '<ul>';
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + '</li>';
        });
        contentError += '</ul>';
        var swalSubTitle =
            "<p class='swal__admin__subtitle'>" +
            (updatingItemId > 0 ? 'Cập nhật' : 'Thêm mới') +
            ' không thành công</p>';

        Swal.fire('Quản lý nhân sự' + swalSubTitle, contentError, 'warning');
        enableBtnSubmit();
        return false;
    } else {
        return true;
    }
}
async function editItem(id) {
    dataUpdateMeta = []
    onChangePassword = false;
    updatingItemId = id;
    $('#modal-id').modal('show');
    $('#account-addressDistrictt').empty();
    $('#account-addressWard').empty();
    $('#account-password').val('');
    if (id > 0) {
        editObj = await getItemById(id);
        $('#reset_Password').removeClass('d-none');
        $('#account-password').prop('disabled', true);
        //$("#account-password").attr('type', 'password')
        $('#account-accountTypeId')
            .val(id > 0 ? editObj.accountTypeId : '')
            .trigger('change');
        $('#modal-title-edit').html('Cập nhật tài khoản');
    } else if (id == 0) {
        $('#modal-title-edit').html('Tạo mới tài khoản');
        $('#account-accountTypeId').val(1002).trigger('change');
        $('#account-addressDistrictt').empty();
        $('#account-password').prop('disabled', false);
        //$("#account-password").attr('type', 'text')
        $('#account-addressWard').empty();
        $('#reset_Password').addClass('d-none');
    }
    $('#defaultModalTitle').text(
        id > 0 ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'
    );
    $('#account-id').val(id > 0 ? editObj.id : '0');
    $('#account-accountStatusId')
        .val(id > 0 ? editObj.accountStatusId : '')
        .trigger('change');
    $('#account-username').val(id > 0 ? editObj.username : '');
    //$("#account-password").val(id > 0 ? editObj.password : "");
    $('#account-fullName').val(id > 0 ? editObj.fullName : '');
    $('#account-firstName').val(id > 0 ? editObj.firstName : '');
    $('#account-middleName').val(id > 0 ? editObj.middleName : '');
    $('#account-lastName').val(id > 0 ? editObj.lastName : '');
    $('#account-photo').val(id > 0 ? editObj.photo : '');
    $('#account-description').val(id > 0 ? editObj.description : '');
    $('#account-info').val(id > 0 ? editObj.info : '');
    $('#account-idCardNumber').val(id > 0 ? editObj.idCardNumber : '');
    $('#account-googleId').val(id > 0 ? editObj.googleId : '');
    $('#account-facebookId').val(id > 0 ? editObj.facebookId : '');
    $('#account-idCardNumberPhoto1').val(
        id > 0 ? editObj.idCardNumberPhoto1 : ''
    );
    $('#account-idCardNumberPhoto2').val(
        id > 0 ? editObj.idCardNumberPhoto2 : ''
    );
    $('#account-doB').val(
        id > 0
            ? moment(editObj.doB).format('DD/MM/YYYY')
            : moment(new Date()).format('DD/MM/YYYY')
    );
    $('#account-zipCode').val(id > 0 ? editObj.zipCode : '');
    $('#account-addressCity')
        .val(id > 0 ? editObj.addressCity : '')
        .trigger('change');
    if (id > 0 && editObj.addressDistrict) {
        $('#account-addressDistrictt').empty();
        $.when(getListDistrict()).done(async function () {
            $('#account-addressDistrictt').val(editObj.addressDistrict).trigger('change');
            $('#account-addressWard').empty();
            $.when(getListWard()).done(async function () {
                $('#account-addressWard').val(editObj.addressWard ? editObj.addressWard : '').trigger('change');
            });
        });
    }
    if (id == 0) {
        $('#account-addressDistrictt').val('').trigger('change');
        $('#account-addressWard').val('').trigger('change');
    }

    

    $('#account-addressDetail').val(id > 0 ? editObj.addressDetail : '');
    $('#account-active').val(id > 0 ? editObj.active : '');
    $('#account-accessFailedCount').val(id > 0 ? editObj.accessFailedCount : '');
    $('#account-lockoutEnabled').val(id > 0 ? editObj.lockoutEnabled : '');
    $('#account-lockoutEndDate').val(
        id > 0
            ? moment(editObj.lockoutEndDate).format('DD/MM/YYYY HH:mm:ss')
            : moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
    );
    $('#account-createdTime').val(
        id > 0
            ? moment(editObj.createdTime).format('DD/MM/YYYY HH:mm:ss')
            : moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
    );
    $('#account-search').val(id > 0 ? editObj.search : '');
    $('#account-roleId')
        .val(id > 0 ? editObj.roleId : role_collabborator)
        .trigger('change');
    $('#account-phone').val(id > 0 ? editObj.phone : '');
    $('#account-email').val(id > 0 ? editObj.email : '');
    $('#account-photo').attr('file-path', id > 0 ? editObj.photo : '');
    $('#account-photo')
        .attr(
            'src',
            id > 0 && editObj.photo != undefined && editObj.photo.trim() != ''
                ? editObj.photo
                : '/assets/media/images/blog/NoImage.png'
        )
        .trigger('change');

    //generate tab mạng xã hội
    if (id > 0) {
        getAccountMeta(editObj.id);
    }
    else {
        genKeyAccountMetaBlank();
    }
}
async function updateItem(id) {
    var actionName = id == 0 ? 'Bạn muốn tạo mới' : 'Cập nhật';
    var obj;
    if (id > 0) {
        obj = await getItemById(id);
    }
    let objName = id > 0 ? obj.fullName : 'tài khoản';
    let filePath = $('#account-photo').attr('file-path') || '';
    //validateInputNumber(id);
    let formattedDob = convertDateFormat($('#account-doB').val());

    const newDataMeta = dataUpdateMeta.map(item => {
        return {
            id: item.id,
            key: item.key,
            value: item.link,
            description: item.description,
            status: item.status
        };
    });


    var updatingObj =
        id == 0
            ? {
                accountStatusId: Number($('#account-accountStatusId').val()),
                accountTypeId: Number($('#account-accountTypeId').val()),
                username: $('#account-username').val(),
                password: $('#account-password').val(),
                fullName: $('#account-fullName').val(),
                firstName: $('#account-firstName').val(),
                middleName: $('#account-middleName').val(),
                lastName: $('#account-lastName').val(),
                photo: filePath,
                description: $('#account-description').val(),
                info: $('#account-info').val(),
                idCardNumber: $('#account-idCardNumber').val(),
                googleId: $('#account-googleId').val(),
                facebookId: $('#account-facebookId').val(),
                idCardNumberPhoto1: $('#account-idCardNumberPhoto1').val(),
                idCardNumberPhoto2: $('#account-idCardNumberPhoto2').val(),
                doB: formattedDob,
                //"doB": $("#account-doB").val(),
                zipCode: $('#account-zipCode').val(),
                addressCity: $('#account-addressCity').val(),
                addressDistrict: $('#account-addressDistrictt').val(),
                addressWard: $('#account-addressWard').val(),
                addressDetail: $('#account-addressDetail').val(),
                email: $('#account-email').val(),
                active: 1,
                accessFailedCount: $('#account-accessFailedCount').val(),
                lockoutEnabled: $('#account-lockoutEnabled').val(),
                lockoutEndDate: $('#account-lockoutEndDate').val(),
                createdTime: $('#account-createdTime').val(),
                search: $('#account-search').val(),
                roleId: Number($('#account-roleId').val()),
                phone: $('#account-phone').val(),
                listAccountMeta: newDataMeta

            }
            : {
                id: $('#account-id').val(),
                accountStatusId: Number($('#account-accountStatusId').val()),
                accountTypeId: Number($('#account-accountTypeId').val()),
                username: $('#account-username').val(),
                password: $('#account-password').val(),
                fullName: $('#account-fullName').val(),
                firstName: $('#account-firstName').val(),
                middleName: $('#account-middleName').val(),
                lastName: $('#account-lastName').val(),
                photo: filePath,
                description: $('#account-description').val(),
                info: $('#account-info').val(),
                idCardNumber: $('#account-idCardNumber').val(),
                googleId: $('#account-googleId').val(),
                facebookId: $('#account-facebookId').val(),
                idCardNumberPhoto1: $('#account-idCardNumberPhoto1').val(),
                idCardNumberPhoto2: $('#account-idCardNumberPhoto2').val(),
                doB: formattedDob,
                //"doB": $("#account-doB").val(),
                zipCode: $('#account-zipCode').val(),
                addressCity: $('#account-addressCity').val(),
                addressDistrict: $('#account-addressDistrictt').val(),
                addressWard: $('#account-addressWard').val(),
                addressDetail: $('#account-addressDetail').val(),
                email: $('#account-email').val(),
                active: 1,
                accessFailedCount: $('#account-accessFailedCount').val(),
                lockoutEnabled: $('#account-lockoutEnabled').val(),
                lockoutEndDate: $('#account-lockoutEndDate').val(),
                search: $('#account-search').val(),
                roleId: Number($('#account-roleId').val()),
                phone: $('#account-phone').val(),
                listAccountMeta : newDataMeta
            };

    if (validateInput(id)) {
        Swal.fire({
            title: 'Xác nhận thay đổi?',
            text: '' + actionName + ' ' + objName + '',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
        }).then((result) => {
            if (result.value) {
                //CALL AJAX TO UPDATE
                if (id > 0) {
                    $.ajax({
                        url: systemURL + 'account/api/Update-Collabborator',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(updatingObj),
                        success: function (responseData) {
                            // debugger;
                            if (
                                responseData.status == 200 &&
                                responseData.message === 'SUCCESS'
                            ) {
                                Swal.fire(
                                    'Thành Công!',
                                    'Đã cập nhật "' + objName + '" ',
                                    'success'
                                );
                                reGenTable();
                                // Remove loading indication
                                $('#modal-id').modal('hide');
                                submitButton.removeAttribute('data-kt-indicator');
                                // Enable button
                                submitButton.disabled = false;
                            } else if (
                                responseData.status == 207 &&
                                responseData.message === 'IS_EXIST_PHONE_NUMBER'
                            ) {
                                Swal.fire(
                                    'Thất bại!',
                                    'Số điện thoại đã được sử dụng',
                                    'warning'
                                );
                                enableBtnSubmit();
                            } else if (
                                responseData.status == 205 &&
                                responseData.message === 'IS_EXIST_USERNAME'
                            ) {
                                Swal.fire('Thất bại!', 'Tên tài khoản đã tồn tại', 'warning');
                                enableBtnSubmit();
                            } else if (
                                responseData.status == 206 &&
                                responseData.message === 'IS_EXIST_IDSTAFF'
                            ) {
                                Swal.fire('Thất bại!', 'Mã nhân viên đã tồn tại', 'warning');
                                enableBtnSubmit();
                            }
                        },
                        error: function (e) {
                            //console.log(e.message);
                            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable button
                            submitButton.disabled = false;
                        },
                    });
                }
                //CALL AJAX TO CREATE
                if (id == 0) {
                    //updatingObj.id = 1;
                    delete updatingObj['id'];
                    updatingObj.active = true;
                    updatingObj.createdTime = new Date();
                    $.ajax({
                        url: systemURL + 'account/api/Add-Collabborator',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(updatingObj),
                        success: function (responseData) {
                            // debugger;
                            if (
                                responseData.status == 201 &&
                                responseData.message === 'CREATED'
                            ) {
                                Swal.fire(
                                    'Thành công!',
                                    'Đã tạo mới ' + objName + '',
                                    'success'
                                );
                                $('#modal-id').modal('hide');
                                updatingObj = responseData.data;
                                reGenTable();
                                // Remove loading indication
                                enableBtnSubmit();
                            } else if (
                                responseData.status == 207 &&
                                responseData.message === 'IS_EXIST_PHONE_NUMBER'
                            ) {
                                Swal.fire(
                                    'Thất bại!',
                                    'Số điện thoại đã được sử dụng',
                                    'warning'
                                );
                                enableBtnSubmit();
                            } else if (
                                responseData.status == 205 &&
                                responseData.message === 'IS_EXIST_USERNAME'
                            ) {
                                Swal.fire('Thất bại!', 'Tên người dùng đã tồn tại', 'warning');
                                enableBtnSubmit();
                            } else if (
                                responseData.status == 206 &&
                                responseData.message === 'IS_EXIST_IDSTAFF'
                            ) {
                                Swal.fire('Thất bại!', 'Mã nhân viên đã tồn tại', 'warning');
                                enableBtnSubmit();
                            }
                        },
                        error: function (e) {
                            //console.log(e.message);
                            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable button
                            submitButton.disabled = false;
                        },
                    });
                }
            } else {
                // Remove loading indication
                submitButton.removeAttribute('data-kt-indicator');
                // Enable button
                submitButton.disabled = false;
            }
        });
    }
}
async function deleteItem(id) {
    updatingObj = table.ajax.json().data.find((c) => c.id == id);
    let objName = id > 0 ? updatingObj.fullName : 'item';
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: 'Xóa ' + objName + '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
    }).then((result) => {
        if (result.value) {
            //CALL AJAX TO DELETE
            $.ajax({
                url: systemURL + 'account/api/delete',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: id }),
                success: function (responseData) {
                    // debugger;
                    if (
                        responseData.status == 200 &&
                        responseData.message === 'SUCCESS'
                    ) {
                        Swal.fire('Thành công!', 'Đã xoá ' + objName + '.', 'success');
                        reGenTable();
                    }
                },
                error: function (e) {
                    //console.log(e.message);
                    Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
                },
            });
        } else {
            // Remove loading indication
            submitButton.removeAttribute('data-kt-indicator');
            // Enable button
            submitButton.disabled = false;
        }
    });
}
async function getItemById(id) {
    var data;
    await $.ajax({
        url: systemURL + 'account/api/Detail/' + id,
        method: 'GET',
        success: function (responseData) {
            data = responseData.data[0];
        },
        error: function (e) { },
    });
    return data;
}
function reGenTable() {
    tableUpdating = 0;
    table.destroy();
    $('.tableHeaderFilter').val(null).trigger('change');
    $('#tableData tbody').html('');
    loadData();
}
function tableSearch() {
    table
        .column(1)
        .search($('#tableData thead:nth-child(2) tr th:nth-child(2) input').val());
    table
        .column(2)
        .search($('#tableData thead:nth-child(2) tr th:nth-child(3) input').val());
    table
        .column(3)
        .search($('#tableData thead:nth-child(2) tr th:nth-child(4) input').val());
    table
        .column(5)
        .search($('#tableData thead:nth-child(2) tr th:nth-child(6) input').val());
    table.draw();
}

async function quickApproved(isApproved, id) {
    var titleName = isApproved ? "Duyệt" : "Từ chối";
    var actionName = isApproved ? "Duyệt cộng tác viên" : "Từ chối cộng tác viên";
    var objName = await getItemById(id);
    var obj = { "id": id, "isApproved": isApproved }
    Swal.fire({
        title: titleName,
        html: actionName + " <strong>" + objName.fullName + "</strong>",
        icon: 'info',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xác nhận',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass('show');

            //CALL AJAX TO UPDATE
            $.ajax({
                url: systemURL + "account/api/QuickApprove",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (responseData) {
                    $("#loading").removeClass('show');
                    if (responseData.status == "200" && responseData.message === "SUCCESS") {
                        Swal.fire({
                            title: titleName,

                            html: actionName + " <strong>" + objName.fullName + "</strong> thành công",
                            icon: 'success'
                        });
                    }
                },
                error: function (e) {
                    $("#loading").removeClass('show');
                    Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
                }
            });
        }
        else {
            $(".checkIsApproved[data-id=" + id + "]").prop("checked", !isApproved);
        }
    })
}

var dataUpdateMeta = [];
function genKeyAccountMetaBlank() {
    $("#kt_tab_pane_2").html('');
    var html = "";
    listMetaKey.forEach(function (item) {
        let guid = generateGUID();
        html += `
        <!--begin::Repeater-->
        <h3>${item.name}</h3>
            <div id="kt_docs_repeater_basic_${item.key}" class="repeater-loop ">
                <!--begin::Form group-->
                <div class="form-group">
                    <div data-repeater-list="kt_docs_repeater_basic_${item.key}">
                        <div data-repeater-item data-id="0" data-key="${item.key}">
                            <div class="form-group row">
                                <div class="col-md-5">
                                    <label class="form-label">Liên kết</label>
                                    <input type="text" class="form-control mb-2 mb-md-0 name-${item.key} repeater-link form-repeat-input"  placeholder="Liên kết" />
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label">Ghi chú</label>
                                    <input type="text" class="form-control mb-2 mb-md-0 name-${item.key} repeater-desc form-repeat-input" placeholder="Ghi chú" />
                                </div>
                                <div class="col-md-2">
                                    <a href="javascript:;" data-repeater-delete class="btn btn-sm btn-light-danger mt-3 mt-md-8">
                                        <i class="ki-duotone ki-trash fs-5"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
                                        Xóa
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--end::Form group-->

                <!--begin::Form group-->
                <div class="form-group mt-5">
                    <a href="javascript:;" data-repeater-create class="btn btn-light-primary">
                        <i class="ki-duotone ki-plus fs-3"></i>
                        Thêm
                    </a>
                </div>
                <!--end::Form group-->
            </div>

            <hr class='mt-10' />
            <!--end::Repeater-->
        `
    })

    $("#kt_tab_pane_2").html(html)

    $('.repeater-loop').repeater({
        initEmpty: true,

        show: function () {
            let thisHtml = this;

            let newGuid = generateGUID();
            $(thisHtml).attr('data-guid', newGuid)
            $(thisHtml).find('.repeater-link').attr('data-guid', newGuid);
            $(thisHtml).find('.repeater-desc').attr('data-guid', newGuid);

            let newItem = {
                guId: newGuid,
                id: $(thisHtml).attr('data-id'),
                key: $(thisHtml).attr('data-key'),
                link: "",
                description: "",
                status: "ADD"
            }
            dataUpdateMeta.push(newItem)
            $(this).slideDown();
        },

        hide: function (deleteElement) {
            //dataUpdateMeta = dataUpdateMeta.filter(x => x.guId != $(this).attr('data-guid'))
            let guId = $(this).attr('data-guid');
            let deletingObj = dataUpdateMeta.find(x => x.guId == guId);
            deletingObj.status = "DELETE";
            $(this).slideUp(deleteElement);
        },
        ready: function () {
            //sự kiện change link
            $(".repeater-loop").on('change', '.repeater-link', function () {
                let guid = $(this).attr('data-guid');
                let updatingObj = dataUpdateMeta.find(x => x.guId == guid);
                updatingObj.link = $(this).val();
                updatingObj.status = "UPDATE";
            })

            //sự kiện change desc
            $(".repeater-loop").on('change', '.repeater-desc', function () {
                let guid = $(this).attr('data-guid');
                let updatingObj = dataUpdateMeta.find(x => x.guId == guid);
                updatingObj.description = $(this).val();
                updatingObj.status = "UPDATE";
            })
        }
    });
}

function getAccountMeta(accountId) {
    var accountMeta = [];
    $.ajax({
        url: systemURL + 'accountMeta/api/list-by-accountid/' + accountId,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            if (responseData.resources != null && responseData.resources.length > 0) {
                genKeyAccountMeta(responseData.resources);
            }
            else {
                genKeyAccountMetaBlank();
            }
        },
        error: function (e) {
            genKeyAccountMetaBlank();
        },
    });
}

function genKeyAccountMeta(data) {
    $("#kt_tab_pane_2").html('');

    listMetaKey.forEach(function (item) {
        var html = "";
        var childHtml = "";
        let guid = generateGUID();
        var isInitEmpty = true;
        var blankHtml = `<div data-repeater-item data-id="0" data-guid="${guid}" data-key="${item.key}">
                            <div class="form-group row">
                                <div class="col-md-5">
                                    <label class="form-label">Liên kết</label>
                                    <input type="email" class="form-control mb-2 mb-md-0 name-${item.key} repeater-link form-repeat-input" placeholder="Liên kết" />
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label">Ghi chú</label>
                                    <input type="email" class="form-control mb-2 mb-md-0 name-${item.key} repeater-desc form-repeat-input" placeholder="Ghi chú" />
                                </div>
                                <div class="col-md-2">
                                    <a href="javascript:;" data-repeater-delete class="btn btn-sm btn-light-danger mt-3 mt-md-8">
                                        <i class="ki-duotone ki-trash fs-5"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
                                        Xóa
                                    </a>
                                </div>
                            </div>
                        </div>`
        data.forEach(function (childItem) {
            if (item.key == childItem.key) {
                isInitEmpty = false;
                let newGuId = generateGUID();
                let newObj = {
                    guId: newGuId,
                    id: childItem.id,
                    key: childItem.key,
                    link: childItem.value,
                    description: childItem.description,
                    status : "UPDATE"
                }
                dataUpdateMeta.push(newObj);
                childHtml += `<div data-repeater-item data-id="${childItem.id}" data-guid="${newGuId}" data-key="${childItem.key}">
                            <div class="form-group row">
                                <div class="col-md-5">
                                    <label class="form-label">Liên kết</label>
                                    <input type="email" class="form-control mb-2 mb-md-0 name-${childItem.key} repeater-link form-repeat-input" placeholder="Liên kết" data-guid="${newGuId}"/>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label">Ghi chú</label>
                                    <input type="email" class="form-control mb-2 mb-md-0 name-${childItem.key} repeater-desc form-repeat-input" placeholder="Ghi chú" data-guid="${newGuId}"/>
                                </div>
                                <div class="col-md-2">
                                    <a href="javascript:;" data-repeater-delete class="btn btn-sm btn-light-danger mt-3 mt-md-8">
                                        <i class="ki-duotone ki-trash fs-5"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
                                        Xóa
                                    </a>
                                </div>
                                </div>
                            </div>`
            }
        })
        html += `
        <!--begin::Repeater-->
        <h3>${item.name}</h3>
            <div id="kt_docs_repeater_basic_${item.key}" class="repeater-loop">
                <!--begin::Form group-->
                <div class="form-group">
                    <div data-repeater-list="kt_docs_repeater_basic_${item.key}">
                        ${childHtml != "" ? childHtml : blankHtml}
                    </div>
                </div>
                <!--end::Form group-->

                <!--begin::Form group-->
                <div class="form-group mt-5">
                    <a href="javascript:;" data-repeater-create class="btn btn-light-primary">
                        <i class="ki-duotone ki-plus fs-3"></i>
                        Thêm
                    </a>
                </div>
                <!--end::Form group-->
            </div>

            <hr class='mt-10' />
            <!--end::Repeater-->
        `
        $("#kt_tab_pane_2").append(html)

        $(`#kt_docs_repeater_basic_${item.key}`).repeater({
            initEmpty: isInitEmpty,
            show: function () {
                let thisHtml = this;

                let newGuid = generateGUID();
                $(thisHtml).attr('data-guid', newGuid)
                $(thisHtml).find('.repeater-link').attr('data-guid', newGuid);
                $(thisHtml).find('.repeater-desc').attr('data-guid', newGuid);
                let newItem = {
                    guId: newGuid,
                    id: $(thisHtml).attr('data-id'),
                    key: $(thisHtml).attr('data-key'),
                    link: "",
                    description: "",
                    status: "ADD"
                }
                dataUpdateMeta.push(newItem)
                $(this).slideDown();
            },

            hide: function (deleteElement) {
                //dataUpdateMeta = dataUpdateMeta.filter(x => x.guId != $(this).attr('data-guid'))
                let guId = $(this).attr('data-guid');
                let deletingObj = dataUpdateMeta.find(x => x.guId == guId);
                deletingObj.status = "DELETE";
                $(this).slideUp(deleteElement);
            },
            ready: function () {
                //sự kiện change link
                $(".repeater-loop").on('change', '.repeater-link', function () {
                    let guid = $(this).attr('data-guid');
                    let updatingObj = dataUpdateMeta.find(x => x.guId == guid);
                    updatingObj.link = $(this).val();
                    updatingObj.status = "UPDATE";
                })

                //sự kiện change desc
                $(".repeater-loop").on('change', '.repeater-desc', function () {
                    let guid = $(this).attr('data-guid');
                    let updatingObj = dataUpdateMeta.find(x => x.guId == guid);
                    updatingObj.description = $(this).val();
                    updatingObj.status = "UPDATE";
                })
            }
        });
    })
    fillDataToAccountMeta();
}

function fillDataToAccountMeta() {
    dataUpdateMeta.forEach(function (item) {
        $(`[data-guid="${item.guId}"].repeater-link`).val(item.link);
        $(`[data-guid="${item.guId}"].repeater-desc`).val(item.description);
    })
}

function generateGUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

