"use strict";

// Class definition
var KTFileManagerList = function () {
    // Define shared variables
    var datatable;
    var table
    var currentFolderId = null;
    var currentTargetId = null;
    const uploadURL = "/upload";

    // Define template element variables
    var uploadTemplate;
    var renameTemplate;
    var actionTemplate;
    var checkboxTemplate;

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    const handleAction = function () {
        $(document).on("click", "[data-action=view]", function (e) {
            e.preventDefault();
            let id = $(this).data("id") || null;
            currentFolderId = id;
            reload();
        })
    }

    const initBreadCum = function (data = []) {
        let html = '<i class="ki-duotone ki-abstract-32 fs-2 text-primary me-3"><span class="path1"></span><span class="path2"></span></i><a href="#!" data-action="view">Digital Innovation</a>';

        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            if (i == 0) {
                html += `<i class="ki-duotone ki-right fs-2 text-primary mx-1"></i> ${item.name}`
            }
            else {
                html += `<i class="ki-duotone ki-right fs-2 text-primary mx-1"></i> <a data-action="view" data-id="${item.id}" href="#!">${item.name}</a>`;
            }
        }
        $("#file-manager-container [data-control=breadCum]").html(html);

    }

    const reload = function () {
        if (datatable) {
            const filterSearch = document.querySelector('[data-kt-filemanager-table-filter="search"]');
            datatable.ajax.reload();
            $(filterSearch).val("").trigger("keyup")
        }
    }

    const loading = function (status) {
        if (status) {
            $("#file-manager-container>[data-control=loading]").show();
            $("#file-manager-container").addClass("overlay-block");
        }
        else {
            $("#file-manager-container>[data-control=loading]").hide();
            $("#file-manager-container").removeClass("overlay-block");
        }
    }

    // Private functions
    const initTemplates = () => {
        uploadTemplate = document.querySelector('[data-kt-filemanager-template="upload"]');
        renameTemplate = document.querySelector('[data-kt-filemanager-template="rename"]');
        actionTemplate = document.querySelector('[data-kt-filemanager-template="action"]');
        checkboxTemplate = document.querySelector('[data-kt-filemanager-template="checkbox"]');
    }

    const initDatatable = () => {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const dateCol = dateRow[3]; // select date from 4th column in table
            const realDate = moment(dateCol.innerHTML, "DD MMM YYYY, LT").format();
            dateCol.setAttribute('data-order', realDate);
        });

        const filesListOptions = {
            "info": false,
            'order': [1, 'asc'],
            'pageLength': 10,
            paging: true,
            "lengthChange": false,
            'columns': [
                {
                    data: 'checkbox',
                    render: function (data, type, row, meta) {
                        return `<div class="form-check form-check-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox" value="1" />
                                </div>`;
                    }
                },
                {
                    data: 'name',
                    render: function (data, type, row, meta) {
                        return `<div class="d-flex align-items-center">
                                    <span class="icon-wrapper"><i class="ki-duotone ki-folder fs-2x text-primary me-4"><span class="path1"></span><span class="path2"></span></i></span>
                                    <a href="${uploadURL}${row.path}" data-action="view" data-id="${row.id}" class="text-gray-800 text-hover-primary">${data}</a>
                                </div>`;
                    }
                },
                {
                    data: 'size',
                    render: function (data, type, row, meta) {
                        return `-`;
                    }
                },
                {
                    data: 'date',
                    render: function (data, type, row, meta) {
                        return `-`;
                    }
                },
                {
                    data: 'action',
                    render: function (data, type, row, meta) {
                        var sharePath = location.origin + uploadURL + row.path;
                        return `<div class="d-flex justify-content-end">
                                    <!--begin::Share link-->
                                    <div class="ms-2" data-kt-filemanger-table="copy_link">
                                        <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                            <i class="ki-duotone ki-fasten fs-5 m-0"><span class="path1"></span><span class="path2"></span></i>
                                        </button>
                                        <!--begin::Menu-->
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-300px" data-kt-menu="true">
                                            <!--begin::Card-->
                                            <div class="card card-flush">
                                                <div class="card-body p-5">
                                                    <!--begin::Loader-->
                                                    <div class="d-flex" data-kt-filemanger-table="copy_link_generator">
                                                        <!--begin::Spinner-->
                                                        <div class="me-5" data-kt-indicator="on">
                                                            <span class="indicator-progress">
                                                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                            </span>
                                                        </div>
                                                        <!--end::Spinner-->
                                                        <!--begin::Label-->
                                                        <div class="fs-6 text-gray-900">Tạo liên kết chia sẻ...</div>
                                                        <!--end::Label-->
                                                    </div>
                                                    <!--end::Loader-->
                                                    <!--begin::Link-->
                                                    <div class="d-flex flex-column text-start d-none" data-kt-filemanger-table="copy_link_result">
                                                        <div class="d-flex mb-3">
                                                            <i class="ki-duotone ki-check fs-2 text-success me-3"></i>                    <div class="fs-6 text-gray-900">Chia sẻ liên kết được tạo</div>
                                                        </div>
                                                        <div class="d-flex">
                                                            <input type="text" class="form-control form-control-sm  me-3 flex-grow-1 " readonly value="${sharePath}" />
                                                            <!--begin::Button-->
                                                            <button class="btn btn-sm btn-icon btn-light btn-active-light-primary flex-shrink-0" data-clipboard-target="#kt_clipboard_4">
                                                                <i class="ki-duotone ki-copy fs-2 m-0 text-muted"></i>
                                                            </button>
                                                            <!--end::Button-->
                                                        </div>
                                                        <div class="text-muted fw-normal mt-2 fs-8 px-3">Chỉ đọc. <a href="/admin/apps/file-manager/settings/.html" class="ms-2">Thay đổi quyền</a></div>
                                                    </div>
                                                    <!--end::Link-->
                                                </div>
                                            </div>
                                            <!--end::Card-->
                                        </div>
                                        <!--end::Menu-->                                    <!--end::Share link-->
                                    </div>

                                    <!--begin::More-->
                                    <div class="ms-2">
                                        <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary me-2" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                            <i class="ki-duotone ki-dots-square fs-5 m-0"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                                        </button>
                                        <!--begin::Menu-->
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4" data-kt-menu="true">
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="${row.path}" data-action="view" data-id="${row.id}" class="menu-link px-3">
                                                    Xem
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3" data-kt-filemanager-table="rename" data-id="${row.id}">
                                                    Đổi tên
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3">
                                                    Download Folder
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3" data-kt-filemanager-table-filter="move_row" data-bs-toggle="modal" data-bs-target="#kt_modal_move_to_folder">
                                                    Move to folder
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link text-danger px-3" data-id="${row.id}" data-kt-filemanager-table-filter="delete_row">
                                                    Xóa
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                        </div>
                                        <!--end::Menu-->                                    <!--end::More-->
                                    </div>
                                </div>`;
                    }
                },
            ],

            language: {
                url: '/admin/assets/plugins/custom/datatables/vietnamese.json',
            },
            ajax: {
                dataSrc: function (res) {
                    if (res.isSucceeded) {
                        initBreadCum(res.resources.parents || []);
                    }
                    return res.resources.childrens;
                },
                url: '/file-manager/api/list',
                beforeSend: function (xhr) {
                    if (localStorage.Authorization) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.Authorization);
                    }
                },
                data: function (d) {
                    return {
                        viewMode: $("#file-header-tab a.active").data("mode") || undefined,
                        parentId: currentFolderId,
                    }
                },
                type: 'GET'
            },
            columnDefs: [
                { orderable: false, targets: [-1, 0] },
            ]
        };


        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable(filesListOptions);

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            initToggleToolbar();
            handleDeleteRows();
            toggleToolbars();
            resetNewFolder();
            KTMenu.createInstances();
            initCopyLink();
            countTotalItems();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    const handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-filemanager-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Delete customer
    const handleDeleteRows = () => {
        // Select all delete buttons
        const deleteButtons = table.querySelectorAll('[data-kt-filemanager-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();
                // Select parent row
                const parent = e.target.closest('tr');
                let id = $(d).data("id");
                // Get customer name
                const fileName = parent.querySelectorAll('td')[1].innerText;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Bạn có chắc chắn muốn xóa " + fileName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Có",
                    cancelButtonText: "Không",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(async function (result) {
                    if (result.value) {
                        try {
                            var res = await httpService.deleteAsync("file-manager/api/delete/" + id);
                            if (res.isSucceeded) {
                                Swal.fire({
                                    text: "Bạn đã xóa " + fileName + "!.",
                                    icon: "success",
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function () {
                                    reload();
                                });
                            }
                            else {
                                Swal.fire({
                                    text: "Đã có lỗi xảy ra, xin vui lòng thử lại sau!",
                                    icon: "error",
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                });
                            }

                        } catch (e) {
                            console.warn(e);
                            Swal.fire({
                                text: "Đã có lỗi xảy ra, xin vui lòng thử lại sau!",
                                icon: "error",
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: fileName + " đã không bị xóa.",
                            icon: "error",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }

    // Init toggle toolbar
    const initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        var checkboxes = table.querySelectorAll('[type="checkbox"]');
        if (table.getAttribute('data-kt-filemanager-table') === 'folders') {
            checkboxes = document.querySelectorAll('#kt_file_manager_list_wrapper [type="checkbox"]');
        }

        // Select elements
        const deleteSelected = document.querySelector('[data-kt-filemanager-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                console.log(c);
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function () {
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "Are you sure you want to delete selected files or folders?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "You have deleted all selected  files or folders!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        // Remove all selected customers
                        checkboxes.forEach(c => {
                            if (c.checked) {
                                datatable.row($(c.closest('tbody tr'))).remove().draw();
                            }
                        });

                        // Remove header checked box
                        const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                        headerCheckbox.checked = false;
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Selected  files or folders was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }

    // Toggle toolbars
    const toggleToolbars = () => {
        // Define variables
        const toolbarBase = document.querySelector('[data-kt-filemanager-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-filemanager-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-filemanager-table-select="selected_count"]');

        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    // Handle new folder
    const handleNewFolder = () => {
        // Select button
        const newFolder = document.getElementById('kt_file_manager_new_folder');

        // Handle click action
        newFolder.addEventListener('click', e => {
            e.preventDefault();

            // Ignore if input already exist
            if (table.querySelector('#kt_file_manager_new_folder_row')) {
                return;
            }

            // Add new blank row to datatable
            const tableBody = table.querySelector('tbody');
            const rowElement = uploadTemplate.cloneNode(true); // Clone template markup
            tableBody.prepend(rowElement);

            // Define template interactive elements
            const rowForm = rowElement.querySelector('#kt_file_manager_add_folder_form');
            const rowButton = rowElement.querySelector('#kt_file_manager_add_folder');
            const cancelButton = rowElement.querySelector('#kt_file_manager_cancel_folder');
            const folderIcon = rowElement.querySelector('#kt_file_manager_folder_icon');
            const rowInput = rowElement.querySelector('[name="new_folder_name"]');

            // Define validator
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            var validator = FormValidation.formValidation(
                rowForm,
                {
                    fields: {
                        'new_folder_name': {
                            validators: {
                                notEmpty: {
                                    message: 'Tên thư mục không được để trống'
                                },
                                regexp: {
                                    regexp: /^(?!\s)(?!.*[\\/:\*\?"<>\|])[^]{1,255}(?<!\s)$/,
                                    message: 'Tên thư mục không chứa các ký tự đặc biệt như: /, \\, :, *, ?, ", <, >, |, khoảng trắng ở đầu và cuối tên và có độ dài giới hạn là 255 ký tự.'
                                }
                            }
                        },
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

            // Handle add new folder button
            rowButton.addEventListener('click', e => {
                e.preventDefault();

                // Activate indicator
                rowButton.setAttribute("data-kt-indicator", "on");

                // Validate form before submit
                if (validator) {
                    validator.validate().then(async function (status) {
                        console.log('validated!');

                        if (status == 'Valid') {
                            // Simulate process for demo only
                            try {
                                var obj = {
                                    "name": rowInput.value.trim(),
                                    "parentId": currentFolderId
                                };
                                var res = await httpService.postAsync("file-manager/api/add-folder", obj);
                                if (res.isSucceeded) {
                                    toastr.success('Thư mục ' + rowInput.value + ' đã được thêm mới thành công!');
                                    // Reset input
                                    rowInput.value = '';
                                    reload();
                                }
                                else {
                                    toastr.error('Đã có lỗi xảy ra khi tạo thư mục mới! Xin vui lòng thử lại sau!');
                                }
                            } catch (e) {
                                console.warn(e);
                                toastr.error('Đã có lỗi xảy ra khi tạo thư mục mới! Xin vui lòng thử lại sau!');
                            }
                            finally {
                                // Disable indicator
                                rowButton.removeAttribute("data-kt-indicator");
                            }
                        } else {
                            // Disable indicator
                            rowButton.removeAttribute("data-kt-indicator");
                        }
                    });
                }
            });

            // Handle cancel new folder button
            cancelButton.addEventListener('click', e => {
                e.preventDefault();

                // Activate indicator
                cancelButton.setAttribute("data-kt-indicator", "on");

                setTimeout(function () {
                    // Disable indicator
                    cancelButton.removeAttribute("data-kt-indicator");

                    toastr.error('Đã hủy việc tạo thư mục mới!');
                    resetNewFolder();
                }, 1000);
            });
        });
    }

    // Reset add new folder input
    const resetNewFolder = () => {
        const newFolderRow = table.querySelector('#kt_file_manager_new_folder_row');

        if (newFolderRow) {
            newFolderRow.parentNode.removeChild(newFolderRow);
        }
    }

    // Handle rename file or folder
    const handleRename = () => {
        $(document).on("click","[data-kt-filemanager-table=rename]", function (e) {
            e.preventDefault();
            currentTargetId = $(this).data("id");
            if (!currentTargetId) {
                return;
            }
            // Define shared value
            let nameValue;
            let path;


            // Stop renaming if there's an input existing
            if (table.querySelectorAll('#kt_file_manager_rename_input').length > 0) {
                console.log(table.querySelectorAll('#kt_file_manager_rename_input'));
                Swal.fire({
                    text: "Thư mục chưa được lưu. Vui lòng lưu hoặc hủy.",
                    icon: "warning",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger"
                    }
                });

                return;
            }

            // Select parent row
            const parent = e.target.closest('tr');

            // Get name column
            const nameCol = parent.querySelectorAll('td')[1];
            const colIcon = nameCol.querySelector('.icon-wrapper');
            nameValue = nameCol.innerText;
            path = nameCol.querySelector("a").href;

            // Set rename input template
            const renameInput = renameTemplate.cloneNode(true);
            renameInput.querySelector('#kt_file_manager_rename_folder_icon').innerHTML = colIcon.outerHTML;

            // Swap current column content with input template
            nameCol.innerHTML = renameInput.innerHTML;

            // Set input value with current file/folder name
            parent.querySelector('#kt_file_manager_rename_input').value = nameValue;

            // Rename file / folder validator
            var renameValidator = FormValidation.formValidation(
                nameCol,
                {
                    fields: {
                        'rename_folder_name': {
                            validators: {
                                notEmpty: {
                                    message: 'Tên không được để trống'
                                },
                                regexp: {
                                    regexp: /^(?!\s)(?!.*[\\/:\*\?"<>\|])[^]{1,255}(?<!\s)$/,
                                    message: 'Tên thư mục không chứa các ký tự đặc biệt như: /, \\, :, *, ?, ", <, >, |, khoảng trắng ở đầu và cuối tên và có độ dài giới hạn là 255 ký tự.'
                                }
                            }
                        },
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

            // Rename input button action
            const renameInputButton = document.querySelector('#kt_file_manager_rename_folder');
            renameInputButton.addEventListener('click', e => {
                e.preventDefault();

                // Detect if valid
                if (renameValidator) {
                    renameValidator.validate().then(function (status) {
                        if (status == 'Valid') {

                            const newValue = document.querySelector('#kt_file_manager_rename_input').value;

                            // Pop up confirmation
                            Swal.fire({
                                text: "Bạn có chắc chắn muốn đổi tên " + nameValue + "?",
                                icon: "warning",
                                showCancelButton: true,
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn fw-bold btn-danger",
                                    cancelButton: "btn fw-bold btn-active-light-primary"
                                }
                            }).then(async function (result) {
                                if (result.value) {
                                    try {
                                        var res = await httpService.putAsync("file-manager/api/rename-folder", {
                                            id: currentTargetId,
                                            name: newValue
                                        })
                                        if (res.isSucceeded) {
                                            Swal.fire({
                                                text: "Bạn đã đổi tên thư mục " + nameValue + "!.",
                                                icon: "success",
                                                buttonsStyling: false,
                                                customClass: {
                                                    confirmButton: "btn fw-bold btn-primary",
                                                }
                                            }).then(function () {
                                                // Draw datatable with new content -- Add more events here for any server-side events
                                                datatable.cell($(nameCol)).data(newValue).draw();
                                            });
                                        }
                                        else {
                                            Swal.fire({
                                                text: "Đã có lỗi xảy ra khi thực hiện đổi tên thư mục, vui long thử lại sau!",
                                                icon: "error",
                                                buttonsStyling: false,
                                                customClass: {
                                                    confirmButton: "btn fw-bold btn-primary",
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        console.warn(e);
                                        Swal.fire({
                                            text: "Đã có lỗi xảy ra khi thực hiện đổi tên thư mục, vui long thử lại sau!",
                                            icon: "error",
                                            buttonsStyling: false,
                                            customClass: {
                                                confirmButton: "btn fw-bold btn-primary",
                                            }
                                        });
                                    }
                                } else if (result.dismiss === 'cancel') {
                                    Swal.fire({
                                        text: nameValue + " was not renamed.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-primary",
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            // Cancel rename input
            const cancelInputButton = document.querySelector('#kt_file_manager_rename_folder_cancel');
            cancelInputButton.addEventListener('click', e => {
                e.preventDefault();

                // Simulate process for demo only
                cancelInputButton.setAttribute("data-kt-indicator", "on");

                setTimeout(function () {
                    const revertTemplate = `<div class="d-flex align-items-center">
                    <a href="${path}" class="text-gray-800 text-hover-primary">${nameValue}</a>
                </div>`;

                    // Remove spinner
                    cancelInputButton.removeAttribute("data-kt-indicator");

                    // Draw datatable with new content -- Add more events here for any server-side events
                    datatable.cell($(nameCol)).data(nameValue).draw();

                    toastr.error('Đã hủy chức năng đổi tên');
                    $(renameInput).remove();
                }, 1000);
            });
        })
    }

    // Init dropzone
    const initDropzone = () => {
        // set the dropzone container id
        const id = "#kt_modal_upload_dropzone";
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: "path/to/your/server", // Set the url for your upload script location
            parallelUploads: 10,
            previewTemplate: previewTemplate,
            maxFilesize: 1, // Max filesize in MB
            autoProcessQueue: false, // Stop auto upload
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select" // Define the element that should be used as click trigger to select files.
        });

        myDropzone.on("addedfile", function (file) {
            // Hook each start button
            file.previewElement.querySelector(id + " .dropzone-start").onclick = function () {
                // myDropzone.enqueueFile(file); -- default dropzone function

                // Process simulation for demo only
                const progressBar = file.previewElement.querySelector('.progress-bar');
                progressBar.style.opacity = "1";
                var width = 1;
                var timer = setInterval(function () {
                    if (width >= 100) {
                        myDropzone.emit("success", file);
                        myDropzone.emit("complete", file);
                        clearInterval(timer);
                    } else {
                        width++;
                        progressBar.style.width = width + '%';
                    }
                }, 20);
            };

            const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });
            dropzone.querySelector('.dropzone-upload').style.display = "inline-block";
            dropzone.querySelector('.dropzone-remove-all').style.display = "inline-block";
        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone.on("complete", function (file) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');
            setTimeout(function () {
                progressBars.forEach(progressBar => {
                    progressBar.querySelector('.progress-bar').style.opacity = "0";
                    progressBar.querySelector('.progress').style.opacity = "0";
                    progressBar.querySelector('.dropzone-start').style.opacity = "0";
                });
            }, 300);
        });

        // Setup the buttons for all transfers
        dropzone.querySelector(".dropzone-upload").addEventListener('click', function () {
            // myDropzone.processQueue(); --- default dropzone process

            // Process simulation for demo only
            myDropzone.files.forEach(file => {
                const progressBar = file.previewElement.querySelector('.progress-bar');
                progressBar.style.opacity = "1";
                var width = 1;
                var timer = setInterval(function () {
                    if (width >= 100) {
                        myDropzone.emit("success", file);
                        myDropzone.emit("complete", file);
                        clearInterval(timer);
                    } else {
                        width++;
                        progressBar.style.width = width + '%';
                    }
                }, 20);
            });
        });

        // Setup the button for remove all files
        dropzone.querySelector(".dropzone-remove-all").addEventListener('click', function () {
            Swal.fire({
                text: "Are you sure you would like to remove all files?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, remove it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    dropzone.querySelector('.dropzone-upload').style.display = "none";
                    dropzone.querySelector('.dropzone-remove-all').style.display = "none";
                    myDropzone.removeAllFiles(true);
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your files was not removed!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // On all files completed upload
        myDropzone.on("queuecomplete", function (progress) {
            const uploadIcons = dropzone.querySelectorAll('.dropzone-upload');
            uploadIcons.forEach(uploadIcon => {
                uploadIcon.style.display = "none";
            });
        });

        // On all files removed
        myDropzone.on("removedfile", function (file) {
            if (myDropzone.files.length < 1) {
                dropzone.querySelector('.dropzone-upload').style.display = "none";
                dropzone.querySelector('.dropzone-remove-all').style.display = "none";
            }
        });
    }

    // Init copy link
    const initCopyLink = () => {
        // Select all copy link elements
        const elements = table.querySelectorAll('[data-kt-filemanger-table="copy_link"]');

        elements.forEach(el => {
            // Define elements
            const button = el.querySelector('button');
            const generator = el.querySelector('[data-kt-filemanger-table="copy_link_generator"]');
            const result = el.querySelector('[data-kt-filemanger-table="copy_link_result"]');
            const input = el.querySelector('input');
            const buttonCopy = input.nextElementSibling;

            buttonCopy.addEventListener("click", e => {
                e.preventDefault();
                navigator.clipboard.writeText(input.value);
                var checkIcon = buttonCopy.querySelector('.ki-check');
                var copyIcon = buttonCopy.querySelector('.ki-copy');

                // Exit check icon when already showing
                if (checkIcon) {
                    return;
                }

                // Create check icon
                checkIcon = document.createElement('i');
                checkIcon.classList.add('ki-duotone');
                checkIcon.classList.add('ki-check');
                checkIcon.classList.add('fs-2x');

                // Append check icon
                buttonCopy.appendChild(checkIcon);

                // Highlight target
                const classes = ['bg-success', 'text-white', 'fw-boldest'];
                input.classList.add(...classes);

                // Highlight button
                buttonCopy.classList.add('btn-success');

                // Hide copy icon
                copyIcon.classList.add('d-none');

                // Revert button label after 3 seconds
                setTimeout(function () {
                    // Remove check icon
                    copyIcon.classList.remove('d-none');

                    // Revert icon
                    buttonCopy.removeChild(checkIcon);

                    // Remove target highlight
                    input.classList.remove(...classes);

                    // Remove button highlight
                    buttonCopy.classList.remove('btn-success');
                }, 3000)
            })
            // Click action
            button.addEventListener('click', e => {
                e.preventDefault();

                // Reset toggle
                generator.classList.remove('d-none');
                result.classList.add('d-none');

                var linkTimeout;
                clearTimeout(linkTimeout);
                linkTimeout = setTimeout(() => {
                    generator.classList.add('d-none');
                    result.classList.remove('d-none');
                    input.select();
                    navigator.clipboard.writeText(input.value);
                }, 2000);
            });
        });
    }

    // Handle move to folder
    const handleMoveToFolder = () => {
        const element = document.querySelector('#kt_modal_move_to_folder');
        const form = element.querySelector('#kt_modal_move_to_folder_form');
        const saveButton = form.querySelector('#kt_modal_move_to_folder_submit');
        const moveModal = new bootstrap.Modal(element);

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'move_to_folder': {
                        validators: {
                            notEmpty: {
                                message: 'Please select a folder.'
                            }
                        }
                    },
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

        saveButton.addEventListener('click', e => {
            e.preventDefault();

            saveButton.setAttribute("data-kt-indicator", "on");

            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Simulate process for demo only
                        setTimeout(function () {

                            Swal.fire({
                                text: "Are you sure you would like to move to this folder",
                                icon: "warning",
                                showCancelButton: true,
                                buttonsStyling: false,
                                confirmButtonText: "Yes, move it!",
                                cancelButtonText: "No, return",
                                customClass: {
                                    confirmButton: "btn btn-primary",
                                    cancelButton: "btn btn-active-light"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    form.reset(); // Reset form	
                                    moveModal.hide(); // Hide modal		

                                    toastr.success('1 item has been moved.');

                                    saveButton.removeAttribute("data-kt-indicator");
                                } else {
                                    Swal.fire({
                                        text: "Your action has been cancelled!.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary",
                                        }
                                    });

                                    saveButton.removeAttribute("data-kt-indicator");
                                }
                            });
                        }, 500);
                    } else {
                        saveButton.removeAttribute("data-kt-indicator");
                    }
                });
            }
        });
    }

    // Count total number of items
    const countTotalItems = () => {
        const counter = document.getElementById('kt_file_manager_items_counter');

        // Count total number of elements in datatable --- more info: https://datatables.net/reference/api/count()
        counter.innerText = datatable.rows().count() + ' items';
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_file_manager_list');

            if (!table) {
                return;
            }

            initTemplates();
            initDatatable();
            initToggleToolbar();
            handleSearchDatatable();
            handleDeleteRows();
            handleNewFolder();
            initDropzone();
            initCopyLink();
            handleMoveToFolder();
            countTotalItems();
            handleAction();
            handleRename();
            KTMenu.createInstances();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTFileManagerList.init();
});