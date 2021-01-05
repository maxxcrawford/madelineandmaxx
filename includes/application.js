$(document).ready(function() {

    // var clock = $('.your-clock').FlipClock({


    // });



    var str2 = new Date();
    var str1 = new Date("October 13, 2012 17:00:00");
    var diff =  Math.floor(( Date.parse(str2) - Date.parse(str1) ) / 86400000);

    var clock = $('.your-clock').FlipClock(3600 * 24 * diff, {
        clockFace: 'DailyCounter',
        countdown: false
        // showSeconds: false
    });

});