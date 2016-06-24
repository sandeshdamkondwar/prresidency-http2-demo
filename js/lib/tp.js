/*  console.log("in 3rd party js file!");
 */
/* for Local weather */
if ($('.weather-widget')[0]) {
    var locationId = $('.weather-widget').data('location-id');
    $('.weather-widget').weatherfeed([locationId]);
}

/* for Local time */

if ($('.timer-widget')[0]) {
    var latLng = $('.timer-widget').data('lat-lng');
    // console.log(latLng);
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/timezone/json?location=' + latLng + '&timestamp=1331161200&sensor=true',
        type: 'GET',
        dataType: 'JSON'
    }).done(function(response) {
        // console.log(response);
        // console.log(response.dstOffset);
        // console.log(response.rawOffset);
        var x = response.rawOffset;
        // console.log(x);
        $('#digital-clock').clock({
            offset: x,
            type: 'digital'
        });
    });
}

/* for FB */

// the old facebook feed loading code

if($('.fb-wrapper').data('fb')=='show'){
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js#xfbml=1&appId=1406041866315052";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}


// the new facebook feed loading code

// if ($('.fb-wrapper').data('fb') == 'show') {
//     (function(d, s, id) {
//         var js, fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) return;
//         js = d.createElement(s);
//         js.id = id;
//         js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.4";
//         fjs.parentNode.insertBefore(js, fjs);
//     }(document, 'script', 'facebook-jssdk'));
// }


/* for twitter */

if ($('.twitter-follow-button')[0]) {
    ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + '://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, 'script', 'twitter-wjs');
}


/* for Gplus */

if ($('#___plusone_0')) {
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
}
