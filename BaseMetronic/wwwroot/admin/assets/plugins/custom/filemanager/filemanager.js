"use trict";
const FILE_MANAGER = function () {
    var folderData = [], selectedData = [], dataSrc = [];
    var uploadStatus = false;
    var targetEl, btnTargetEl;

    var allowedExtensions = [
        "avi", "mov", "webm", "mp4", "mp3", "flac", "aac", "ogg",
        "7z", "rar", "zip", "gz", "jpeg", "jpg", "png", "gif",
        "bmp", "webp", "tiff", "doc", "docx", "ppt", "pptx",
        "xls", "xlsx", "odt", "pdf", "txt"
    ];
    var extensions = {
        mcrsWord: [".doc", ".docx"],
        mcrsExcel: [".xls", ".xlsx", ".xlsm", ".xlsb "],
        PDF: [".pdf"],
        imgExtensions: [
            "jpeg", "jpg", "png", "gif",
            "bmp", "webp", "tiff"
        ]
    }
    var viewModeOptions = {
        fullscreen: "fullscreen",
        default: "default"
    }
    var ajax = {
        search: {
            value: ""
        },
        parentId: null,
        length: 50,
        start: 0,
        end: 0,
        draw: 1,
        accept: "",
        regen: () => {
            ajax.length = 50;
            ajax.start = 0;
            ajax.draw = 1;
            ajax.end = (ajax.draw - 1) * ajax.length;
            ajax.search.value = "";
            return ajax;
        },
        load: () => {
            draw();
            return ajax;
        },
        page: function (index) {
            ajax.draw = index;
            ajax.start = (ajax.draw - 1) * ajax.length;
            ajax.end = (ajax.draw - 1) * ajax.length;
            return ajax;
        }
    }
    var uploadOption = {
        accept: "",
        maximumFileSize: 25 * 1024 * 1024,//25MB
    }
    var iconOptions = {
        minimize: (className = "") => {
            return $(`<i class="ki-duotone ki-slider-vertical ${className}">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
</i>`);
        },
        maximize: (className = "") => {
            return $(`<i class="ki-duotone ki-maximize ${className}">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
 <span class="path4"></span>
 <span class="path5"></span>
</i>`);
        },
        folder: (className = "") => {
            return $(`<i class="ki-duotone ki-folder ${className}">
 <span class="path1"></span>
 <span class="path2"></span>
</i>`);
        },
    }
    var option = {
        viewMode: viewModeOptions.default,
        gallerySize: 140,//pixel
        timeOut: 150,//miliseconds,
        maximumFileSize: 5 * 1024 * 1024 * 1024,
        maximumImageResolution: 50,
        multiple: false
    }
    var selectionOption = {
        multiple: false
    }
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
    var emptyTemplate = $(`<div class="position-absolute start-0 top-0  w-100 h-100">
    <div class="d-flex flex-column flex-center w-100 h-100">
                        <img src = "/admin/assets/media/illustrations/sketchy-1/5.png" class= "mw-400px" >
                        <div class="fs-1 fw-bolder text-dark mb-4" > Thư mục này trống!</div>
                        <div class="fs-6" >Tạo thư mục mới hoặc tải tệp tin! </div>
                        </div></div>`);
    var uploadEl = $(`<input type="file" class="d-none" accept="" multiple/>`);
    var infoSidebar = $(`<form class="card rounded-top-0 rounded-start-0  min-w-300px mw-300px">
        <div class="card-header border-0 min-h-20px p-2 px-5">
          <div class="card-title my-0"></div>
          <div class="card-toolbar flex-row-fluid justify-content-end my-0">
            <button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-action="close" data-bs-toggle="tooltip" title="Đóng">
                     <i class="ki-solid ki-arrow-right fs-3 text-primary"></i>
                </button>
          </div>
        </div>
        <div class="card-body p-2 px-5 d-flex flex-column gap-5 ">
            <div class="fv-row" id="directory-recordsTotal">
                <label class="form-label fs-8 fw-light text-muted">Số lượng bản ghi</label>
                <div name="recordsTotal">0</div> 
            </div>
             <div class="fv-row" id="directory-allowed-extensions">
                <label class="form-label fs-8 fw-light text-muted">Extension cho phép</label>
                <div class="d-flex flex-wrap gap-2" name="allowed-extensions">Không giới hạn</div> 
            </div>
             <div class="fv-row" id="directory-allowed-extensions">
                <label class="form-label fs-8 fw-light text-muted">Giới hạn tệp tin</label>
                <div class="d-flex flex-column gap-1 fs-7" name="allowed-extensions">
                    <div class="d-flex justify-content-between">
                        <span>Kích thước tệp tối đa</span>
                        <span>${convertBytes(option.maximumFileSize)}</span>
                    </div>
                    <div class="separator"></div>
                    <div class="d-flex justify-content-between">
                        <span>Độ phân giải hình ảnh tối đa</span>
                        <span>${option.maximumImageResolution} MP</span>
                    </div>
                </div> 
            </div>
        </div>
        <div class="card-footer border-0  p-2 px-5">
            <div class="d-flex justify-content-end fade show" data-control="toolbar" >
            <!--begin::Button-->
            <button type="submit" class="btn btn-primary btn-sm me-5" >
                <span class="indicator-label">
                    Lưu
                </span>
                <span class="indicator-progress">
                    Vui lòng đợi... <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
            </button>
            <!--end::Button-->
             <!--begin::Button-->
             <button type="reset" class="btn btn-light btn-sm" >
                Hủy
            </a>
            <!--end::Button-->
        </div>
        </div>
    </form>`).hide();
    var overlayUpload = $(`<div class="bg-dark bg-opacity-25 box-overlay fixed fade">
                                <div class="card control-container shadow-sm w-400px mw-400px">
    <div class="card-header">
        <h3 class="card-title">
        <i class="ki-duotone ki-exit-up fs-2x me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
</i>
        Tải lên tệp tin</h3>
    </div>
    <div class="card-body">
       <div class="d-flex align-items-center flex-column" data-control="progress">
                        <div class="d-flex justify-content-between w-100 mt-auto mb-2">
                            <span class="fw-semibold fs-6 text-gray-500" role="title">Đang tải 5 tệp tin</span>
                            <span class="fw-bold fs-6" role="percent">0%</span>
                        </div>

                        <div class="h-5px mx-3 w-100 bg-light mb-3">
                            <div class="bg-success rounded h-5px" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="d-flex justify-content-between w-100 mt-auto">
                            <span class="fw-semibold fs-8 text-gray-700" role="time">5 MB/6 GB (Còn khoảng 5 phút)</span>
                        </div>
                    </div>
    </div>
</div>
                            </div>`).hide();
    var overlayAddFolder = $(`<div class="bg-dark bg-opacity-25 box-overlay fade">
                                <div class="card control-container shadow-sm w-400px mw-400px">
    <div class="card-header">
        <h3 class="card-title">
        <i class="ki-duotone ki-add-folder fs-2x me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
        Thêm mới thư mục</h3>
    </div>
    <div class="card-body">
        <form>
            <div class="mb-10 fv-row">
                <label for="folderNameInput" class="required form-label">Tên</label>
                <input type="text" id="folderNameInput" name="new_folder_name" class="form-control" placeholder=""/>
            </div>
            <div class="d-flex justify-content-end">
            <!--begin::Button-->
            <button type="submit" id="filemanager_add_category_submit" class="btn btn-primary btn-sm me-5">
                <span class="indicator-label">
                    Lưu
                </span>
                <span class="indicator-progress">
                    Vui lòng đợi... <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
            </button>
            <!--end::Button-->
             <!--begin::Button-->
             <button type="reset" class="btn btn-light btn-sm">
                Hủy
            </a>
            <!--end::Button-->
        </div>
        </form>
    </div>
</div>
                            </div>`).hide();
    var header = $(`<div class="card card-flush pb-0 border-top-0 border-start-0 border-end-0 rounded-bottom-0 w-100 position-relative">
    <div class="card-header p-2">
        <div class="d-flex align-items-center justify-content-end">
            <div class="symbol symbol-circle me-5">
                <div class="symbol-label bg-transparent text-primary border border-secondary border-dashed">
                    <i class="ki-duotone ki-abstract-47 fs-2x text-primary"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <div class="d-flex flex-column">
                <h2 class="mb-1">Quản lý tệp tin</h2>
                <div class="text-muted fw-bold">
                    <a href="#" >Digital Innovation</a> <span class="mx-3">|</span> <a href="#">Quản lý tệp tin</a> <span class="mx-3">|</span> <span id="file-manager-length">2.6 GB</span> <span class="mx-3">|</span> <span id="file-manager-record-total" data-kt-countup="true"
            data-kt-countup-value="0">0 </span> items
                </div>
            </div>
                <div class="btn btn-sm btn-icon btn-active-color-primary position-absolute end-0 me-3" data-bs-dismiss="modal">
                    <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
                </div>
        </div>
    </div>
</div>`);
    var btnBack = $(`<button class="btn btn-sm btn-icon btn-active-light-primary me-3" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Quay lại">
                 <i class="ki-solid ki-arrow-left fs-3 text-primary"></i>
            </button>`);
    var btnInfo = $(`<button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Thông tin">
                 <i class="ki-duotone ki-information-5 fs-3 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
</i>
            </button>`);
    var btnMore = $(`<button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Thao tác" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                 <i class="ki-solid  ki-dots-vertical  fs-2x text-primary">
</i>
            </button>`);
    var btnSearch = $(` <button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Tìm kiếm">
                 <i class="ki-duotone ki-magnifier fs-3 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
            </button>`);
    var btnZoom = $(`<button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Toàn màn hình"></button>`)
        .append(iconOptions.maximize("fs-3 text-primary"));
    var btnSetting = $(` <button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Cài đặt">
                <i class="ki-duotone ki-setting-3 fs-3 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
 <span class="path4"></span>
 <span class="path5"></span>
</i>
            </button>`);
    var btnAddFolder = $(` <a href="#!" class="menu-link px-3">
                <i class="ki-duotone ki-add-folder fs-3 me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
          Tạo mới thư mục
        </a>`);
    var moreMenu = $(`<div class="menu menu-sub rounded menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-175px py-4" data-kt-menu="true"></div>`)
    moreMenu.append($(`<div class="menu-item px-3"></div>`).append(btnAddFolder));
    var btnUploadFile = $(`<a href="#!" class="menu-link px-3">
                <i class="ki-duotone ki-file-up fs-3 me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
            Tải lên tệp tin
        </a>`);
    var btnChoose = $(`<button class="btn text-nowrap btn-primary btn-sm" disabled>
            <i class="ki-duotone ki-check fs-3"></i> Chọn
        </button>`)
    var pagination = $(`<ul class="pagination w-100 fade show">
    <li class="page-item previous disabled"><a href="#" class="page-link"><i class="previous"></i></a></li>
    <li class="page-item next"><a href="#"  class="page-link"><i class="next"></i></a></li>
</ul>`)
    var sidebar = $(`<div class="border-end">
<div class="menu menu-column menu-title-gray-700 menu-icon-gray-500 menu-arrow-gray-500 menu-bullet-gray-500 menu-arrow-gray-500 menu-state-bg fw-semibold w-200px" data-kt-menu="true"></div>
    </div>`);
    var fileContainer = $(`<div class='w-100 position-relative'>
    <div class="card file-manager-container">
    <div class="card-header file-manager-toolbar align-items-center min-h-20px p-0 gap-2 gap-md-5 p-2 px-5">
        <div class="card-title my-0"><span class="text">Digital Innovation</span></div>
        <div class="card-toolbar flex-row-fluid justify-content-end gap-1 my-0" ><div>
            <div class="input-group input-group-sm btn-active-light-primary">
    <span class="input-group-text btn btn-primary btn-sm border-end" data-action="upload">
        <i class="ki-duotone ki-exit-up  fs-4">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
        Tải lên
    </span>
    
        <!--end::Menu-->
         <span  class="input-group-text btn btn-sm btn-primary  btn-icon rounded-end" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                        <i class="ki-duotone ki-down fs-3"></i>                    </span>
                    <!--begin::Menu-->
<div class="menu menu-sub rounded menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-175px py-4" data-kt-menu="true">
    <!--begin::Menu item-->
    <div class="menu-item px-3">
                <a href="#!" class="menu-link px-3" data-bs-toggle="tooltip" title="Sắp ra mắt">
                 <i class="ki-duotone ki-folder-up fs-3 me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
                    Tải lên thư mục
        </a>
    </div>
    <!--end::Menu item-->
</div>
</div>
</div>
        </div>
    </div>
                 <div class="card-body file-manager-body position-relative p-0">
                    <div class="hover-scroll-y p-3 pe-1 bg-light-secondary file-manager-gallery" style="min-height: 748px;max-height: 748px;--file-gallery-size: ${option.gallerySize}px">
                        <div class="file-manager-grid"></div>
                    </div>
                      </div>
                    <div class="card-footer file-manager-footer p-2 px-5">
                    </div
    </div>`);

    var container = $(`<div class="modal modal-xl file-manager-wrapper fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false">
    <div class="modal-dialog file-manager-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header p-0 border-0 justify-content-end"></div>
            <div class="modal-body p-0 overlay overflow-hidden"></div>
        </div>
    </div>
</div>`);
    toolbar = fileContainer.find(".file-manager-toolbar");
    toolbar.find(".menu-sub").prepend($(`<div class="menu-item px-3"></div>`).append(btnUploadFile));
    toolbar.title = function (title = "Digital Innovation") {
        toolbar.find(".card-title .text").text(title)
    }
    toolbar.find(".card-title").prepend(btnBack);
    toolbar.find(".card-toolbar").prepend(moreMenu).prepend(btnMore).prepend(btnSetting).prepend(btnZoom).prepend(btnSearch).prepend(btnInfo);

    var body = $("<div class='d-flex h-100'></div>");
    fileContainer.find(".file-manager-toolbar").append(toolbar);
    fileContainer.find(".file-manager-body").append(emptyTemplate);
    fileContainer.find(".file-manager-footer").append(pagination).append(btnChoose);
    body.append(sidebar).append(fileContainer).append(infoSidebar);
    container.find(".modal-header").append(header);
    container.find(".modal-body").append(body).append(overlayAddFolder).append(overlayUpload).append(uploadEl);
    const show = async function () {
        getAllInfo();
        await getListFolder();
        if (targetEl) {
            uploadOption.accept = targetEl.attr("file-accept") || "";
            ajax.accept = uploadOption.accept;
            var max = targetEl.attr("max");
            if (max) {
                uploadOption.maximumFileSize = parseInt(max);
            }
            else {
                uploadOption.maximumFileSize = option.maximumFileSize;//25 MB
            }
            if (uploadOption.accept) {
                uploadEl.attr("accept", t.acceptType);
            }
            else {
                uploadEl.attr("accept", "");
            }
            if (targetEl.prop("multiple")) {
                selectionOption.multiple = true;
            }
            else {
                selectionOption.multiple = option.multiple;
            }
        }
        else {
            uploadOption.maximumFileSize = 250 * 1024 * 1024;
            uploadEl.attr("accept", allowedExtensions.map(c => ` .${c}`).join(","));
            selectionOption.multiple = option.multiple;
        }
        ajax.regen().load();
        container.modal("show");
    }
    const getListFolder = async function () {
        var menuSidebar = sidebar.find("[data-kt-menu=true]");
        try {
            var res = await httpService.getAsync("file-manager/api/list-folder");
            if (res.isSucceeded) {
                menuSidebar.html("").trigger("change");
                folderData = res.resources;
                folderData.forEach((item) => {
                    var isParentFolder = folderData.findIndex(c => c.parentId == item.id) > 0;
                    var menuItem = $(`<div class="menu-item ${item.parentId == null ? `menu-sub-indention` : ``} ${isParentFolder ? `menu-accordion` : ``}" ${isParentFolder ? `data-kt-menu-trigger="click"` : ``}>
        <a href="#" data-id="${item.id}" class="menu-link py-3 me-0">
            <span class="menu-icon ">
                <span class="menu-arrow me-2 ${isParentFolder ? `` : `fade`}"></span>
                <i class="ki-duotone ki-folder fs-3 text-warning"><span class="path1"></span><span class="path2"></span></i>
            </span>
            <span class="menu-title ms-2">${item.name}</span> 
        </a></div>`)
                    if (isParentFolder) {
                        menuItem.append(`<div class="menu-sub menu-sub-accordion" data-id=${item.id}></div>`);
                    }
                    if (item.parentId == null) {
                        menuSidebar.append(menuItem);
                    }
                    else {
                        menuSidebar.find(`.menu-sub[data-id=${item.parentId}]`).append(menuItem);
                    }
                })
                KTMenu.createInstances();
                activeFolder();
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const openFolder = function () {

    }

    const initPagination = function (totalPages, currentPage) {
        pagination.html("").removeClass('show');
        if (totalPages == 0) {
            return;
        }
        // Nút "Previous"
        const prevClass = currentPage === 1 ? 'disabled' : '';
        pagination.append(`
        <li class="page-item previous ${prevClass}">
            <a href="#" class="page-link" data-page="${currentPage - 1}">
                <i class="previous"></i>
            </a>
        </li>
    `);

        // Các trang số
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            pagination.append(`
            <li class="page-item ${activeClass}">
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            </li>
        `);
        }

        // Nút "Next"
        const nextClass = currentPage === totalPages ? 'disabled' : '';
        pagination.append(`
        <li class="page-item next ${nextClass}">
            <a href="#" class="page-link" data-page="${currentPage + 1}">
                <i class="next"></i>
            </a>
        </li>
    `);
        pagination.addClass('show')
    }

    const draw = async function () {
        try {
            var res = await httpService.postAsync("file-manager/api/list-server-side", ajax);
            if (res.data) {
                var parentEl = fileContainer.find(".file-manager-grid").html("");
                if (res.data == undefined || res.data == null || res.data.length == 0) {
                    ;
                    emptyTemplate.show();
                }
                else {
                    emptyTemplate.hide();
                    dataSrc = res.data;
                    res.data.forEach((item) => {
                        let createdTime = moment(item.createdTime).format("DD/MM/YYYY HH:mm:ss");
                        var itemEl = $(`<div class="gallery-item card rounded-0" data-id="${item.id}" title="${item.name + ` Kích cỡ: ` + convertBytes(item.size) + ` Ngày tạo: ` + createdTime}">
                        <div class="gallery-item-figure"></div>
                        <div class="card-footer p-2 fw-semibold">
                            <div class="gallery-item-name fs-7">${item.name}</div>
                        </div>
                    </div>`);
                        var figure = itemEl.find(".gallery-item-figure");
                        if (item.isDirectory) {
                            itemEl.attr('data-is-directory', true)
                            itemEl.find(".gallery-item-figure")
                                .append($(`<div class="h-100 d-flex justify-content-center align-items-center"></div>`)
                                    .append(iconOptions.folder("text-warning fs-5x")));
                        }
                        else {
                            itemEl.attr('data-is-directory', false)
                                .append(`<div class="bg-dark-inverse position-absolute start-0 top-0 px-2 fs-7">${item.extension.toUpperCase()}</div>`)
                                .find(".card-footer")
                                .append(`<button class="file_check position-absolute end-0 bottom-0 fs-3 me-2 mb-2 btn btn-icon"><i class="ki-duotone ki-check"></i></button>`);
                            var mime = item.mimeType;
                            var thumbContent = "";
                            fileThumbPath = item.thumbnailPath
                            if (mime.includes("image")) {
                                thumbContent = `<img class="item_img" alt="alt" src="${fileThumbPath}" />
											<a class="d-none" data-fslightbox="file_gallery" href="/upload${item.path}">
											</a>`;
                            }
                            else if (mime.includes("video")) {
                                thumbContent = `<div class="d-flex thumb-icon d-block overlay">
                                                                                                            <span ><i class="fa-solid fa-video text-primary"></i></span>
                                                                                                                <a data-fslightbox="gallery-file" href="${fileFullPath}" class="overlay-layer card-rounded bg-dark bg-opacity-25">
                                                                                                            <i class="fa fa-eye  text-primary"></i>
                                                                                                                </a>
                                                                                        </div>`;
                            }
                            else if (mime.includes("audio")) {
                                thumbContent = `<div class="d-flex thumb-icon d-block overlay">
                                                                                                                    <span><i class="fa-solid fa-headphones text-primary"></i></span>
                                                                                                                        <a data-fslightbox="gallery-file" href="${fileFullPath}" class="overlay-layer card-rounded bg-dark bg-opacity-25">
                                                                                                            <i class="fa fa-eye  text-primary"></i>
                                                                                                                </a>
                                                                                            </div>`;
                            }
                            else if (mime.includes("text")) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                <span><i class="fa-solid fa-file-lines text-primary" > </i></span>
                                                                                            </div>`;
                            }
                            else if (extensions.mcrsWord.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                <span><i class="fa-solid fa-file-word text-primary" > </i></span>
                                                                                                    </div>`;
                            }
                            else if (extensions.mcrsExcel.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                <span><i class="fa-solid fa-file-excel text-success" > </i></span>
                                                                                                    </div>`;
                            }
                            else if (extensions.PDF.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                    <span><i class="fa-solid fa-file-pdf text-danger" > </i></span>
                                                                                                        </div>`;
                            }
                            else {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                        <i class="fa-solid fa-file">
</i>
                                                                                                </div>`;
                            }
                            $(figure).append(thumbContent);
                        }
                        parentEl.append(itemEl);
                    })
                }
                refreshFsLightbox();
                infoSidebar.find("[name=recordsTotal]").text(res.recordsTotal);
                const totalPages = Math.ceil(res.recordsTotal / ajax.length);
                const startIndex = (ajax.draw - 1) * ajax.length;
                const endIndex = Math.min(startIndex + ajax.length, res.recordsFiltered);
                const currentData = res.data.slice(startIndex, endIndex);
                initPagination(totalPages, ajax.draw);
                selectedData.clear().change();
            }
        } catch (e) {
            console.warn(e);
        }
    }
    const handleAddFolder = function () {
        // Define template interactive elements
        const rowForm = overlayAddFolder.find('form');
        const rowInput = overlayAddFolder.find('input[name=new_folder_name]');
        const rowButton = overlayAddFolder.find('[type=submit]');
        const cancelButton = overlayAddFolder.find('[type=reset]');
        // Define validator
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            rowForm[0],
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
        rowForm.on('submit', e => {
            e.preventDefault();

            // Activate indicator
            rowButton.attr("data-kt-indicator", "on");

            // Validate form before submit
            if (validator) {
                validator.validate().then(async function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Simulate process for demo only
                        try {
                            var obj = {
                                "name": rowInput.val().trim(),
                                "parentId": ajax.parentId
                            };
                            var res = await httpService.postAsync("file-manager/api/add-folder", obj);
                            if (res.isSucceeded) {
                                toastr.success('Thư mục ' + rowInput.val() + ' đã được thêm mới thành công!');
                                getListFolder();
                                draw();
                                overlayAddFolder.removeClass("show");
                                setTimeout(function () {
                                    overlayAddFolder.hide();
                                    validator.resetForm(true);
                                }, option.timeOut);
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
                            rowButton.removeAttr("data-kt-indicator");
                        }
                    } else {
                        // Disable indicator
                        rowButton.removeAttr("data-kt-indicator");
                    }
                });
            }
        });

        // Handle cancel new folder button
        cancelButton.on('click', e => {
            e.preventDefault();
            overlayAddFolder.removeClass("show");
            setTimeout(function () {
                overlayAddFolder.hide();
                toastr.error('Đã hủy việc tạo thư mục mới!');
                validator.resetForm(true);
            }, option.timeOut);
        });
        // Handle click action
        btnAddFolder.on('click', e => {
            e.preventDefault();

            overlayAddFolder.show();
            overlayAddFolder.addClass("show");
            overlayAddFolder.find("input[name=new_folder_name]").focus();

        });
    }
    const getAllInfo = async function () {
        try {
            var res = await httpService.getAsync("file-manager/api/get-info");
            if (res.isSucceeded) {
                $("#file-manager-length").text(convertBytes(res.resources.length));
                const count1 = new countUp.CountUp("file-manager-record-total");
                count1.update(res.resources.recordTotal);
            }
        }
        catch (e) {
            console.warn(e);
        }

    }
    const showViewMode = (viewMode = null) => {
        var showViewMode = viewMode == null ? option.viewMode : viewMode;
        if (showViewMode == viewModeOptions.fullscreen && !container.hasClass("modal-fullscreen")) {
            container.find(".modal-dialog").addClass("modal-fullscreen");
        }
        else {
            container.find(".modal-dialog").removeClass("modal-fullscreen");
        }
        initTooltip();
    }
    function initTooltip(element = container) {
        var target = $(element).find(`[data-bs-toggle="tooltip"]`);
        try {
            target.tooltip("dispose");
        } catch (e) {
            console.warn(e);
        }
        finally {
            target.tooltip();
        }
    }

    function activeFolder(id = ajax.parentId) {
        ajax.parentId = id;
        sidebar.find(".menu-item.active").removeClass("active");
        var folder = folderData.find(c => c.id == ajax.parentId);
        if (folder) {
            toolbar.title(folder.name);
            btnBack.show();
        }
        else {
            ajax.parentId = null;
            btnBack.hide();
            toolbar.title();
        }
        var menuEl = sidebar.find("[data-kt-menu=true]");
        var menu = KTMenu.getInstance(menuEl[0]);
        var menuItems = menuEl.find(".menu-item.hover.showing").removeClass("hover").removeClass("showing");
        menuEl.find(".menu-link.active").removeClass("active");
        menu.update();
        if (ajax.parentId != null) {
            var linkEl = menuEl.find(`.menu-link[data-id=${ajax.parentId}]`);
            var showItem = linkEl.parent(".menu-item").addClass("active");
            var parentEls = menu.getItemParentElements(showItem[0]);
            menu.show(showItem[0]);
            menu.setActiveLink(linkEl[0]);
            parentEls.forEach((item) => {
                menu.show(item);
            })
        }
        selectedData.change();
    }

    const handleFolder = async function () {
        sidebar.on("click", ".menu-link", function (e) {
            if ($(this).hasClass("active")) {
                e.preventDefault();
                return;
            }
            var id = $(this).data("id");
            activeFolder(id); draw();
        })
    }
    const handleAction = async function () {
        btnBack.on("click", function (e) {
            let folder = folderData.find(c => c.id == ajax.parentId);
            if (folder) {
                activeFolder(folder.parentId); draw();
                btnBack.blur();
            }
        })
        fileContainer.on("dblclick", "[data-is-directory=true]", function (e) {
            e.preventDefault();
            let id = $(this).data("id");
            if (id) {
                activeFolder(id); draw();
            }
        })
        $(container).on("click", ".control-container", function (e) {
            e.stopPropagation();
        })
        $(container).on("click", ".box-overlay:not(.fixed)", function (e) {
            let target = $(this);
            target.removeClass("show");
            setTimeout(() => {
                target.hide();
            }, option.timeOut)
        })

        btnZoom.on("click", function (e) {
            btnZoom.find("i").remove();
            btnZoom.append(option.viewMode == viewModeOptions.fullscreen ? iconOptions.maximize('fs-3 text-primary') : iconOptions.minimize('fs-3 text-primary'))
                .attr("data-bs-original-title", option.viewMode == viewModeOptions.fullscreen ? "Toàn màn hình" : "Cửa sổ");
            if (option.viewMode == viewModeOptions.default) {
                option.viewMode = viewModeOptions.fullscreen;
                btnZoom.addClass("active");
            }
            else {
                option.viewMode = viewModeOptions.default;
                btnZoom.removeClass("active");
                btnZoom.trigger("blur");
            }
            showViewMode();
        });
    }

    const detail = async function (id) {
        try {
            var res = await httpService.getAsync(`file-manager/api/detail/${id}`);
            if (res.isSucceeded) {
                return res.resources;
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const handleInfo = async function () {
        const btnClose = infoSidebar.find("[data-action=close]");
        var title = infoSidebar.find(".card-title");
        var allowedExtensionsContent = infoSidebar.find("#directory-allowed-extensions");
        var toolBar = infoSidebar.find("[data-control=toolbar]")
        const showInfo = async function (id) {
            if (!btnInfo.hasClass("active")) {
                return;
            }
            var info = id == null ? {
                name: "Digital Innovation",
                isDirectory: true
            } : await detail(id);

            if (info) {
                if (info.isDirectory) {
                    title.html($(`<div class="d-flex align-items-center">${info.name}</div>`).prepend(iconOptions.folder("fs-3 me-2")));
                    if (allowedExtensions.length > 0) {
                        var content = allowedExtensionsContent.find("[name=allowed-extensions]").html("");
                        allowedExtensions.forEach((item) => {
                            content.append(`<span class="badge badge-secondary">.${item}</span>`)
                        })
                    }
                    else {
                        allowedExtensionsContent.find("[name=allowed-extensions]").html(`Không giới hạn`);
                    }
                    toolBar.removeClass("show");
                }
                else {
                    toolBar.addClass("show");
                }
            }
        }
        var oldEvent = selectedData.change;
        selectedData.change = function () {
            oldEvent();
            showInfo(ajax.parentId);
        }

        btnClose.on("click", function () {
            btnInfo.removeClass("active");
            infoSidebar.hide();
        })
        btnInfo.on("click", function () {
            var status = $(this).hasClass("active");
            if (status) {
                $(this).removeClass("active").trigger("blur");
                infoSidebar.hide();
            }
            else {
                $(this).addClass("active");
                infoSidebar.show();
            }
            selectedData.change();
        })
        infoSidebar.on("submit", function (e) {
            e.preventDefault();
        })
    }

    const handleWrapper = function () {
        $("[data-file-manager=true]").on("click", "[data-file-manager-action=change]", function (e) {
            e.preventDefault();
            targetEl = $(this).parent().find(".file-manager-wrapper");
            show();
        })
    }
    const handleHide = function () {
        container.on("hide.bs.modal", function (e) {
            if (uploadStatus) {
                e.preventDefault();
                Swal.fire({
                    text: "Bạn có chắc chắn muốn đóng, việc tải têp tin sẽ dừng lại?",
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
                    if (result.isConfirmed) {
                        uploadStatus = false;
                        container.modal("hide");
                    }
                });
            }
            else {
                targetEl = null;
            }
        });
    }
    function formatDuration(seconds) {
        if (seconds < 1) {
            return "0 giây";
        }
        const duration = moment.duration(seconds, 'seconds');
        const days = Math.floor(duration.asDays()); // Lấy phần nguyên của ngày
        const hours = duration.hours(); // Lấy phần giờ còn lại sau khi chia cho ngày
        const minutes = duration.minutes(); // Lấy phần phút còn lại sau khi chia cho giờ
        const remainingSeconds = duration.seconds(); // Lấy phần giây còn lại

        let result = '';

        if (days > 0) result += `${days} ngày `;
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút `;
        if (remainingSeconds > 0) result += `${remainingSeconds} giây`;
        return result.trim(); // Xóa khoảng trắng dư thừa
    }
    const handleUpload = function () {
        var uploadedSize = 0;
        var fileTotalSize = 0;
        var uploadNormalSpeed = 5;//5Mbps
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk;
        var btnUpload = toolbar.find("[data-action=upload]");
        var progress = overlayUpload.find("[data-control=progress]");
        var progressTitle = progress.find("[role=title]");
        var progressPercent = progress.find("[role=percent]");
        var progressEl = progress.find("[role=progressbar]");
        var progressTime = progress.find("[role=time]");
        btnUpload.on("click", function (e) {
            e.preventDefault();
            uploadEl.val(null).click();
        })
        btnUploadFile.on("click", function (e) {
            e.preventDefault();
            uploadEl.val(null).click();
        })
        btnUploadFile.on("click", function (e) {
            e.preventDefault();
        })

        //upload to server
        uploadEl.on("change", function () {
            try {
                uploadedSize = 0;
                fileTotalSize = 0;
                fileUploadedTotal = 0;
                var localTime = new Date().getTime();
                var uploadingSpeed = uploadNormalSpeed;
                var files = uploadEl[0].files;
                files.forEach(function (file) {
                    if (file.size > uploadOption.maximumFileSize) {
                        toastr.error(`Kích thước tối đa của tệp tin là ${convertBytes(uploadOption.maximumFileSize)}`);
                        throw `Invalid file size! maximum file size is ${convertBytes(uploadOption.maximumFileSize)}`;
                    }
                    fileTotalSize += file.size;
                })
                overlayUpload.show().addClass("show");
                uploadStatus = true;
                progressTitle.text(`Đang tải ${files.length} tệp tin`);
                progressPercent.text(`0%`);
                var beginTime = fileTotalSize / (uploadNormalSpeed * 1024 * 1024);
                progressTime.text(`${convertBytes(uploadedSize)} / ${convertBytes(fileTotalSize)} (Còn khoảng ${formatDuration(beginTime)})`);
                progressEl.css("width", "0%").attr("aria-valuenow", 0);
                var progessBarCheck = setInterval(function () {
                    var time = (fileTotalSize - uploadedSize) / (uploadingSpeed * 1024 * 1024);
                    progressTime.text(`${convertBytes(uploadedSize)} / ${convertBytes(fileTotalSize)} (Còn khoảng ${formatDuration(time)})`);
                    percent = (uploadedSize * 100 / fileTotalSize).toFixed(2);
                    progressPercent.text(`${percent}%`);
                    progressEl.css("width", `${percent}%`).attr("aria-valuenow", percent);
                    if (!uploadStatus) {
                        getAllInfo();
                        draw();
                        setTimeout(function () {
                            overlayUpload.removeClass("show");
                            progressEl.css("width", "0%").attr("aria-valuenow", 0);
                            overlayUpload.hide();
                        }, 500);
                        clearInterval(progessBarCheck);
                    }
                }, 500);

                files.forEach(function (file) {
                    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
                    let chunkIndex = 0;

                    async function uploadChunk() {
                        const start = chunkIndex * CHUNK_SIZE;
                        const end = Math.min(file.size, start + CHUNK_SIZE);
                        const chunk = file.slice(start, end);

                        const formData = new FormData();
                        formData.append('chunk', chunk);
                        formData.append('fileName', file.name);
                        formData.append('chunkIndex', chunkIndex);
                        formData.append('totalChunks', totalChunks);
                        if (ajax.parentId != null) {
                            formData.append('parentId', ajax.parentId);
                        }
                        formData.append('localTime', localTime);

                        try {
                            var startTime = new Date();
                            const res = await $.ajax({
                                url: '/file-manager/api/upload',
                                type: 'POST',
                                data: formData,
                                beforeSend: function (xhr) {
                                    if (localStorage.Authorization) {
                                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.Authorization);
                                    }
                                },
                                contentType: false,
                                processData: false,
                            });
                            var endTime = new Date();
                            uploadingSpeed = (chunk.size / (1024 * 1024)) * 1000 / (endTime.getTime() + 100 - startTime.getTime());
                            uploadedSize += chunk.size;
                            chunkIndex++;
                            if (res.isSucceeded) {
                                if (chunkIndex < totalChunks) {
                                    setTimeout(function () {
                                        uploadChunk(); // Upload next chunk
                                    }, 100)//mircro delay 
                                } else {
                                    fileUploadedTotal++;
                                    if (fileUploadedTotal == files.length) {
                                        uploadStatus = false;
                                        toastr.success('Tải tệp tin thành công!');
                                    }
                                }
                            }
                            else {
                                uploadStatus = false;
                                toastr.error('Đã có lỗi xảy ra khi tải tệp tin mới! Xin vui lòng thử lại sau!');
                            }

                        } catch (error) {
                            uploadStatus = false;
                            toastr.error('Đã có lỗi xảy ra khi tải tệp tin mới! Xin vui lòng thử lại sau!');
                        }
                    }

                    uploadChunk();
                })

            } catch (e) {
                console.warn(e);
            }
        })
    }
    const handleSelection = function () {
        let isCtrlPressed = false; // Biến để theo dõi trạng thái phím Ctrl

        // Lắng nghe sự kiện "keydown"
        document.addEventListener("keydown", (e) => {
            if (e.key === "Control") {
                isCtrlPressed = true;
            }
        });

        // Lắng nghe sự kiện "keyup"
        document.addEventListener("keyup", (e) => {
            if (e.key === "Control") {
                isCtrlPressed = false;
            }
        });
        selectedData.change = function () {
            if (selectedData.length > 0) {
                btnChoose.removeAttr("disabled")
            }
            else {
                btnChoose.attr("disabled", true);
            }
            return selectedData;
        }
        selectedData.clear = function () {
            while (selectedData.length > 0) {
                selectedData.splice(0, 1);
            }
            fileContainer.find(".gallery-item").removeClass("active");
            return selectedData;
        }

        fileContainer.find(".file-manager-grid").on("click", function (e) {
            if (e.target == this) {
                selectedData.clear().change();
            }
        })
        fileContainer.on("dblclick", ".file_check", function (e) {
            e.stopPropagation();
        });
        fileContainer.on("dblclick", ".gallery-item[data-is-directory=false]", function (e) {
            e.stopPropagation();
            let element = $(this).find("[data-fslightbox]");
            if (element.length > 0) {
                element.trigger("click")
            }
        });
        fileContainer.on("click", ".gallery-item[data-is-directory=false]:not(.active)", function (e) {
            e.stopPropagation();
            let element = $(this);
            let fileId = parseInt(element.data("id"));
            if (fileId) {
                let file = dataSrc.find(c => c.id == fileId);
                if (file) {
                    if (!selectionOption.multiple || !isCtrlPressed) {
                        selectedData.clear();
                    }
                    element.addClass("active");
                    selectedData.push(file);
                }
            }
            selectedData.change();
        });
        fileContainer.on("click", ".file_check", function (e) {
            e.stopPropagation();
            let element = $(this).parents(".gallery-item");
            let fileId = parseInt(element.data("id"));
            if (fileId) {
                if (element.hasClass("active")) {
                    let fileIndex = selectedData.findIndex(c => c.id == fileId);
                    element.removeClass("active");
                    selectedData.splice(fileIndex, 1);
                }
                else {
                    let file = dataSrc.find(c => c.id == fileId);
                    if (file) {
                        if (!selectionOption.multiple) {
                            selectedData.clear();
                        }
                        element.addClass("active");
                        selectedData.push(file);
                    }
                }
            }

            selectedData.change();
        });
        btnChoose.on('click', function (e) {
            e.preventDefault();
            if (selectedData.length == 0) {
                toastr.error("Bạn chưa chọn tệp tin!")
                return;
            }
            if (!targetEl) {
                return;
            }

            let tagName = targetEl.prop("tagName").toLowerCase();
            if (selectionOption.multiple) {//multiple file
                targetEl[0].targetFiles = t.dataSource.cache;
                let names = selectedData.map(c => c.name).join(",");
                if (tagName == "input") {
                    targetEl.val(names).trigger("change");
                }
                else if (tagName == "div") {
                    var html = '';
                    t.dataSource.cache.forEach(function (item, i) {
                        html += `<div class="image-input image-input-outline image-input-placeholder mb-7"><div class="w-150px h-150px" id="divImage${i}"><img id="postPhoto${i}" src="${item.path}" file-path="${item.path}" class="w-150px h-150px shadow-image object-fit-cover" file-accept="image/*"></div>
                                    <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow choseFile" data-fm-target="#postPhoto${i}" data-kt-image-input-action="change" data-bs-toggle="tooltip" aria-label="Change avatar" data-bs-original-title="Change avatar" data-kt-initialized="1">
                                                    <i class="ki-duotone ki-pencil fs-7">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                    </i>
                                                </label>
                                                  <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow remove-image" data-kt-image-input-action="remove" data-bs-toggle="tooltip" aria-label="Remove avatar" data-bs-original-title="Remove avatar" data-kt-initialized="1">
                                <i class="ki-duotone ki-cross fs-2">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                            </label>
                                                </div>`;
                    });
                    targetEl.html(html);
                }
                container.modal(hide);
                return;
            }
            let file = selectedData[0];
            let src = `/upload${file.path}`;
            targetEl.attr('file-path', src).trigger("change")
                .attr('file-target-id', file.id)
                .attr("file-size", file.size)
                .attr("file-mime", file.mimeType);
            if (tagName == "input") {
                if (btnTargetEl.attr("control-type") == "ckeditor4") {
                    CKEDITOR.dialog.getCurrent().getContentElement('info', 'txtUrl').setValue(src);
                }
                else if (targetEl.attr("data-type") == "URL") {
                    targetEl.val(src).trigger("change");
                }
                else {
                    targetEl.val(file.name).trigger("change");
                }
            }
            else if (tagName == "span") {
                targetEl.text(file.name);
            }
            else if (tagName == "img" || tagName == "source") {
                targetEl.attr("src", src).trigger("change-avatar");
            }
            else if (tagName == "div") {
                targetEl.css("background-image", `url('${src}')`);
            }
            container.modal('hide');
        })

        $(document).on('click', ".choseFile", function () {
            btnTargetEl = $(this);
            var elementId = btnTargetEl.attr("data-fm-target");
            if (elementId == undefined) {
                return;
            }
            targetEl = $(elementId);
            show();
        })
        $(document).on("click", "[data-file-manager-action=change]", function () {
            btnTargetEl = $(this);
            targetEl = btnTargetEl.parent(".file-manager").find(".file-manager-wrapper");
            if (targetEl.length > 0) {
                show();
            }
            else {
                targetEl = undefined;
            }
        })
        pagination.on("click", ".page-link:not(.active)", function (e) {
            e.preventDefault();
            var target = $(this);
            var pageIndex = target.data("page");
            if (pageIndex) {
                ajax.page(pageIndex); draw();
            }
        })
    }
    return {
        init: function () {
            $(document.body).append(container);
            KTMenu.createInstances();
            handleSelection();
            initTooltip();
            handleFolder();
            handleAction();
            handleAddFolder();
            handleInfo();
            handleWrapper();
            handleHide();
            handleUpload();
        },
        draw: draw,
        show: show
    }
}();

document.addEventListener("DOMContentLoaded", function () {
    FILE_MANAGER.init();
})