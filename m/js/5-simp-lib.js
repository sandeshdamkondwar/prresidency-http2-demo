var onform = false;
var focusform = false;
var timer;
var clicktrack = false;
var accordionopen = false

function initjs() {

    // var date = new Date();
    // $('.arrival-date-input').datepicker({
    //     format: "dd-mm-yyyy",
    //     autoclose: true,
    //     startDate: date
    // });

    // $(".formDatePicker").datepicker();
    $(".formDatePicker").datepicker({ format: 'dd/mm/yyyy' });
    $(".formDatePicker").datepicker("setDate", new Date());

    $('.navBtnBorder').on({
        "shown.bs.dropdown": function() {
            $(this).data('closable', false);
            $(this).addClass("navBtnBorderActiondd")
            d = $(this)[0].childNodes[1].childNodes[1]
            if ($(this)[0].childNodes[1].id == "dropdown-menu-multiprop") {
                if ($(d).hasClass('fa-list-ul')) {
                    d.className = d.className.replace("fa-list-ul", "fa-arrow-up");
                    $(d).addClass('menunav');
                } else if ($(d).hasClass('fa-building-o')) {
                    $(this).addClass('hotelmenu');
                    d.className = d.className.replace("fa-building-o", "fa-arrow-up");
                    $(d).addClass('hotelnav');
                    var position = $(this).offset().left - $(window).scrollLeft();
                    $('.hotelmenu .dropdown-menu-topNav').css('position', 'relative').css('left', '-' + position + 'px');
                }
                $(this)[0].childNodes[1].childNodes[3].innerHTML = "Hide";
            }
        },
        "click": function() {},
        "hide.bs.dropdown": function() {
            //alert('clicked');
            $(this).removeClass("navBtnBorderActiondd");
            d = $(this)[0].childNodes[1].childNodes[1];
            if ($(this)[0].childNodes[1].id == "dropdown-menu-multiprop") {
                if ($(d).hasClass('menunav')) {
                    d.className = d.className.replace("fa-arrow-up", "fa-list-ul");
                    $(d).removeClass('menunav');
                    $(this)[0].childNodes[1].childNodes[3].innerHTML = "Menu";
                } else if ($(d).hasClass('hotelnav')) {
                    d.className = d.className.replace("fa-arrow-up", "fa-building-o");
                    $(d).removeClass('hotelnav');
                    $(this)[0].childNodes[1].childNodes[3].innerHTML = "Hotels";
                }
            }
        }
    });
    initFoo();
    for_summary_slider();
    for_summary_detail_page_slider();
    for_a_universal_slider();
}

function initFoo() {
    var e = document.getElementById("fooDiv");
    if (e != null) {
        e.parentNode.removeChild(e);
    }
}

function togglecaret() {
    $("#accordion .panel-title span").toggleClass("fa-rotate-180");
}

function fullWidth() {
    $('.full-drop').css("width", $(window).width() + "px");
    $('#full-drop-map').css("width", $(window).width() - 31 + "px");
    fullheight();
    fullDropdownMenuHeight();
}

function fullDropdownMenuHeight() {
    $('.full-drop').css("height", $(".parent-container").height() + "px");
    $('.full-drop.fullheight').css("height", ($(".parent-container").height() - 65) + "px");
    $('.child-hotel.for-homepage .full-drop').css("height", ($(".parent-container").height() - 45) + "px");
    $('.child-hotel.for-homepage .full-drop.fullheight').css("height", ($(".parent-container").height() - 110) + "px");
    //$('#full-drop-map').css("width", $(window).width() + "px");
    //fullheight();
    // $(".full-drop").css('height', ((($(".parent-container").height()) - ($('.fullImage').height())) - 65) + "px");
}

window.addEventListener("resize", function() {
    screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    if (screenOrientation == 90) {
        fullWidth();
    }
    if (screenOrientation == 0) {
        fullWidth();
    }
});

