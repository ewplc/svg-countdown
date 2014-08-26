function calculateTimeUntil(to) {
  var now = Date.now() / 1000;
  var diff = Math.round(to - now);
  var days = Math.floor(diff / 86400);
  diff = diff % 86400;
  var hours = Math.floor(diff / 3600);
  diff = diff % 3600;
  var minutes = Math.floor(diff / 60);
  var seconds = diff % 60;
  return {days: days, hours: hours, minutes: minutes, seconds: seconds};
}  

function svgCountdown(elements) {
  var i = 0, l = elements.length;
  for(;i<l;i++) {
    elements[i].dataset.unixTimestamp = (new Date(elements[i].dateTime || elements[i].getAttribute('datetime'))).getTime() / 1000;
    var diff = calculateTimeUntil(elements[i].dataset.unixTimestamp);

    var countdownContainer = document.createElement('div');
    countdownContainer.id = 'countdownContainer';
    countdownContainer.style.display = 'none';
    elements[i].parentNode.insertBefore(countdownContainer, elements[i].nextSibling);

    var c = ['seconds', 'minutes', 'hours', 'days'], j = 0, m = c.length;
    for(;j<m;j++) {

      var animationDelay, animationOffset;
      switch(c[j]) {
        case 'seconds':
          animationDelay = 60; animationOffset = -(60 - (diff[c[j]])); break;
        case 'minutes':
          animationDelay = 3600; animationOffset = -(3600 - (diff[c[j]] * 60)); break;
        case 'hours':
          animationDelay = 86400; animationOffset = -(86400 - (diff[c[j]] * 3600)); break;
        case 'days':
          animationDelay = 31536000; animationOffset = -(31536000 - (diff[c[j]] * 86400)); break;
      }

      var countdownComponent = document.createElement('div');
      countdownComponent.className = 'countdownComponent ' + c[j];
      countdownContainer.appendChild(countdownComponent);
      var style = window.getComputedStyle(countdownComponent);
      var width = parseInt(style.width);
      var fragment = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" xml:space="preserve" id="countdown">\
<circle class="bg" cx="50%" cy="50%" r="50%" stroke-width="0" /> \
<circle cx="50%" cy="50%" r="43.6363636%" class="progressbar" transform="rotate(-90 ' + width / 2 + ' ' + width / 2 + ')" /> \
<circle class="overlay" cx="50%" cy="50%" r="37.2727273%" stroke-width="0" /> \
<text class="label" y="50%" x="50%" dy="-1.2em" /> \
<text class="time" y="50%" x="50%" dy="0.4em" /> \
</svg>';

      countdownComponent.innerHTML = fragment;
      
      var progressBar = (countdownComponent.getElementsByClassName('progressbar'))[0];
      var strokeLength = 2 * 3.14159265359 * ( (width/2) - ((
        parseInt(window.getComputedStyle(progressBar).strokeWidth)
      ) / 2));
      progressBar.style.strokeDasharray = progressBar.style.strokeDashoffset = strokeLength;
      if(c[j] === 'days') { // Don't animate years.
        progressBar.style.strokeDashoffset = strokeLength - (strokeLength / 365) * diff['days'];
      }
      else{
        progressBar.style.animationDuration = animationDelay + 's';
        progressBar.style.animationIterationCount = 'infinite';
        progressBar.style.animationName = c[j] + 'countdown';
        progressBar.style.animationTimingFunction = 'linear';
        progressBar.style.animationDelay = animationOffset + 's';
        
        progressBar.style.webkitAnimationDuration = animationDelay + 's';
        progressBar.style.webkitAnimationIterationCount = 'infinite';
        progressBar.style.webkitAnimationName = c[j] + 'countdown';
        progressBar.style.webkitAnimationTimingFunction = 'linear';
        progressBar.style.webkitAnimationDelay = animationOffset + 's';
        
        progressBar.style.mozAnimationDuration = animationDelay + 's';
        progressBar.style.mozAnimationIterationCount = 'infinite';
        progressBar.style.mozAnimationName = c[j] + 'countdown';
        progressBar.style.mozAnimationTimingFunction = 'linear';
        progressBar.style.mozAnimationDelay = animationOffset + 's';
        
        progressBar.style.oAnimationDuration = animationDelay + 's';
        progressBar.style.oAnimationIterationCount = 'infinite';
        progressBar.style.oAnimationName = c[j] + 'countdown';
        progressBar.style.oAnimationTimingFunction = 'linear';
        progressBar.style.oAnimationDelay = animationOffset + 's';
      }
      
      var cssFragment = '@-webkit-keyframes ' + c[j] + 'countdown {\
        from{stroke-dashoffset: 0;}\
        to {stroke-dashoffset:' + strokeLength + ';}\
      }\
      @-moz-keyframes ' + c[j] + 'countdown {\
        from{stroke-dashoffset: 0;}\
        to {stroke-dashoffset:' + strokeLength + ';}\
      }\
      @-o-keyframes ' + c[j] + 'countdown {\
        from{stroke-dashoffset: 0;}\
        to {stroke-dashoffset:' + strokeLength + ';}\
      }\
      @keyframes ' + c[j] + 'countdown {\
        from{stroke-dashoffset: 0;}\
        to {stroke-dashoffset:' + strokeLength + ';}\
      }';
      var style = document.createElement('style');
      style.textContent = cssFragment;
      document.head.appendChild(style);
      
      var label = (countdownComponent.getElementsByClassName('label'))[0];
      var countdown = (countdownComponent.getElementsByClassName('time'))[0];

      label.textContent = c[j].toUpperCase();
      window.setInterval(function(countdown, toTimestamp, component) {
        diff = calculateTimeUntil(toTimestamp);
        countdown.textContent = "" + diff[component];
      }.bind(this, countdown, elements[i].dataset.unixTimestamp, c[j]), 200);
    }
    
    countdownContainer.style.display = null;
  }
}
