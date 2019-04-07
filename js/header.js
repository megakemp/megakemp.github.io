jQuery(document).ready(function($){
    var header = $('.header');

    var scrolling = false,
    previousTop = 0,
    currentTop = 0,
    scrollDelta = 10,
    scrollOffset = 150;

    $(window).on('scroll', function() {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame)
                ? setTimeout(autoHideHeader, 250)
                : requestAnimationFrame(autoHideHeader);
        }
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        toggleHeaderVisibility(currentTop);

        previousTop = currentTop;
        scrolling = false;
    }

    function toggleHeaderVisibility(currentTop) {
        if (previousTop - currentTop > scrollDelta) {
            // Scrolling up
            header.removeClass('is-hidden');
        } else if ( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // Scrolling down
            header.addClass('is-hidden');
        }
    }
});