function galleryStyle() {
    $('#full-drop-gallery').css("width", $(window).width() - 31 + "px");
}
window.addEventListener("resize", function() {
    screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    if (screenOrientation == 90) {
        fullWidth();
    }
    if (screenOrientation == 0) {
        fullWidth();
    }
});

function fullheight() {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 110;
    try {
        document.getElementById('mapContainer').style.height = h + "px";
    } catch (e) {}
}

$("a.geo").click(function() {
    getLoc();
});

function getLoc() {
    var gmapLink = "//maps.google.com/maps?q=" + $(".geo").data("latitude") + "," + $(".geo").data("longitude");
    window.location.assign(gmapLink);
}

function touch() {
    $('.navBtnBorder').each(function() {
        var hammertime = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })

    $('.drop-menu-header-block').each(function() {
        var hammertime3 = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })

    $('.accordian-menu-border').each(function() {
        var hammertime4 = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })

    $('.menu-header-block.modal-submenu').each(function() {
        var hammertime5 = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })

    $('.mobileHeaderTop').each(function() {
        var hammertime7 = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })

    $('.brand-button').each(function() {
        var hammertime2 = Hammer($(this)[0]).on('touch release', function() {
            //$(this).toggleClass('hover_effect');
        });
    })
}

function toggleChevron(e) {
    $(e.target)
        .prev('.midNavMenuLink')
        .find("i.indicator")
        .toggleClass('fa-minus-circle fa-plus-circle');
    if (($(e.target).prev('.midNavMenuLink').find("i.fa-minus-circle").parent()).length) {
        var numVal = $(e.target).prev('.midNavMenuLink').find("i.fa-minus-circle").parent().position().top;
        $('html, body').animate({
            scrollTop: numVal
        }, 'slow');
    }
}

