var keys = [37, 38, 39, 40],
    nanoOptions = {
        preventPageScrolling: true,
        sliderMinHeight: 40,
        sliderMaxHeight: 200,
        disableResize: true,
        alwaysVisible: true
    };

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function addComment() {
    var popupPosTop;
    popupPosTop = $('.c-form__result').offset().top - window.innerHeight / 2 + 110;
    $('.c-form').addClass('_submitted');
    $('html, body').animate({
        scrollTop: popupPosTop
    }, 70);
}

function wheel(e) {
    preventDefault(e);
}

function disable_scroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
}

function disableLikeButton() {
    var votes = getCookie('BITRIX_SM_votes');
    if (votes) {
        votes = JSON.parse(votes);
        $('.c-like__button').each(function(){
            if ($.inArray($(this).attr('data-id'), votes) >= 0) {
                $(this).attr('disabled','disabled');
            }
        })
    }
}

function preventElementScroll(el, inertia) {
    $(el).on('mousewheel DOMMouseScroll', function (e) {
        var e0 = e.originalEvent;
        var delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += ( delta < 0 ? 1 : -1 ) * inertia;
        e.preventDefault();
    });
}

function addItemIzo(el, url) {
    $.ajax({
        url: url,
        type: "get",
        success: function success(data) {
            var data = $.parseHTML('<div>' + data + '</div>', document, true);
            var $target = $('[data-grid="' + el.attr('data-izo') + '"]');
            var moreHtml = $(data).find('[data-izo="' + el.attr('data-izo') + '"]').parent().html();
            var position = $('.c-showMore').offset().top;
            if (!$(data).find('[data-grid]').hasClass('js-not-izo')) {
                $target.isotope('insert', $(data).find('[data-grid]'));
            } else {
                $target.append($(data).find('[data-grid]').html());
            }
            if ($('.c-like__button').length > 0) {
                disableLikeButton();
            }
            if (moreHtml) {
                el.parent().html(moreHtml);
            } else {
                el.parent().hide();
            }
            disable_scroll();
            setTimeout(function () {
                $('body, html').stop(true, true).animate({ scrollTop: position }, 700, function () {
                    $target.removeClass('_loading');
                    enable_scroll();
                    lazyImage();
                });
            }, 750);
        },
        error: function error() {
            setTimeout(function () {
                el.append('<span class="error">ÐžÑˆÐ¸Ð±ÐºÐ°.</span>');
            }, 1000);
        }
    });
}

function overflowMenus() {
    $('.nano').nanoScroller({ destroy: true });
    $('.c-overflow').each(function () {
        var overWidth = $(this).width(),
            overItem = $(this).find('.c-overflow__list').children();
        var overItemsWidth = 0;
        overItem.each(function () {
            if ($(this).position().top > 0) {
                $(this).addClass('is_overflow').attr('tabindex', '-1');
            } else {
                $(this).removeClass('is_overflow').attr('tabindex', '0');
            }
        });
        var hiddenCount = overItem.length + $(this).find('.is_overflow').length - overItem.length,
            shownCount = $(this).find('.is_overflow').prev().index();
        $(this).attr('data-hidden', hiddenCount);
        $(this).find('.c-dropdown__list').children().hide(); //.css('color', 'red');
        $(this).find('.c-dropdown__list').children(':gt("' + shownCount + '")').show(); //.css('color', 'green');
        // $(this).find('small').text('Ð¡ÐºÑ€Ñ‹Ñ‚Ð¾: '+hiddenCount+', ÐŸÐ¾ÐºÐ°Ð·Ð°Ð½Ð¾: '+shownCount);
    });
    $('.nano').nanoScroller(nanoOptions);
}

function lazyImage() {
    var bLazy = new Blazy({
        selector: '.b-cardList .b-card__image',
        offset: 150,
        error: function error(elem) {
            $(elem).css('background-image', 'url(/local/templates/mvkus/images/no-image.jpg)');
        }
    });
}

