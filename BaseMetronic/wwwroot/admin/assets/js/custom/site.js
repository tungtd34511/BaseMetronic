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