function initGallery(urlVal) {
    var num = urlVal;
    var icon = document.getElementById("navPillsGallery");
    $(".gallery-class").each(function() {
        if ($(this).attr("rel") == num) {
            $("#dropdown-image-menu").html($(this).children().html().trim());
        }
    });
    $("#dropdown-image-menu").append(icon);

    $("#slideshow-1").addClass('cycle-slideshow');

    var slides = galleries[num].slides;
    var thumbs = galleries[num].thumbs;
    var height = $('#slideshow-1').height();
    $('#slide-holder').css('height', height);
    $('.cycle-slideshow').cycle('stop');
    //$('.gallery-header').html(galleries[num].galleryTitle);
    $('.cycle-slideshow').cycle('destroy');
    $('.cycle-slideshow').html(slides.replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
    $("#gallery-pager").animate({
        left: 0,
    }, 10);
    $('#slideshow-1').cycle();
}
$("a.gallery-class").click(function(e) {
    $("a.gallery-class").removeClass('active');
    $(this).addClass('active');
    var icon = document.getElementById("navPillsGallery");
    var num = parseInt($(this).attr('rel'), 10);
    $(".gallery-class").each(function() {
        if ($(this).attr("rel") == num) {
            $("#dropdown-image-menu").html($(this).children().html().trim());
        }
    });
    $("#dropdown-image-menu").append(icon);
    var slides = galleries[num].slides;
    var thumbs = galleries[num].thumbs;
    var height = $('#slideshow-1').height();
    $('#slide-holder').css('height', height);
    $('.cycle-slideshow').cycle('stop');
    //$('.gallery-header').html(galleries[num].galleryTitle);
    $('.cycle-slideshow').cycle('destroy');
    $('.cycle-slideshow').html(slides.replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
    $("#gallery-pager").animate({
        left: 0,
    }, 10);
    $('#slideshow-1').cycle();
})

$('.descriptionMobileNoSpace').each(function() {
    $(this).find('ul').css("margin-top", "-10px")
});

function mapRender(menu) {
    fullheight();
    var mapContainer = $('#mapContainer');
    mapData = $(menu);
    var latLng = new google.maps.LatLng(mapContainer.data("latitude"), mapContainer.data("longitude"));
    var locationsLat = new Array();
    var locationsLong = new Array();
    var locationHeader = new Array();
    var locationContent = new Array();

    $(".mapPlaces").each(function(index, element) {
        locationsLong.push($(element).attr("data-placesLongitude"));
        locationsLat.push($(element).attr("data-placesLatitude"));
        locationHeader.push($(element).attr("data-places-heading"));
        locationContent.push($(element).attr("data-places-description"));
    })


    // render the map
    if (mapData.attr("id") == "mapContainer") {
        var centerMap = latLng;
        var icon = mapContainer.data("icon");
        var menuHead = mapContainer.attr("data-hotel-name").trim();
        var menuDescription = $(mapData).attr("data-hotel-address");
    } else {
        var centerMap = new google.maps.LatLng(mapData.attr("data-placesLatitude"), mapData.attr("data-placesLongitude"));
        var menuHead = mapData.html().trim();
        var menuDescription = $(mapData).attr("data-places-description");
    }
    map = new google.maps.Map(document.getElementById("mapContainer"), {
        zoom: mapContainer.data("zoom"),
        center: centerMap,
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });

    // map recenter
    map.panBy(0, -45);
    // map recenter

    var markerLocation = new google.maps.Marker({
        position: centerMap,
        title: mapContainer.data("hotelName"),
        map: map,
        icon: icon,
    });

    var homeMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: mapContainer.data("icon"),
    });

    google.maps.event.addListener(map, 'click', function(event) {
        this.setOptions({
            scrollwheel: true
        });
    });

    // hotel infowindow
    var infowindow = new google.maps.InfoWindow();
    makeInfoWindow(map, infowindow, "<b>" + menuHead + "</b>" +
        "<br>" + menuDescription, markerLocation);

    // info window creation

    for (i = 0; i < (locationsLong.length + 1); i++) {
        if (locationsLat[i]) {
            markerLocation = new google.maps.Marker({
                position: new google.maps.LatLng(locationsLat[i], locationsLong[i]),
                map: map,
            });

            makeInfoWindowEvent(map, infowindow, "<b>" + locationHeader[i] + "</b>" +
                "<br>" + locationContent[i], markerLocation);
        } else {
            markerLocation = new google.maps.Marker({
                position: new google.maps.LatLng($("#mapAll").attr("data-placesLatitude"), $("#mapAll").attr("data-placesLongitude")),
                map: map,
                icon: mapContainer.data("icon")
            });

            makeInfoWindowEvent(map, infowindow, "<b>" + $("#mapAll").attr("data-places-heading") + "</b>" +
                "<br>" + $("#mapAll").attr("data-places-description"), markerLocation);

        }
    }
    $('#mapMenuHeader').html('<i class="fa fa-chevron-down fa-custom-map pull-right"></i>' + menuHead);
}

function makeInfoWindowEvent(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function() {
        if (infowindow) {
            infowindow.close();
        }
        infowindow.setOptions({
            content: contentString,
            maxWidth: 200
        });
        infowindow.open(map, marker);
        $(".gm-style-iw").css('max-height', "150px")
    });
}

function makeInfoWindow(map, infowindow, contentString, marker) {
    if (infowindow) {
        infowindow.close();
    }
    infowindow.setOptions({
        content: contentString,
        maxWidth: 200
    });
    infowindow.open(map, marker);
    $(".gm-style-iw").css('max-height', "150px")
}

