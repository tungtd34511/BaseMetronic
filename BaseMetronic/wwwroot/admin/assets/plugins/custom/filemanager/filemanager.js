"use trict";
const FILE_MANAGER = function () {
    var folderData = [];
    var viewModeOptions = {
        fullscreen: "fullscreen",
        default: "default"
    }
    var ajax = {
        parentId: null,
        length: 50,
        start: 0,
        draw: 1
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
        timeOut: 150,//miliseconds
    }
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
                    <a href="#">Digital Innovation</a> <span class="mx-3">|</span> <a href="#">Quản lý tệp tin</a> <span class="mx-3">|</span> <span id="file-manager-length">2.6 GB</span> <span class="mx-3">|</span> <span id="file-manager-record-total">758 </span> items
                </div>
            </div>
                <div class="btn btn-sm btn-icon btn-active-color-primary position-absolute end-0 me-3" data-bs-dismiss="modal">
                    <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
                </div>
        </div>
    </div>
</div>`);
    var btnInfo = $(`<button class="btn btn-sm btn-icon btn-active-light-primary" data-bs-trigger="hover" data-bs-toggle="tooltip" title="Thông tin">
                 <i class="ki-duotone ki-information-5 fs-3 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
 <span class="path3"></span>
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
    var toolbar = $(`<div class="card card-flush rounded-0">
        <div class="card-header align-items-center min-h-20px p-0 gap-2 gap-md-5 m-2 mx-5">
            <div class="card-title my-0"></div>
        <div class="card-toolbar flex-row-fluid justify-content-end gap-2 my-0" ><div>
            <div class="input-group input-group-sm btn-active-light-primary">
    <span class="input-group-text btn btn-primary btn-sm border-end">
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
                <a href="#!" class="menu-link px-3">
                <i class="ki-duotone ki-file-up fs-3 me-2 text-primary">
 <span class="path1"></span>
 <span class="path2"></span>
</i>
            Tải lên tệp tin
        </a>
    </div>
    <!--end::Menu item-->
    
    <!--begin::Menu item-->
    <div class="menu-item px-3">
                <a href="#!" class="menu-link px-3">
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
    </div>`)
    toolbar.find(".card-toolbar").prepend(btnSetting).prepend(btnZoom).prepend(btnSearch).prepend(btnInfo);
    var btnChoose = $(`<button class="btn text-nowrap btn-primary btn-sm" disabled>
            <i class="ki-duotone ki-check fs-3"></i> Chọn
        </button>`)
    var pagination = $(`<ul class="pagination w-100 fade show">
    <li class="page-item previous disabled"><a href="#" class="page-link"><i class="previous"></i></a></li>
    <li class="page-item next"><a href="#"  class="page-link"><i class="next"></i></a></li>
</ul>`)
    var sidebar = $(`<div class="border-end">
<div class="menu menu-column menu-title-gray-700 menu-icon-gray-500 menu-arrow-gray-500 menu-bullet-gray-500 menu-arrow-gray-500 menu-state-bg fw-semibold w-250px" data-kt-menu="true"></div>
    </div>`);
    var fileContainer = $(`<div class='w-100 position-relative'>
    <div class="d-flex flex-column">
    <div class="file-manager-toolbar "></div>
                 <div class="file-manager-body">
                    <div class="hover-scroll-y p-3 pe-1 bg-light-secondary file-manager-gallery" style="min-height: 736px;max-height: 736px;--file-gallery-size: ${option.gallerySize}px">
                        <div class="file-manager-grid"></div>
                    </div>
                      </div>
                    </div>
                    <div class="card card-flush position-absolute bottom-0 w-100 rounded-top-0 rounded-start-0 border-0">
                    <div class="card-header min-h-20px p-2 px-5">
                         <div class="card-toolbar flex-row-fluid flex-nowrap align-items-center gap-5 my-0 file-manager-footer"></div>
                         </div>
                    </div
    </div>`);
    
    var container = $(`<div class="modal modal-xl file-manager-wrapper fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog file-manager-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header p-0 border-0 justify-content-end"></div>
            <div class="modal-body p-0"></div>
        </div>
    </div>
</div>`);

    var body = $("<div class='d-flex h-100'></div>");
    fileContainer.find(".file-manager-toolbar").append(toolbar);
    fileContainer.find(".file-manager-footer").append(pagination).append(btnChoose);
    body.append(sidebar).append(fileContainer);
    container.find(".modal-header").append(header);
    container.find(".modal-body").append(body);

    const show = async function() {
        getAllInfo();
        await getListFolder();
        draw();
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
                    var menuItem = $(`<div class="menu-item ${isParentFolder && item.parentId == null ? `menu-sub-indention menu-accordion` : ``}" ${isParentFolder ?`data-kt-menu-trigger="click"`:``}>
        <a href="#" data-id="${item.id}" class="menu-link py-3">
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
                if (folderData.findIndex(c => c.id == ajax.parentId) < 0) {
                    ajax.parentId = null;
                }
                if (ajax.parentId != null) {
                    var menuEl = sidebar.find("[data-kt-menu=true]");
                    var menu = KTMenu.getInstance(menuEl[0]);
                    var linkEl = menuEl.find(`.menu-link[data-id=${ajax.parentId}]`);
                    var showItem = linkEl.parent(".menu-item").addClass("active");
                    var parentEls = menu.getItemParentElements(showItem[0]);
                    menu.show(showItem[0]);
                    menu.setActiveLink(linkEl[0]);
                    parentEls.forEach((item) => {
                        menu.show(item);
                    })
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const openFolder = function() {
        
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
            if (res.data.length > 0) {
                var parentEl = fileContainer.find(".file-manager-grid");
                res.data.forEach((item) => {
                    var itemEl = $(`<div class="gallery-item card rounded">
                        <div class="gallery-item-figure"></div>
                        <div class="card-footer p-2 fw-semibold">${item.name}</div>
                    </div>`);
                    if (item.isDirectory) {
                        itemEl.find(".gallery-item-figure")
                            .append($(`<div class="h-100 d-flex justify-content-center align-items-center"></div>`)
                            .append(iconOptions.folder("text-warning fs-5x")))
                    }
                    parentEl.append(itemEl);
                })

                const totalPages = Math.ceil(res.recordsTotal / ajax.length);
                const startIndex = (ajax.draw - 1) * ajax.length;
                const endIndex = Math.min(startIndex + ajax.length, res.recordsFiltered);
                const currentData = res.data.slice(startIndex, endIndex);
                initPagination(totalPages, ajax.draw);
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const getAllInfo = async function(){
        try {
            var res = await httpService.getAsync("file-manager/api/get-info");
            if (res.isSucceeded) {
                $("#file-manager-length").text(convertBytes(res.resources.length));
                $("#file-manager-record-total").text(res.resources.recordTotal);
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
    return {
        init: function () {
            $(document.body).append(container);
            KTMenu.createInstances();
            initTooltip();
            sidebar.on("click", ".menu-link", function (e) {
                sidebar.find(".menu-item.active").removeClass("active");
                $(this).parent(".menu-item").addClass("active");
            })
            btnZoom.on("click", function (e) {
                btnZoom.find("i").remove();
                btnZoom.append(option.viewMode == viewModeOptions.fullscreen ? iconOptions.maximize('fs-3 text-primary') : iconOptions.minimize('fs-3 text-primary'))
                    .attr("data-bs-original-title",option.viewMode == viewModeOptions.fullscreen ? "Toàn màn hình":"Cửa sổ");
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
            show();
        },
        draw: draw
    }
}();

document.addEventListener("DOMContentLoaded", function() {
    FILE_MANAGER.init();
})