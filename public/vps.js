$(document).keydown(function(event) {
    if (event.keyCode == 123) { // Prevent F12
        alert('F12 key click disabled')
        return false;
    } else if (event.shiftKey && event.keyCode == 73) { // Prevent Ctrl+Shift+I  
        alert('Shift Key click disabled')
        return false;
    }
});

$(document).on("contextmenu", function(e) {
    alert('right click disabled')
    e.preventDefault();
});