function flexslider() {

    var element = document.getElementById('flexsliderHammer');
    var hammertime = Hammer(element).on("dragleft", function() {
        $('#flexsliderHammer').flexslider("next");
    });
    var hammertime = Hammer(element).on("dragright", function() {
        $('#flexsliderHammer').flexslider("prev");
    });

    $('.flexslider').flexslider({
        animation: "slide",
        touch: true,
        useCSS: false,
        slideDirection: "horizontal", //String: Select the sliding direction, "horizontal" or "vertical"
        slideshow: true, //Boolean: Animate slider automatically
        slideshowSpeed: 3000, //Integer: Set the speed of the slideshow cycling, in milliseconds
        animationDuration: 500, //Integer: Set the speed of animations, in milliseconds
        directionNav: true, //Boolean: Create navigation for previous/next navigation? (true/false)
        controlNav: false, //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
        keyboardNav: true, //Boolean: Allow slider navigating via keyboard left/right keys
        mousewheel: false, //Boolean: Allow slider navigating via mousewheel
        pausePlay: false, //Boolean: Create pause/play dynamic element
        randomize: false, //Boolean: Randomize slide order
        slideToStart: 0, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
        animationLoop: true, //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
        pauseOnAction: false, //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
        pauseOnHover: false, //Boolean: Pause the slideshow when hovering over slider, then play when no longer hovering
        controlsContainer: "", //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
        manualControls: ".flex-control-nav tr td a", //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.

        start: function() {},
        before: function() {}, //Callback: function(slider) - Fires asynchronously with each slider animation
        after: function(slider) {
            slider.pause();
            slider.play();
        }, //Callback: function(slider) - Fires after each slider animation completes
        end: function() {} //Callback: function(slider) 
    });
}

function formSubmit() {

    // var arrival_date = $( ".arrival-date-input" ).val();
    // console.log(arrival_date);
    // var a_valid = moment(arrival_date, 'MM/DD/YYYY', true).isValid();
    // console.log(a_valid);
    // var departure_date = $( ".departure-date-input" ).val();
    // console.log(departure_date);
    // var d_valid = moment(departure_date, 'MM/DD/YYYY', true).isValid();
    // console.log(d_valid);

    var adults = $("#adult").val();
    console.log(adults);
    var children = $("#child").val();
    console.log(children);

    // if(a_valid == true && d_valid == true) {

    // a = moment(arrival_date).format("YYYY-MM-DD");
    // console.log(a);
    // d = moment(departure_date).format("YYYY-MM-DD");
    // console.log(d);

    var ar = moment().format("YYYY-MM-DD");
    console.log(ar);
    var dp = moment().add(1, 'days').format("YYYY-MM-DD");
    console.log(dp);

    var formUrl = 'https://aloha-ganges.reztrip.com/search?rooms=1&arrival_date=' + ar + '&departure_date=' + dp + '&adults0=' + adults + '&children0=' + children + '';

    console.log(formUrl);
    //document.bookingForm1.action = formUrl;
    //console.log(document.bookingForm1.action);
    //document.bookingForm1.submit();
    document.getElementById('rezbook').href = formUrl;
    //console.log(document.bookingForm1.action);

    //document.getElementById('arrival_dat').setAttribute("disabled", "disabled");
    //document.getElementById('departure_dat').setAttribute("disabled", "disabled");

    //myVar=setTimeout(enable,500);

    return true;


}

function formSubmit1() {

    //   var arrival_date = $( ".arrival-date-input" ).val();
    //   console.log(arrival_date);
    //   var a_valid = moment(arrival_date, 'MM/DD/YYYY', true).isValid();
    //   console.log(a_valid);
    //   var departure_date = $( ".departure-date-input" ).val();
    //   console.log(departure_date);
    //   var d_valid = moment(departure_date, 'MM/DD/YYYY', true).isValid();
    //   console.log(d_valid);

    var adults = $("#adult").val();
    console.log(adults);
    var children = $("#child").val();
    console.log(children);

    // if(a_valid == true && d_valid == true) {

    // a = moment(arrival_date).format("YYYY-MM-DD");
    // console.log(a);
    // d = moment(departure_date).format("YYYY-MM-DD");
    // console.log(d);


    var ar = moment().format("YYYY-MM-DD");
    console.log(ar);
    var dp = moment().add(1, 'days').format("YYYY-MM-DD");
    console.log(dp);

    var formUrl = 'https://aloha-ganges.reztrip.com/search?rooms=1&arrival_date=' + ar + '&departure_date=' + dp + '&adults0=' + adults + '&children0=' + children + '';

    console.log(formUrl);
    document.bookingForm2.action = formUrl;
    //console.log(document.bookingForm2.action);
    //document.bookingForm1.submit();
    document.getElementById('rezbook1').href = formUrl;
    //console.log(document.bookingForm1.action);

    //document.getElementById('arrival_dat').setAttribute("disabled", "disabled");
    //document.getElementById('departure_dat').setAttribute("disabled", "disabled");

    //myVar=setTimeout(enable,500);

    return true;


}

