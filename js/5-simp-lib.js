/**
 * Plugin: jquery.zWeatherFeed
 *
 * Version: 1.3.1
 * (c) Copyright 2011-2015, Zazar Ltd
 *
 * Description: jQuery plugin for display of Yahoo! Weather feeds
 *
 * History:
 * 1.3.1 - Forecast day option and background image code fix (credit to Romiko)
 * 1.3.0 - Added refresh timer
 * 1.2.1 - Handle invalid locations
 * 1.2.0 - Added forecast data option
 * 1.1.0 - Added user callback function
 *         New option to use WOEID identifiers
 *         New day/night CSS class for feed items
 *         Updated full forecast link to feed link location
 * 1.0.3 - Changed full forecast link to Weather Channel due to invalid Yahoo! link
	   Add 'linktarget' option for forecast link
 * 1.0.2 - Correction to options / link
 * 1.0.1 - Added hourly caching to YQL to avoid rate limits
 *         Uses Weather Channel location ID and not Yahoo WOEID
 *         Displays day or night background images
 **/

(function($){

	$.fn.weatherfeed = function(locations, options, fn) {

		// Set plugin defaults
		var defaults = {
			unit: 'c',
			image: true,
			country: false,
			highlow: true,
			wind: true,
			humidity: false,
			visibility: false,
			sunrise: false,
			sunset: false,
			forecast: false,
			forecastdays: 5,
			link: true,
			showerror: true,
			linktarget: '_self',
			woeid: false,
			refresh: 0
		};
		var options = $.extend(defaults, options);
		var row = 'odd';

		// Functions
		return this.each(function(i, e) {
			var $e = $(e);

			// Add feed class to user div
			if (!$e.hasClass('weatherFeed')) $e.addClass('weatherFeed');

			// Check and append locations
			if (!$.isArray(locations)) return false;

			var count = locations.length;
			if (count > 10) count = 10;

			var locationid = '';

			for (var i=0; i<count; i++) {
				if (locationid != '') locationid += ',';
				locationid += "'"+ locations[i] + "'";
			}

			// Cache results for an hour to prevent overuse
			now = new Date();

			// Select location ID type
			var queryType = options.woeid ? 'woeid' : 'location';

			// Create Yahoo Weather feed API address
            // IMPORTANT: Updating locationid with cityname since the Yahoo api changed which caused this widget to crash
			// Old: var query = "select * from weather.forecast where "+ queryType +" in ("+ locationid +") and u='"+ options.unit +"'";
			var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="+ locationid + ") and u='"+ options.unit +"'";
			var api = 'https://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=?';

			// Request feed data
			sendRequest(query, api, options);

			if (options.refresh > 0) {

				// Set timer interval for scrolling
				var interval = setInterval(function(){ sendRequest(query, api, options); }, options.refresh * 60000);
			}

			// Function to gather new weather data
			function sendRequest(query, api, options) {

				// Reset odd and even classes
				row = 'odd';

				// Clear user div
				$e.html('');

				$.ajax({
					type: 'GET',
					url: api,
					dataType: 'json',
					success: function(data) {

						if (data.query) {

							if (data.query.results.channel.length > 0 ) {

								// Multiple locations
								var result = data.query.results.channel.length;
								for (var i=0; i<result; i++) {

									// Create weather feed item
									_process(e, data.query.results.channel[i], options);
								}
							} else {

								// Single location only
								_process(e, data.query.results.channel, options);
							}

							// Optional user callback function
							if ($.isFunction(fn)) fn.call(this,$e);

						} else {
							if (options.showerror) $e.html('<p>Weather information unavailable</p>');
						}
					},
					error: function(data) {
						if (options.showerror) $e.html('<p>Weather request failed</p>');
					}
				});
			};

			// Function to each feed item
			var _process = function(e, feed, options) {
				var $e = $(e);

				// Check for invalid location
				if (feed.description != 'Yahoo! Weather Error') {

					// Format feed items
					var wd = feed.wind.direction;
					if (wd>=348.75&&wd<=360){wd="N"};if(wd>=0&&wd<11.25){wd="N"};if(wd>=11.25&&wd<33.75){wd="NNE"};if(wd>=33.75&&wd<56.25){wd="NE"};if(wd>=56.25&&wd<78.75){wd="ENE"};if(wd>=78.75&&wd<101.25){wd="E"};if(wd>=101.25&&wd<123.75){wd="ESE"};if(wd>=123.75&&wd<146.25){wd="SE"};if(wd>=146.25&&wd<168.75){wd="SSE"};if(wd>=168.75&&wd<191.25){wd="S"};if(wd>=191.25 && wd<213.75){wd="SSW"};if(wd>=213.75&&wd<236.25){wd="SW"};if(wd>=236.25&&wd<258.75){wd="WSW"};if(wd>=258.75 && wd<281.25){wd="W"};if(wd>=281.25&&wd<303.75){wd="WNW"};if(wd>=303.75&&wd<326.25){wd="NW"};if(wd>=326.25&&wd<348.75){wd="NNW"};
					var wf = feed.item.forecast[0];

					// Determine day or night image
					wpd = feed.item.pubDate;
					n = wpd.indexOf(":");
					tpb = _getTimeAsDate(wpd.substr(n-2,8));
					tsr = _getTimeAsDate(feed.astronomy.sunrise);
					tss = _getTimeAsDate(feed.astronomy.sunset);

					// Get night or day
					if (tpb>tsr && tpb<tss) { daynight = 'day'; } else { daynight = 'night'; }

					// Add item container
					var html = '<div class="weatherItem '+ row +' '+ daynight +'"';
					if (options.image) html += ' style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'+ feed.item.condition.code.substring(0,2) + daynight.substring(0,1) +'.png); background-repeat: no-repeat;"';
					html += '>';

					// Add item data
					html += '<div class="weatherCity">'+ feed.location.city +'</div>';
					if (options.country) html += '<div class="weatherCountry">'+ feed.location.country +'</div>';
					html += '<div class="weatherTemp">'+ feed.item.condition.temp +'&deg;</div>';
					html += '<div class="weatherDesc">'+ feed.item.condition.text +'</div>';

					// Add optional data
					if (options.highlow) html += '<div class="weatherRange">High: '+ wf.high +'&deg; Low: '+ wf.low +'&deg;</div>';
					if (options.wind) html += '<div class="weatherWind">Wind: '+ wd +' '+ feed.wind.speed + feed.units.speed +'</div>';
					if (options.humidity) html += '<div class="weatherHumidity">Humidity: '+ feed.atmosphere.humidity +'</div>';
					if (options.visibility) html += '<div class="weatherVisibility">Visibility: '+ feed.atmosphere.visibility +'</div>';
					if (options.sunrise) html += '<div class="weatherSunrise">Sunrise: '+ feed.astronomy.sunrise +'</div>';
					if (options.sunset) html += '<div class="weatherSunset">Sunset: '+ feed.astronomy.sunset +'</div>';

					// Add item forecast data
					if (options.forecast) {

						html += '<div class="weatherForecast">';

						var wfi = feed.item.forecast;
						var wfid = options.forecastdays;
						if (wfid > wfi.length) wfid = wfi.length;

						for (var i=0; i < wfid; i++) {
							html += '<div class="weatherForecastItem day'+ (i+1) +'" style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'+ wfi[i].code +'s.png); background-repeat: no-repeat;">';
							html += '<div class="weatherForecastDay">'+ wfi[i].day +'</div>';
							html += '<div class="weatherForecastDate">'+ wfi[i].date +'</div>';
							html += '<div class="weatherForecastText">'+ wfi[i].text +'</div>';
							html += '<div class="weatherForecastRange">High: '+ wfi[i].high +' Low: '+ wfi[i].low +'</div>';
							html += '</div>'
						}

						html += '</div>'
					}

					if (options.link) html += '<div class="weatherLink"><a href="'+ feed.link +'" target="'+ options.linktarget +'" title="Read full forecast">Full forecast</a></div>';

				} else {
					var html = '<div class="weatherItem '+ row +'">';
					html += '<div class="weatherError">City not found</div>';
				}

				html += '</div>';

				// Alternate row classes
				if (row == 'odd') { row = 'even'; } else { row = 'odd';	}

				// Apply new weather content
				$e.append(html);
			};

			// Get time string as date
			var _getTimeAsDate = function(t) {

				d = new Date();
				r = new Date(d.toDateString() +' '+ t);

				return r;
			};

		});
	};

})(jQuery);
    var onform = false; // Added for Booking Form closing
    var focusform = false; // Added for Booking Form closing
    var timer; // Added for Booking Form closing
    var clicktrack = false;
    var accordionopen = false;
    var calWidth = 50; //222;
    var interval;
    var interval1;

    function initjs() {
        createDropDown("#Loc", "target1");
        createDropDown("#Room", "target2");
        var nd;
        $(".arrival-date-input").prop("readonly", true).datepicker({
            minDate: 'today',
            defaultDate: 'today',
            onClose: function(selectedDate) {
                var a = moment(selectedDate, "DD/MM/YYYY");
                a.add('days', 1);
                var mo = parseInt(a.months()) + 1;
                nd = mo + "/" + a.dates() + "/" + a.years();
                $(".departure-date-input").datepicker("option", "minDate", nd);
                if ($(".departure-date-input").val() == '') {
                    $(".departure-date-input").datepicker("setDate", nd);
                }
            },
            beforeShow: function(textbox, instance) {
                instance.dpDiv.css({
                    marginLeft: -(textbox.offsetWidth + 16) + 'px'
                });
            }
        });

        $(".arrival-date-input").datepicker("setDate", 'today');

        $(".formDatePicker").datepicker({
            dateFormat: 'dd-mm-yy'
        });
        $(".formDatePicker").datepicker("setDate", new Date());

        $(".departure-date-input").prop("readonly", true).datepicker({
            minDate: 1,
            defaultDate: +1,
            beforeShow: function(textbox, instance) {
                instance.dpDiv.css({
                    marginLeft: -(textbox.offsetWidth - 58) + 'px'
                });
            }
        });

        $(".departure-date-input").datepicker("setDate", +1);

        $('.carousel').carousel({
            interval: 5000,
            pause: ''
        });

        // promo_slider_play_pause();
        // right_col_promo_slider_play_pause();


        $('#promos').on('cycle-finished', function(event, opts) {
            $("#promos").attr("data-cycle-loop", "0");
            closePromos();
            $('#promos.cycle-slideshow').cycle('reinit');
        });

        /** Promo open-close **/
        $('.promotions-holder .open-close').click(function(e) {
            e.preventDefault();
            $('.promotions-holder .show-close').slideDown();
            $('.promotions-holder .filler').slideDown();
            $('.promotions-holder p.collapsed-header').slideUp();
            $("#promos").attr("data-cycle-loop", "0");
            $('#promos.cycle-slideshow').cycle('resume');
        });

        $('.promotions-holder .show-close').click(function(e) {
            e.preventDefault();
            $('.promotions-holder p.collapsed-header').slideDown();
            $(this).slideUp();
            $('.promotions-holder .filler').slideUp();
            $(".pause-button").show();
            $(".play-button").hide();
            $("#promos").attr("data-cycle-loop", "0");
            $("#promos").removeClass("cycle-paused");
            $('#promos.cycle-slideshow').cycle('reinit');
        });

        interval = setInterval(openPromos, 2000);
        interval1 = setInterval(showDateTime, 2000);

        /* Navbar toggle **/
        $('.navbar-bottom .navbar-toggle').click(function() {
            if ($('#top-navbar-collapse').hasClass('in'))
                $('#top-navbar-collapse').collapse('hide');
        });

        $('.navbar-top .navbar-toggle').click(function() {
            if ($('#bottom-navbar-collapse').hasClass('in'))
                $('#bottom-navbar-collapse').collapse('hide');
        });

        /* Start Added for Booking Form closing **/

        /*script to check cookie and open booking form */
        // var jst = $.cookie('jsta');
        // if (typeof jst == 'undefined') {
        //     $("#collapseOne").addClass('in');
        //     $("#accordion .panel-heading").removeClass("collapsed");
        //     togglecaret();
        //     accordionopen = true;
        //     clicktrack = false;
        //     timer = setTimeout(function() {
        //         closeBooking();
        //     }, 4000);
        //     $.cookie('jsta', 'been_here', {
        //         expires: 2
        //     });
        // }
        /* end cookie handling */

        $("#collapseOne").focusin(function() {
            focusform = true;
            clearTimeout(timer);
        });
        $("#collapseOne").focusout(function() {
            focusform = false;
        });

        $("#accordion").hover(function() {
            onform = true;
            clearTimeout(timer);
        }, function() {
            onform = false;
        });

        $("#accordion").bind("clickoutside", function(event) {
            // $("#overlay").removeClass('open-overlay');
            // console.log('clickoutside happened');
            if (clicktrack == false) {
                clearTimeout(timer);
                closeBooking();
            }
            clicktrack = false;
        });
        // // <-- time in milliseconds

        $('#accordion .panel-heading').click(function(e) {
            // console.log('panel heading clicked');
            togglecaret();
            $("#accordion .panel-heading").toggleClass('collapsed');
            // $("#overlay").toggleClass('open-overlay', (accordionopen = !accordionopen));
            $("#accordion .panel-heading").removeClass("collapsed");
            $("#bookingForm .tohide").css('display', 'block');
            $(".abs_parent").css('z-index', '201');
            $("#ui-datepicker-div").css('z-index', '202');
            $("#bookingForm").addClass('open');
            $(".second-last-block").hide();

            // console.log('panel heading overlay clicked');
        });

        $("#collapseOne").on('hide', function(e) {
            $("#accordion .panel-heading").addClass("collapsed");
            // $("#overlay").removeClass('open-overlay').hide();
            // console.log('panel heading closed');
        });

        $("#collapseOne").on('show', function(e) {
            // console.log('collapse one clicked');
            $("#accordion .panel-heading").removeClass("collapsed");
            $("#bookingForm .tohide").css('display', 'block');
            $(".abs_parent").css('z-index', '201');
            $("#ui-datepicker-div").css('z-index', '202');
            $("#bookingForm").addClass('open');
            $(".second-last-block").hide();
            var docHeight = $(document).height();
            // $("#overlay").height(docHeight).addClass('open-overlay').show();
        });


        // $('#top-navbar-collapse').click(function() {
        //     alert('ka ho');
        //     $("#overlay").removeClass('open-overlay').hide();
        //     if (clicktrack == false) {
        //         clearTimeout(timer);
        //         closeBooking();
        //     }
        //     clicktrack = false;
        // });

        $("#ui-datepicker-div").click(function() {
            clicktrack = true;
        });

        // $('ul#top-navbar-collapse').flexMenu2({
        //     showOnHover: false
        // });

        checkHomepageBookingFormNoOfChildElements();
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

    function openPromos() {
        $('.promotions-holder .show-close').slideDown();
        $('.promotions-holder .filler').slideDown();
        $('.promotions-holder p.collapsed-header').slideUp();
        clearInterval(interval);
    }

    function showDateTime() {
        $('.wtlocation').slideDown();
        $('.weather-wrap').slideDown();
        clearInterval(interval1);
    }

    function closePromos() {
        $('.promotions-holder p.collapsed-header').slideDown();
        $('.promotions-holder .show-close').slideUp();
        $('.promotions-holder .filler').slideUp();
    }

    function promo_slider_play_pause() {
        $(".filler .pause-button").on('click', function(event) {
            $('#promos.cycle-slideshow').cycle('pause');
            $(".filler .pause-button").hide();
            $(".filler .play-button").show();
        });
        $(".filler .play-button").on('click', function(event) {
            $('#promos.cycle-slideshow').cycle('play');
            $(".filler .play-button").hide();
            $(".filler .pause-button").show();
        });
    }

    function right_col_promo_slider_play_pause() {
        $(".promo-slider .pause-button").on('click', function(event) {
            $(".promo-slider .pause-button").hide();
            $(".promo-slider .play-button").show();
        });
        $(".promo-slider .play-button").on('click', function(event) {
            $(".promo-slider .play-button").hide();
            $(".promo-slider .pause-button").show();
        });
    }

    function initGallery() {
        $("a.gallery-class").click(function(e) {
            e.preventDefault();
            $("a.gallery-class").removeClass("active");
            $(this).addClass("active");
            var t = parseInt($(this).attr("rel"), 10);
            var n = galleries[t].slides;
            var r = galleries[t].thumbs;
            var i = $("#slideshow-1").height();
            $("#slide-holder").css("height", i);
            $(".cycle-slideshow").cycle("stop");
            $(".gallery-header").html(galleries[t].galleryTitle);
            $(".cycle-slideshow").cycle("destroy");
            $(".cycle-slideshow").html(n.replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
            $("#gallery-pager").html(r.replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
            $("#gallery-pager").animate({
                left: 0
            }, 10);
            $("#slideshow-1").cycle();
            return false
        });
        $(".cycle-slideshow").on("cycle-after", function(e, t, n, r) {
            var i = 54,
                s = -53,
                o = $("#gallery-pager").find("> div:first-child"),
                u = $("#gallery-pager").find("> div:last-child"),
                a = $("#gallery-pager").find("> div").length,
                f = $("#gallery-pager").position().left,
                l = $("#gallery-pager div.cycle-pager-active").position().left + f,
                c = o.position().left + f,
                h = u.position().left + i + f,
                p = $("#gallery-paging").innerWidth(),
                d = p / 2;
            if (l > d && h > p) {
                var v = l - d + i / 2;
                $("#gallery-pager").animate({
                    left: "-=" + v
                }, 240)
            } else if (l < d && f < 0) {
                var m = d - l + i / 2;
                var g = f + m;
                if (g > 0) {
                    m = -1 * f
                }
                $("#gallery-pager").animate({
                    left: "+=" + m
                }, 240)
            }
        });

        $(".thumbnail-control").on("click", function() {
            var e = $(this).data("scrollModifier"),
                t = parseInt(e, 10);
            var n = 54,
                r = -53,
                i = $("#gallery-pager").find("> div:first-child"),
                s = $("#gallery-pager").find("> div:last-child"),
                o = $("#gallery-pager").position().left,
                u = i.position().left + o,
                a = s.position().left + n + o,
                f = $("#gallery-paging").innerWidth();
            if (t < 0) {
                if (a > f) {
                    var l = a - f;
                    var c = f / 2;
                    if (l < c) {
                        $("#gallery-pager").animate({
                            left: "-=" + c
                        }, 240)
                    } else {
                        $("#gallery-pager").animate({
                            left: "-=" + f
                        }, 240)
                    }
                }
            } else {
                if (u < -10) {
                    var h = o + f;
                    if (h > 0) {
                        $("#gallery-pager").animate({
                            left: 0
                        }, 240)
                    } else {
                        $("#gallery-pager").animate({
                            left: "+=" + f
                        }, 240)
                    }
                }
            }
        })
    }

    function initlocationjs() {

        $('#places .panel-heading').click(function(e) {
            $('#places .panel-heading span').removeClass('fa-angle-up').addClass('fa-angle-down');
            if ($(this).hasClass('collapsed')) {
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }
        });

        var addressTip;

        var mapElement = $('#mapContainer'),
            hotelLatLng = new google.maps.LatLng(mapElement.data('latitude'), mapElement.data('longitude')),
            hotelMapOptions = {
                zoom: mapElement.data('zoom'),
                center: hotelLatLng,
                mapTypeControl: true,
                scrollwheel: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                }

            },

            hotelMap = new google.maps.Map(document.getElementById('mapContainer'), hotelMapOptions);
        hotelMarkerImage = new google.maps.MarkerImage(mapElement.data('icon'), new google.maps.Size(20, 20), new google.maps.Point(0, 0), new google.maps.Point(10, 0));
        hotelMarkerOptions = {
                map: hotelMap,
                position: hotelLatLng,
                icon: hotelMarkerImage
            },

            hotelMarker = new google.maps.Marker(hotelMarkerOptions),
            content = "<div style='overflow: hidden; width:300px; height:80px; '><b>" + mapElement.data('hotelName') + "</b><br>" + mapElement.data('hotelAddress') + "<br>" + mapElement.data('hotelPhone') + "</div>",
            hotelTip = new google.maps.InfoWindow({
                maxWidth: 400,
                position: hotelLatLng,
                content: content
            }),
            hotelDirectionService = new google.maps.DirectionsService(),
            hoteldirectionsDisplay = new google.maps.DirectionsRenderer();
        hoteldirectionsDisplay.setMap(hotelMap);
        hotelTip.open(hotelMap);
        var defMarkerImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4484F6",
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
        var cacheTip;
        var markers = {};
        var allPlaces = $('.places-link').each(function(index, element) {
            var $element = $(element),
                position = new google.maps.LatLng($element.data('latitude'), $element.data('longitude')),
                markerOption = {
                    map: hotelMap,
                    position: position,
                    icon: defMarkerImage
                },
                marker = new google.maps.Marker(markerOption),
                placeContent = "<div style='overflow: hidden; width:300px; '><b>" + $element.data('name') + "</b><br>" + $element.data('address') + "<br>",
                placeTip = new google.maps.InfoWindow({
                    maxWidth: 400,
                    position: position,
                    content: content
                });
            var markerId = $element.data('latitude') + '--' + $element.data('longitude');
            markers[markerId] = marker;

            $('#directions').find('#toDirection').append('<option data-longitude=' + $element.data("longitude") + ' data-latitude=' + $element.data("latitude") + '>' + $element.data("name") + '</option>');
            $('#directions').find('#fromDirection').append('<option data-longitude=' + $element.data("longitude") + ' data-latitude=' + $element.data("latitude") + '>' + $element.data("name") + '</option>')
            google.maps.event.addListener(marker, 'click', (function() {
                return function() {
                    if (addressTip) {
                        addressTip.close();
                    }
                    if (cacheTip) {
                        cacheTip.close();
                    }
                    hotelTip.close();
                    placeTip.setContent(placeContent);
                    placeTip.open(hotelMap, marker);
                    cacheTip = placeTip;
                };
            })(marker, placeContent, placeTip));
            //placeTip.open(hotelMap,marker);
        });

        $('.places-link').on('click', function(event) {
            $(".places-link").removeClass("active-location");
            $(this).addClass('active-location');
            event.preventDefault();
            hotelTip.close();
            if (addressTip) {
                addressTip.close();
            }
            if (cacheTip) {
                cacheTip.close();
            }



            var $element = $(this),
                position = new google.maps.LatLng($element.data('latitude'), $element.data('longitude')),
                placeContent = "<div style='overflow: hidden; width:300px; '><b>" + $element.data('name') + "</b><br>" + $element.data('address') + "<br>";
            addressTip = new google.maps.InfoWindow({
                maxWidth: 400,
                position: position,
                content: placeContent
            });
            var mId = $element.data('latitude') + '--' + $element.data('longitude');
            var m = markers[mId];
            addressTip.open(hotelMap, m);
            $(".location").attr("src", $element.attr('data-image-src'));
            $(".location").attr("alt", $element.attr('data-image-alt'));
            $(".text-header").html($element.data('name'));
            $(".text-content").html($element.data('description'));
            hotelMap.panTo(position);
            hotelMap.setZoom(15);
        });
        var modes = [];
        modes['G_TRAVEL_MODE_DRIVING'] = google.maps.TravelMode.DRIVING;
        modes['G_TRAVEL_MODE_BICYCLING'] = google.maps.TravelMode.BICYCLING;
        modes['G_TRAVEL_MODE_TRANSIT'] = google.maps.TravelMode.TRANSIT;
        modes['G_TRAVEL_MODE_WALKING'] = google.maps.TravelMode.WALKING;

        $('#getDirection').on('click', function(event) {
            event.preventDefault();
            var startLat = $('#toDirection').find('option:selected').data('latitude'),
                startLng = $('#toDirection').find('option:selected').data('longitude'),
                endLat = $('#fromDirection').find('option:selected').data('latitude'),
                endLng = $('#fromDirection').find('option:selected').data('longitude');
            var request = {
                origin: new google.maps.LatLng(startLat, startLng),
                destination: new google.maps.LatLng(endLat, endLng),
                travelMode: google.maps.TravelMode.DRIVING
            };
            hotelDirectionService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    hotelTip.close();
                    if (addressTip) {
                        addressTip.close();
                    }
                    hoteldirectionsDisplay.setDirections(response);
                    hoteldirectionsDisplay.setPanel(document.getElementById("directionsPanel"));
                } else {
                    alert(status);
                }
            });
        });

    }

    /** Start Added for Booking Form closing **/
    function closeBooking() {

        if (focusform == false && onform == false && accordionopen == true) {
            // console.log('close booking function clicked');
            $("#collapseOne").collapse('hide');
            togglecaret();
            $("#accordion .panel-heading").addClass("collapsed");
            accordionopen = false;
            $("#bookingForm .tohide").css('display', 'none');
            // $("#overlay").removeClass('open-overlay').hide();
            $("#bookingForm").removeClass('open');
            $(".abs_parent").css('z-index', '1');
            $(".second-last-block").show();
        }

    }

    //below function required on all pages
    function togglecaret() {
        $('#accordion .panel-title span').toggleClass("fa-rotate-180");
    }

    function createDropDown(dropdown, target) {
        $("#" + target).remove();
        var source = $(dropdown);
        var selected = source.find("option[selected]");
        if (selected == null || selected.length == 0) {
            source.prop("selectedIndex", 0);
            source.find('option:first').attr("selected", "selected");
            selected = source.find("option[selected]");
        }
        //var options = $("option", source);
        var opts = $(dropdown + " optgroup");
        var ts = $.trim(selected.text());
        if (ts.length > 15) ts = ts.substring(0, 15);
        $(dropdown).after('<dl id="' + target + '" class="dropdown"></dl>');
        $("#" + target).append('<dt><a href="#">' + ts + '</a></dt>');
        $("#" + target).append('<dd><ul></ul></dd>');

        var co = false;
        opts.each(function() {
            co = true;
            $("#" + target + " dd ul").append('<li class="group-header">' +
                $(this).attr('label') + '</li>');
            var options;
            options = $("option", this);
            options.each(function() {
                $("#" + target + " dd ul").append('<li><a href="#">' +
                    $(this).text() + '<span class="value">' +
                    $(this).val() + '</span></a></li>');
            });
        });

        if (co == false) {
            var options = $("option", source);
            options.each(function() {
                $("#" + target + " dd ul").append('<li><a href="#">' +
                    $(this).text() + '<span class="value">' +
                    $(this).val() + '</span></a></li>');
            });
        }

        $(dropdown).hide();

        $("#" + target + " dt a").click(function(e) {
            e.preventDefault();

            if (target == 'target2') {
                $("#target1 dd ul").hide();
                $("#target3 dd ul").hide();
                $("#target4 dd ul").hide();
            }
            if (target == 'target1') {
                $("#target2 dd ul").hide();
                $("#target3 dd ul").hide();
                $("#target4 dd ul").hide();
            }
            if (target == 'target3') {
                $("#target1 dd ul").hide();
                $("#target2 dd ul").hide();
                $("#target4 dd ul").hide();
            }
            if (target == 'target4') {
                $("#target2 dd ul").hide();
                $("#target3 dd ul").hide();
                $("#target1 dd ul").hide();
            }

            $("#" + target + " dd ul").toggle();

            return false;
        });

        $(document).bind('click', function(e) {
            var $clicked = $(e.target);
            if (!$clicked.parents().hasClass("dropdown"))
                $("#" + target + " dd ul").hide();
        });

        $("#" + target + " dd ul li a").click(function(e) {
            e.preventDefault();
            var text = $(this).html();
            text = removeElements(text, 'span');
            $("#" + target + " dt a").html(text);
            $("#" + target + " dd ul").hide();

            var source = $(dropdown);
            source.val($(this).find("span.value").html());

            if (dropdown == '#Loc') {
                updateHotel();
            }
            return false;
        });
    }

    var removeElements = function(text, selector) {
        var wrapped = $("<div>" + text + "</div>");
        wrapped.find(selector).remove();
        var ret = $.trim(wrapped.html());
        return ret.substring(0, 15);
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
            //console.log(a);
            $.map(a, function(ele) {
                //console.log(ele);
                postData[ele.name] = ele.value;
            });
            //console.log(postData);
            //console.log(jQuery.parseJSON(JSON.stringify(postData)));
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

                        if (typeof(formsubSucces) === typeof(Function)) {
                            formsubSucces();
                        }
                    } else {
                        $('#message-' + id).removeClass('text-success').addClass('text-danger').html(errmsg);
                        $('#message-' + id).fadeIn('fast');

                        if (typeof(formsubError) === typeof(Function)) {
                            formsubError();
                        }
                    }
                    submitform = false;
                    $("#form-" + id).fadeTo(200, 1);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#message-' + id).removeClass('text-success').addClass('text-danger').html(errmsg);
                    $('#message-' + id).fadeIn('fast');
                    submitform = false;
                    $("#form-" + id).fadeTo(200, 1);

                    if (typeof(formsubError) === typeof(Function)) {
                        formsubError();
                    }
                }
            });
        }
    }

    function formsubscribe(id) {
        var submitform = false;
        if (submitform == false) {
            $('#subscribeMessage-' + id).fadeOut(100);
            submitform = true;
            var postData = {};
            var a = $('#subscribeForm-' + id).serializeArray();
            // console.log(a);
            $.map(a, function(ele) {
                // console.log(ele);
                postData[ele.name] = ele.value;
            });
            // console.log(postData);
            // console.log(jQuery.parseJSON(JSON.stringify(postData)));
            var formURL = $('#subscribeForm-' + id).attr("action");
            $('#subscribeForm-' + id).fadeTo(200, .4);
            $.ajax({
                url: formURL,
                type: "POST",
                data: jQuery.parseJSON(JSON.stringify(postData)),
                success: function(data, textStatus, jqXHR) {
                    if (data == 1) {
                        $('#subscribeMessage-' + id).removeClass('text-danger').addClass('text-success').html('Thank you. You have been subscribed.');
                        $('#subscribeMessage-' + id).fadeIn('fast').delay(4000).fadeOut(700);
                        $('#subscribeForm-' + id)[0].reset();
                    } else {
                        $('#subscribeMessage-' + id).removeClass('text-success').addClass('text-danger').html('Sorry something went wrong, you might want to try again.');
                        $('#subscribeMessage-' + id).fadeIn('fast');
                    }
                    submitSubscribeform = false;
                    $('#subscribeForm-' + id).fadeTo(200, 1);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#subscribeMessage-' + id).removeClass('text-success').addClass('text-danger').html('Sorry something went wrong, you might want to try again.');
                    $('#subscribeMessage-' + id).fadeIn('fast');
                    submitSubscribeform = false;
                    $('#subscribeForm-' + id).fadeTo(200, 1);

                    if (typeof(formsubError) === typeof(Function)) {
                        formsubError();
                    }
                }
            });
        }
        return false;
    }

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

    function homepageSliderInitialization() {
        if ($("#homepage-carousel").children().length == 1) {
            $('#homepage-carousel').camera({
                height: '56.25%',
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'none',
                autoAdvance: false,
                pagination: false,
                navigation: false,
                overlayer: false,
                playPause: false
            });
        } else {
            $('#homepage-carousel').camera({
                height: '56.25%',
                loader: 'none',
                thumbnails: false,
                hover: false,
                opacityOnGrid: false,
                fx: 'simpleFade',
                pauseOnClick: false,
                time: 5000,
                transPeriod: 1500,
                pagination: true,
                navigation: false,
                playPause: false,
                overlayer: false,
                imagePath: '../css/images/'
            });
        }
    }

    function bookingFormOverlay() {
        $(document).on('click', '.dp-holder input', function() {
            $("#bookingForm .tohide").css('display', 'block');
            $(".abs_parent").css('z-index', '201');
            $("#ui-datepicker-div").css('z-index', '202');
            $("#bookingForm").addClass('open');
            $(".second-last-block").hide();

            var docHeight = $(document).height();
            // $("#overlay").height(docHeight).addClass('open-overlay').show();
        });


        $(document).on('click', '.open-booking-form', function() {
            $("#bookingForm .tohide").css('display', 'block');
            $(".abs_parent").css('z-index', '201');
            $("#ui-datepicker-div").css('z-index', '202');
            $("#bookingForm").addClass('open');
            $(".second-last-block").hide();

            var docHeight = $(document).height();
            // $("#overlay").height(docHeight).addClass('open-overlay').show();
        });


        $(document).on('click', '.close-booking-form', function() {
            $("#bookingForm .tohide").css('display', 'none');
            // $("#overlay").removeClass('open-overlay').hide();
            $("#bookingForm").removeClass('open');
            $(".abs_parent").css('z-index', '1');
            $(".second-last-block").show();
        });

        $(document).on('click', '#overlay', function() {
            $("#bookingForm .tohide").css('display', 'none');
            // $("#overlay").removeClass('open-overlay').hide();
            $("#bookingForm").removeClass('open');
            $(".abs_parent").css('z-index', '1');
            $(".second-last-block").show();
        });

        // $(document).on('click', 'header', function() {
        //     $("#bookingForm .tohide").css('display', 'none');
        //     $("#overlay").removeClass('open-overlay').hide();
        //     $("#bookingForm").removeClass('open');
        //     $(".abs_parent").css('z-index', '1');
        //     $(".second-last-block").show();
        // });
    }

    function caption_alignment() {
        var calculated_bottom = $(".homepage-carousel-address-bar").height() + 50;
        $(".camera_caption").css("bottom", calculated_bottom);
    }

    function innerpageBookingFormOverlay() {
        $(document).on('click', '#overlay', function() {
            $("#overlay").toggleClass('open-overlay');
        });
    }

    function checkHomepageBookingFormNoOfChildElements() {
        if ($("#booking-form").children(".form-group").length > 2) {
            $(".close-form-block").show();
            $(".open-form-block").show();
        } else {
            $(".close-form-block").hide();
            $(".open-form-block").hide();
        }
    }

    // function new_clock() {
    //   // Create two variable with the names of the months and days in an array
    //     var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //     var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    //     // Create a newDate() object
    //     var newDate = new Date();
    //     // Extract the current date from Date object
    //     newDate.setDate(newDate.getDate());
    //     // Output the day, date, month and year
    //     $('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

    //     setInterval(function() {
    //         // Create a newDate() object and extract the seconds of the current time on the visitor's
    //         var seconds = new Date().getSeconds();
    //         // Add a leading zero to seconds value
    //         $("#sec").html((seconds < 10 ? "0" : "") + seconds);
    //     }, 1000);

    //     setInterval(function() {
    //         // Create a newDate() object and extract the minutes of the current time on the visitor's
    //         var minutes = new Date().getMinutes();
    //         // Add a leading zero to the minutes value
    //         $("#min").html((minutes < 10 ? "0" : "") + minutes);
    //     }, 1000);

    //     setInterval(function() {
    //         // Create a newDate() object and extract the hours of the current time on the visitor's
    //         var hours = new Date().getHours();

    //         //var hours = new Date().getHours();

    //         var dd = "AM";
    //         var h = hours;
    //         if (h >= 12) {
    //         h = hours-12;
    //         dd = "PM";
    //         }
    //         if (h == 0) {
    //         h = 12;
    //         }
    //         console.log(dd);
    //         // Add a leading zero to the hours value
    //         $("#hours").html((hours < 10 ? "0" : "") + h);
    //         $("#am-or-pm").html(dd);
    //     }, 1000);
    // }



    // function formSubmit() {

    //     var arrival_date = $(".arrival-date-input").val();
    //     var a_valid = moment(arrival_date, 'MM/DD/YYYY', true).isValid();
    //     var departure_date = $(".departure-date-input").val();
    //     var d_valid = moment(departure_date, 'MM/DD/YYYY', true).isValid();
    //     if (a_valid == true && d_valid == true) {
    //         a = moment(arrival_date).format("YYYY-MM-DD");
    //         d = moment(departure_date).format("YYYY-MM-DD");
    //         var formUrl = 'https://aloha-ganges.reztrip.com/search?rooms=1&arrival_date=' + a + '&departure_date=' + d + '&adults0=' + 1 + '&children0=' + 0 + '';
    //         document.bookingForm1.action = formUrl;
    //         document.getElementById('rezbook').href = formUrl;
    //         return true;
    //     }
    // }

    // function formSubmit1() {

    //     var arrival_date = $(".arrival-date-input").val();
    //     var a_valid = moment(arrival_date, 'MM/DD/YYYY', true).isValid();
    //     var departure_date = $(".departure-date-input").val();
    //     var d_valid = moment(departure_date, 'MM/DD/YYYY', true).isValid();
    //     var adults = $("#adult").val();
    //     var children = $("#child").val();
    //     if (a_valid == true && d_valid == true) {
    //         a = moment(arrival_date).format("YYYY-MM-DD");
    //         d = moment(departure_date).format("YYYY-MM-DD");
    //         var formUrl = 'https://aloha-ganges.reztrip.com/search?rooms=1&arrival_date=' + a + '&departure_date=' + d + '&adults0=' + 1 + '&children0=' + 0 + '';
    //         document.bookingForm1.action = formUrl;
    //         document.getElementById('rezbook1').href = formUrl;
    //         return true;
    //     }
    // }

    // var myVar;
    // var enable = function() {
    //     document.getElementById('arrival_dat').removeAttribute("disabled");
    //     document.getElementById('departure_dat').removeAttribute("disabled")
    // }


    function initLightBox() {
        $.fn.ekkoLightbox.defaults.loadingMessage = "<div class='text-center'><i class='fa fa-spinner fa-spin'></i></div>";
        $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
            event.preventDefault();
            $(this).ekkoLightbox({
                'left_arrow_class': '.fa-arrow-left',
                'right_arrow_class': '.fa-arrow-right'
            });
        });
    }


    function calcWidth() {
        // console.log('came inside calcwidth');
        var navwidth = 0;
        var morewidth = $('#top-navbar-collapse .more').outerWidth(true);
        // console.log('morewidth is '+morewidth);
        $('#top-navbar-collapse li:not(.more)').each(function() {
            navwidth += $(this).outerWidth(true);
            // console.log('navwidth outer width is '+navwidth);
        });
        var availablespace = $('.nav').outerWidth(true) - morewidth - 90;
        // console.log('avaliable space is '+availablespace);

        if (availablespace > 0 && navwidth > availablespace) {
            var lastItem = $('#top-navbar-collapse > li:not(.more)').last();
            // console.log('last item is  '+lastItem);
            lastItem.attr('data-width', lastItem.outerWidth(true));
            lastItem.prependTo($('#top-navbar-collapse .more ul'));
            calcWidth();
        } else {
            var firstMoreElement = $('#top-navbar-collapse li.more li').first();
            // console.log('last item is  '+firstMoreElement);
            // console.log('first more element  '+firstMoreElement);
            if (navwidth + firstMoreElement.data('width') < availablespace) {
                firstMoreElement.insertBefore($('#top-navbar-collapse .more'));
            }
        }
        if ($('.more li').length > 0) {
            $('.more').removeClass('hidden');
        } else {
            $('.more').addClass('hidden');
        }
    }

    // reservation button on top right corner of navbar

    function reservation_top_nav() {
        $('#navTopbookingform').css("min-height", "0");
        $(".resv_button").on("click", function(e) {

            e.preventDefault();

            //$('#topBookingForm').css({"height":"auto","padding":"20px 0px"});

            $('#navTopbookingform').toggleClass("openedform");
            var nht_value = $('.abs_parent').outerHeight();
            var nht = nht_value + "px";

            if ($('#navTopbookingform').hasClass("openedform")) {
                $('#navTopbookingform').css("min-height", nht);
                $('.resv_button .whenclosed').fadeOut('slow', function() {
                    $('.resv_button').addClass('open');
                    $('.resv_button .whenopened').fadeIn('slow');
                });

            } else {

                $('#navTopbookingform').css("min-height", "0");
                $('.resv_button .whenopened').fadeOut('slow', function() {
                    $('.resv_button').removeClass('open');
                    $('.resv_button .whenclosed').fadeIn('slow');
                });
            }

        });

        // if ($('.navbar-button').length) {
        //     $('.resv_button').hide();
        //     $('.topresv_area').hide();
        // }
    }

    function onScrollSocialicons() {
        $(".wtsocialicons").hide();
        $(window).scroll(function() {
            if ($(window).scrollTop() > 600) {
                $(".wtsocialicons").show('slow');
            } else {
                $(".wtsocialicons").hide('slow');
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

    function dockPromoBanner() {
        if ($(this).scrollTop() > 0) {
            $('.promotions-holder').addClass('fixed_promo');
        } else {
            $('.promotions-holder').removeClass('fixed_promo');
        }
    }

    function closePromoBanner() {
        $('.close_promo').on('click', function() {
            $('.promotions-holder').hide();
            $('.blank_box').hide();
        });
    }