function commentsClose(timeout) {
    var posTop = $('#commentComponent').offset().top - 30;
    setTimeout(function () {
        $('html, body').animate({ scrollTop: posTop }, 350);
        $('#commentForm').slideUp(400);
    }, timeout);
    setTimeout(function () {
        $('#commentForm').slideDown(400).find('.c-form_comments').removeClass('_submitted').trigger('reset');
    }, timeout * 10);
}

var tmp = null;
var horoList = $('.c-horolist');
var horoListOpts = {
    accessibility: false,
    variableWidth: false,
    dots: false,
    arrows: true,
    slidesToShow: 1,
    prevArrow: '<div class="slick-prev slick-arrow_horo"></div>',
    nextArrow: '<div class="slick-next slick-arrow_horo"></div>'
};

function horoScope() {
    if (window.innerWidth < 768) {
        tmp = horoList.slick(horoListOpts);
    } else {
        if (tmp === null) return;
        tmp = tmp.slick('unslick');
    }
}

function missClick(el) {
    $(document).on('click', function (e) {
        if (!$(e.target).closest(el).length && $(el).find('input[type="text"]').prop('value') == '') {
            $(el).removeClass('is_toggled').find('.is_toggled').removeClass('is_toggled');
        }
    });
}

var resizeWindFunc = debounce(function () {
    overflowMenus();
    horoScope();
    lazyImage();
    $('.c-dropdown').removeClass('is_toggled');
}, 200);