function formsub(id) {
    var submitform = false;
    var msg = $('#msg-' + id).val();
    var errmsg = $('#errmsg-' + id).val();
    if (submitform == false) {
        $('#message-' + id).fadeOut(100);
        submitform = true;
        var postData = {};
        var a = $('#form-' + id).serializeArray();
        console.log(a);
        $.map(a, function(ele) {
            console.log(ele);
            postData[ele.name] = ele.value;
        });
        console.log(postData);
        console.log(jQuery.parseJSON(JSON.stringify(postData)));
        //var formURL = "/cgi-bin/formprocess.py";
        var formURL = $('#form-' + id).attr("action");
        $('#form-' + id).fadeTo(200, .4);
        $.ajax({
            url: formURL,
            type: "POST",
            data: jQuery.parseJSON(JSON.stringify(postData)),
            // data: new FormData("#form-"+id),
            success: function(data, textStatus, jqXHR) {
                if (data == 1) {
                    $('#message-' + id).removeClass('text-danger').addClass('text-success').html(msg);
                    $('#message-' + id).fadeIn('fast').delay(4000).fadeOut(700);
                    $("#form-" + id)[0].reset();
                } else {
                    $('#message-' + id).removeClass('text-success').addClass('text-danger').html(errmsg);
                    $('#message-' + id).fadeIn('fast');
                }
                submitform = false;
                $("#form-" + id).fadeTo(200, 1);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#message-' + id).removeClass('text-success').addClass('text-danger').html(errmsg);
                $('#message-' + id).fadeIn('fast');
                submitform = false;
                $("#form-" + id).fadeTo(200, 1);
            }
        });
    }
}

function formsubscribe() {

    $('#subscribeMessage').fadeOut(10);
    var submitSubscribeform = false;
    $("#subscribeForm").submit(function(e) {
        if (submitSubscribeform == false) {
            $('#subscribeMessage').fadeOut(100);
            submitSubscribeform = true;
            var postData = {};
            var a = $(this).serializeArray();
            console.log(a);
            $.each(a, function() {
                if (postData[this.name] !== undefined) {
                    if (!postData[this.name].push) {
                        postData[this.name] = [postData[this.name]];
                    }
                    postData[this.name].push(this.value || '');
                } else {
                    postData[this.name] = this.value || '';
                }
            });
            console.log(jQuery.parseJSON(JSON.stringify(postData)));
            // var formURL = $(this).attr("action");
            var formURL = "/cgi-bin/subscribe_mail.py";
            $(this).fadeTo(200, .4);
            $.ajax({
                url: formURL,
                type: "GET",
                data: jQuery.parseJSON(JSON.stringify(postData)),
                success: function(data, textStatus, jqXHR) {
                    if (data == 1) {
                        $('#subscribeMessage').removeClass('text-danger').addClass('text-success').html('Thank you. You have been subscribed.');
                        $('#subscribeMessage').fadeIn('fast').delay(4000).fadeOut(700);
                        $('#subscribeForm')[0].reset();
                    } else {
                        $('#subscribeMessage').removeClass('text-success').addClass('text-danger').html('Sorry something went wrong, you might want to try again.');
                        $('#subscribeMessage').fadeIn('fast');
                    }
                    submitSubscribeform = false;
                    $("#subscribeForm").fadeTo(200, 1);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#subscribeMessage').removeClass('text-success').addClass('text-danger').html('Sorry something went wrong, you might want to try again.');
                    $('#subscribeMessage').fadeIn('fast');
                    submitSubscribeform = false;
                    $("#subscribeForm").fadeTo(200, 1);
                }
            });
        }
        e.preventDefault(); //STOP default action
    });
}

