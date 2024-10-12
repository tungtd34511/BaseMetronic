"use strict";
function convertBytes(bytes) {
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (bytes >= gb) {
        return (bytes / gb).toFixed(2) + ' GB';
    } else if (bytes >= mb) {
        return (bytes / mb).toFixed(2) + ' MB';
    } else if (bytes >= kb) {
        return (bytes / kb).toFixed(2) + ' KB';
    } else {
        return bytes + ' bytes';
    }
}

const LAYOUT = function () {
    const SIDEBAR_MENU = function () {
        return {
            init: function () {
                const sidebar = document.querySelector("#kt_app_sidebar");
                const sidebarMenuScroll = document.querySelector("#kt_app_sidebar_menu_scroll");
                var menuElement = document.querySelector("#kt_app_sidebar_menu");
                const dashboardsCollapse = document.querySelector("#kt_app_sidebar_menu_dashboards_collapse");
                if (!sidebar) return; // Nếu không có sidebar, dừng tại đây

                var menu = KTMenu.getInstance(menuElement);
                const currentPath = window.location.pathname.toLowerCase();

                menuElement.querySelectorAll(".menu-link").forEach((e) => {
                    let menuPath = ($(e).attr("href") || "").toLowerCase();
                    // Kiểm tra xem đường dẫn hiện tại có khớp với menu
                    if (currentPath === menuPath) {
                        var showItem = $(e).parent(".menu-item")[0];
                        var parentItemElements = menu.getItemParentElements(showItem);
                        menu.show(showItem);
                        menu.setActiveLink(e);
                        parentItemElements.forEach((item) => {
                            menu.show(item);
                        })
                    }
                })

                const activeLink = sidebarMenuScroll.querySelector(".menu-link.active");
                // Nếu link active nằm trong collapse, mở collapse đó.
                if (activeLink && dashboardsCollapse.contains(activeLink)) {
                    KTUtil.triggerEvent(document.querySelector(`.collapsible[data-bs-toggle="collapse"][href="#kt_app_sidebar_menu_dashboards_collapse"]`), "click");
                }

                // 2. Cuộn đến menu-link "active" nếu không nhìn thấy trong sidebar
                if (sidebarMenuScroll) {
                    if (activeLink && !KTUtil.isVisibleInContainer(activeLink, sidebarMenuScroll)) {
                        sidebarMenuScroll.scroll({
                            top: KTUtil.getRelativeTopPosition(activeLink, sidebarMenuScroll),
                            behavior: "smooth"
                        });
                    }
                }
            }
        }
    }();

    return {
        init: function () {
            SIDEBAR_MENU.init();
        }
    }
}();

KTUtil.onDOMContentLoaded(() => {
    LAYOUT.init();
});