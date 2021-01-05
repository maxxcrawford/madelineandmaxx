/*
 * jquery-counter plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 */
jQuery.fn.countdown = function(userOptions)
{
  // Default options
  var options = {
    stepTime: 60,
    // startTime and format MUST follow the same format.
    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
    format: "dd:hh:mm:ss",
    startTime: GetStartTime(),
    digitImages: 6,
    digitWidth: 53,
    digitHeight: 77,
    timerEnd: function(){},
    image: "digits.png"
  };
  var digits = [], interval;

  // Draw digits in given container
  var createDigits = function(where) 
  {
    var c = 0;
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    for (var i = 0; i < options.startTime.length; i++)
    {
      if (parseInt(options.startTime[i]) >= 0) 
      {
        elem = $('<div id="cnt_' + i + '" class="cntDigit" />').css({
          height: options.digitHeight * options.digitImages * 10, 
          float: 'left', background: 'url(\'' + options.image + '\')',
          width: options.digitWidth});
        digits.push(elem);
        margin(c, -((parseInt(options.startTime[i]) * options.digitHeight *
                              options.digitImages)));
        digits[c].__max = 9;
        // Add max digits, for example, first digit of minutes (mm) has 
        // a max of 5. Conditional max is used when the left digit has reach
        // the max. For example second "hours" digit has a conditional max of 4 
        switch (options.format[i]) {
          case 'h':
            digits[c].__max = (c % 2 == 0) ? 2: 9;
            if (c % 2 == 0)
              digits[c].__condmax = 4;
            break;
          case 'd': 
            digits[c].__max = 9;
            break;
          case 'm':
          case 's':
            digits[c].__max = (c % 2 == 0) ? 5: 9;
        }
        ++c;
      }
      else 
        elem = $('<div class="cntSeparator"/>').css({float: 'left'})
                .text(options.startTime[i]);

      where.append(elem)
    }
  };
  
  // Set or get element margin
  var margin = function(elem, val) 
  {
    if (val !== undefined)
      return digits[elem].css({'marginTop': val + 'px'});

    return parseInt(digits[elem].css('marginTop').replace('px', ''));
  };

  // Makes the movement. This is done by "digitImages" steps.
  var moveStep = function(elem) 
  {
    digits[elem]._digitInitial = -(digits[elem].__max * options.digitHeight * options.digitImages);
    return function _move() {
      mtop = margin(elem) + options.digitHeight;
      if (mtop == options.digitHeight) {
        margin(elem, digits[elem]._digitInitial);
        if (elem > 0) moveStep(elem - 1)();
        else 
        {
          clearInterval(interval);
          for (var i=0; i < digits.length; i++) margin(i, 0);
          options.timerEnd();
          return;
        }
        if ((elem > 0) && (digits[elem].__condmax !== undefined) && 
            (digits[elem - 1]._digitInitial == margin(elem - 1)))
          margin(elem, -(digits[elem].__condmax * options.digitHeight * options.digitImages));
        return;
      }

      margin(elem, mtop);
      if (margin(elem) / options.digitHeight % options.digitImages != 0)
        setTimeout(_move, options.stepTime);

      if (mtop == 0) digits[elem].__ismax = true;
    }
  };

  $.extend(options, userOptions);
  this.css({height: options.digitHeight, overflow: 'hidden'});
  createDigits(this);
  interval = setInterval(moveStep(digits.length - 1), 1000);
};


function GetStartTime() {
	var dateNow = new Date();
	var dateNowElapsedTime = dateNow.getTime() / 1000;
	var dateDeparture = new Date(2012,10-1,13,18,30,0); //Date of 10 September 2011 at midnight) notice the "minus one" for the month...)
	var dateDepartureElapsedTime = dateDeparture.getTime() / 1000;		
	var timeStampInSec = dateDepartureElapsedTime - dateNowElapsedTime;
			
	var minutesTmp = timeStampInSec / 60;
	var seconds = zeroPad(Math.floor(timeStampInSec % 60), 2);
	var hoursTmp = minutesTmp / 60;
	var minutes = zeroPad(Math.floor(minutesTmp % 60), 2);
	var days = zeroPad(Math.floor(hoursTmp / 24), 2);
	var hours = zeroPad(Math.floor(hoursTmp % 24), 2);

	return days + ":" + hours + ":" + minutes + ":" + seconds;
   	}
		
function zeroPad(num,count) {
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
		}
	return numZeropad;
}