// $('#summary_detail_page_slider').camera({
//     loader: 'none',
//     thumbnails: false,
//     hover: false,
//     opacityOnGrid: false,
//     fx: 'simpleFade',
//     pauseOnClick: false,
//     pagination: false,
//     overlayer: false,
//     playPause: false,
//     overlayer: false,
//     imagePath: '../css/images/'
// });

// $('.a_universal_slider').each(function() {
//     $(this).camera({
//         loader: 'none',
//         thumbnails: false,
//         hover: false,
//         opacityOnGrid: false,
//         fx: 'simpleFade',
//         pauseOnClick: false,
//         pagination: false,
//         overlayer: false,
//         playPause: false,
//         imagePath: '../css/images/'
//     });
// });

// $('.summary_slider').each(function() {
//     $(this).camera({
//         loader: 'none',
//         thumbnails: false,
//         hover: false,
//         opacityOnGrid: false,
//         fx: 'simpleFade',
//         pauseOnClick: false,
//         pagination: false,
//         overlayer: false,
//         playPause: false,
//         imagePath: '../css/images/'
//     });
// });

function for_summary_detail_page_slider() {
    if ($("#summary_detail_page_slider").children().length == 1) {
        $('#summary_detail_page_slider').camera({
            loader: 'none',
            thumbnails: false,
            hover: false,
            opacityOnGrid: false,
            fx: 'none',
            autoAdvance: false,
            pagination: false,
            overlayer: false,
            playPause: false,
            navigation: false
        });
    } else {
        $('#summary_detail_page_slider').camera({
            loader: 'none',
            thumbnails: false,
            hover: false,
            opacityOnGrid: false,
            fx: 'simpleFade',
            pauseOnClick: false,
            pagination: true,
            overlayer: false,
            playPause: false,
            overlayer: false,
            navigation: true,
            imagePath: '../css/images/'
        });
    }
}

function for_a_universal_slider() {
    if ($(".a_universal_slider").children().length == 1) {
        $('.a_universal_slider').each(function() {
            $(this).camera({
                autoAdvance: false,
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'none',
                pagination: false,
                overlayer: false,
                playPause: false,
                navigation: false
            });
        });
    } else {
        $('.a_universal_slider').each(function() {
            $(this).camera({
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'simpleFade',
                pauseOnClick: false,
                pagination: true,
                overlayer: false,
                playPause: false,
                imagePath: '../css/images/'
            });
        });
    }

}


function for_summary_slider() {

    $('.summary_slider').each(function() {

        if ($(this).children().length == 1) {
            $(this).camera({
                autoAdvance: false,
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'none',
                pagination: false,
                overlayer: false,
                playPause: false,
                navigation: false
            });

        } else {

            $(this).camera({
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'simpleFade',
                pauseOnClick: false,
                pagination: false,
                overlayer: false,
                playPause: false,
                imagePath: '../css/images/'
            });

        }
    });
}

function goToTop() {
    // hide #back-top first
    $("#back-top").hide();

    // fade in #back-top
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 150) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function() {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
}

function roundImageCheck() {
    $(".page_link img").each(function() {
        var imgUrl = $(this).attr('src');
        // console.log(imgUrl);
        // console.log(imgUrl.indexOf("r_max"));
        if (imgUrl.indexOf("r_max") > -1) {
            // console.log('mila');
            $(this).parent('.page_link').addClass('rounded_image');
        } else {
            // console.log('nai mila');
        }
    });
}