$(function () {
    horoScope();
    lazyImage();
    missClick('.b-search_header');
    $('.c-slider_mTube').slick({
        accessibility: false,
        variableWidth: false,
        slidesToShow: 4,
        edgeFriction: 0,
        slidesToScroll: 4,
        arrows: false,
        dots: true,
        prevArrow: '<div class="slick-prev slick-arrow_mTube"></div>',
        nextArrow: '<div class="slick-next slick-arrow_mTube"></div>',
        lazyLoad: 'ondemand',
        responsive: [{
            breakpoint: 1400,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        }, {
            breakpoint: 768,
            settings: {
                arrows: true,
                centerMode: true,
                variableWidth: true,
                slidesToShow: 1
            }
        }, {
            breakpoint: 500,
            settings: {
                arrows: true,
                centerMode: true,
                variableWidth: true,
                slidesToShow: 1
            }
        }]
    });
    $('.c-slider_singlePicture').slick({
        accessibility: false,
        slidesToShow: 1,
        edgeFriction: 0,
        arrows: true,
        fade: true,
        dots: true,
        prevArrow: '<div class="slick-prev"></div>',
        nextArrow: '<div class="slick-next"></div>',
        lazyLoad: 'ondemand',
        responsive: [{
            breakpoint: 768,
            settings: {
                arrows: false,
                slidesToShow: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: false,
                slidesToShow: 1
            }
        }]
    });
    $('.c-slider_mAdv').slick({
        accessibility: false,
        slidesToShow: 1,
        edgeFriction: 0,
        arrows: false,
        dots: true,
        lazyLoad: 'ondemand'
    });
    $('.c-slider_topNews').slick({
        accessibility: false,
        slidesToShow: 1,
        arrows: false,
        fade: true,
        dots: true
    });
    $('.c-slider').on('lazyLoadError', function (event, slick, image, imageSource) {
        image.parent().css('background-image', 'url(/local/templates/mvkus/images/no-image.jpg)');
    }).on('lazyLoaded', function (event, slick, image, imageSource) {
        image.parent().css('background-image', 'url(' + imageSource + ')');
    }).on('breakpoint', function () {
        $('.slick-lazyload-error').parent().css('background-image', 'url(/local/templates/mvkus/images/no-image.jpg)');
    });
    var $grid = $('[data-grid]');
    if (!$grid.hasClass('js-not-izo')) {
        $grid.isotope({
            layoutMode: 'masonry',
            itemSelector: '.b-card',
            percentPosition: true,
            masonry: {
                columnWidth: $grid.find('.b-card:not(.fullWidth)')[1]
            }
        });
    }
    $('body').on('click', '[data-izo]', function (e) {
        e.preventDefault();
        var $that = $(this),
            izoUrl = $that.attr('data-href');
        if ($that.hasClass('_loading')) {
            return;
        }
        $that.addClass('_loading').addClass('disabled');
        $('[data-grid="' + $that.attr('data-izo') + '"]').addClass('_loading');
        addItemIzo($that, izoUrl);
    });
    $('[data-toggle]').on('click', function (e) {
        //e.preventDefault();
        var $el = $(this).attr('data-toggle');
        $(this).toggleClass('is_toggled');
        $($el).toggleClass('is_toggled');
    });
    $('.c-dropdown__toggler').on('click', function (e) {
        e.preventDefault();
        $(this).parent().toggleClass('is_toggled').siblings().removeClass('is_toggled');
    });
    $(document).click(function (e) {
        if ($(e.target).closest('.c-dropdown').length) return;
        $('.c-dropdown').removeClass('is_toggled');
    });
    $('.c-dropdown .c-checkbox').on('click', function () {
        var $that = $(this),
            $parent = $that.closest('.c-dropdown');
        var $textCounter = $parent.find('.c-dropdown__value small'),
            currentValueCount = $parent.find('.c-checkbox input:checked').length;
        if (currentValueCount > 0) {
            $textCounter.text('(' + currentValueCount + ')');
        } else {
            $textCounter.text('');
        }
    });
    overflowMenus();
    $('.c-dropdown').each(function () {
        var counter = $(this).find('.c-dropdown__value small'),
            currentValue = $(this).find('.c-checkbox input:checked').length;
        if (currentValue <= 0) {
            return;
        }
        counter.text('(' + currentValue + ')');
    });
    setTimeout(function() {
        $('.nano').nanoScroller(nanoOptions);
    }, 0);
    $('.b-card_video .b-card__link').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    $('body').on('click', '.result-close', function () {
        commentsClose(500);
    });

    $('body').on('submit','.ajaxform',function(event){
        //console.log('ajaxform');
        var contentId = '#'+$(this).data('content');
        event.preventDefault();
        $(contentId+' input[type=submit]').addClass('state_load');
        $(contentId+' button[type=submit]').addClass('state_load');
        $(contentId+' input[type=submit]').prop('disabled','disabled');
        $(contentId+' button[type=submit]').prop('disabled','disabled');
        $(contentId+' input[type=submit]').val('ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÑÐµÑ‚ÑÑ');
        $(contentId+' button[type=submit]').text('ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÑÐµÑ‚ÑÑ');

        $.ajax({
            url: $(this).prop('action'),
            dataType: 'html',
            type: "POST",
            data: $(this).serialize()+"&ajax=Y&iblock_submit_"+$(this).attr('id')+"=Y",//
            success: function(data){
                var data = $($.parseHTML('<div>'+data+'</div>',document,true));
                $(contentId).html(data.find(contentId).html());
            }
        });
    });

    $('body').on('click','.c-like__button', function(event){
        event.preventDefault();
        var button = $(this);
        $.ajax({
            url: '/system/like.php',
            dataType: 'json',
            type: "POST",
            data: "action=" + $(this).data('vote') + "&id=" + $(this).data('id'),
            success: function(data) {
                if (data.success) {
                    button.find('.c-like__button_value').text(data.count);
                    button.attr('disabled','disabled');
                    button.siblings('button').attr('disabled','disabled');
                }
            }
        });
    });

    if ($('.c-like__button').length > 0) {
        disableLikeButton();
    }

    $('.js-ajax').magnificPopup({
        type: 'inline',
        disableOn: 700,
        mainClass: 'mfp-fade mfp-max100',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            open: function() {
                preventElementScroll('.ajax-content-holder', 20);
            }
        }
    });

});

window.addEventListener('resize', resizeWindFunc);
