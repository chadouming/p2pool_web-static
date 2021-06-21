// ======================================================================
// formats a given hashrate (H/s) to humand readable hashrate
// like xxx.yyy GH/s
// ======================================================================
var formatHashrate = function(rate) {
    rate = parseFloat(rate);
    unit = 'H/s';
    if (rate >= 1000) { rate /= 1000; unit = 'KH/s'; }
    if (rate >= 1000) { rate /= 1000; unit = 'MH/s'; }
    if (rate >= 1000) { rate /= 1000; unit = 'GH/s'; }
    if (rate >= 1000) { rate /= 1000; unit = 'TH/s'; }
    if (rate >= 1000) { rate /= 1000; unit = 'PH/s'; }

    return (rate.toFixed(2) + ' ' + unit);
}

// ======================================================================
// formats a given int value to human readable si format
// ======================================================================
var formatInt = function(rate) {
    rate = parseFloat(rate);
    unit = '';
    if (rate >= 1000) { rate /= 1000; unit = 'k'; }
    if (rate >= 1000) { rate /= 1000; unit = 'M'; }
    if (rate >= 1000) { rate /= 1000; unit = 'G'; }
    if (rate >= 1000) { rate /= 1000; unit = 'T'; }

    return ((unit == '' ? rate.toFixed(0) : rate.toFixed(2)) + unit);
}

// ======================================================================
// format seconds to an interval like '1d 7h 5s'
// ======================================================================
String.prototype.formatSeconds = function () {
    var sec_num = parseInt(this, 10);
    var days    = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400  + hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    var time = '';
    if (days > 0) { time += days + 'd '; }
    time += hours + 'h ' + minutes + 'm ' + seconds + 's';

    return time;
}

String.prototype.formatUptime = function () {
    var sec_num = parseInt(this, 10);
    var days    = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400  + hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    var time = '';
    if (days > 0) { time += days + ' days '; }
    time += hours + ' hours ';

    return time;
}

// ======================================================================
// Sorts a dict by value
// ======================================================================
function sortByValue(toSort) {
    var keys = Object.keys(toSort);
    keys.sort(function(a, b) {
        return toSort[a] < toSort[b] ? -1 : (toSort[a] === toSort[b] ? 0 : 1);
    });

    return keys;
}

// ======================================================================
// Creates a span with a badge for known addresses
// ======================================================================
function createAddressBadge(address) {
  var badge_label = '';
  var badge_type = '';
  switch(address){
    case 'VfPiNMmNzxN3phoTgFohWpFvX4MAHSg5wx':
      badge_label = 'General Dev Fund';
      badge_type = 'success';
      break;
    case 'Vkarmr89p5fJVAoWJCcbqLWu4Cv7YAWLu9':
      badge_label = 'Achilles';
      badge_type = 'secondary';
      break;
    case 'Vs48VyKo8vCnsVx6faHtq1XaG9jC8mTmxk':
      badge_label = 'Demo';
      badge_type = 'secondary';
      break;
    case 'VdMVwYLairTcYhz3QnNZtDNrB2wpaHE21q':
      badge_label = 'Dev: Turekaj';
      badge_type = 'success';
      break;
    case 'VgLwpZp44cn4k1qQ4idNe295PXi4RhDLLs':
      badge_label = 'Cerberus';
      badge_type = 'secondary';
      break;
    case 'VtyUy9SLmnar9DN7gRdF8shyRpDCnvhbnh':
      badge_label = 'Madcats';
      badge_type = 'secondary';
      break;
    case 'VhyrVREb22cQD1CKyjanS5hFnZ7A85guhr':
      badge_label = 'Zeus';
      badge_type = 'secondary';
      break;
    case 'VuSrUQrtc2jvJyeP9JvzeQdnmsxcqCWoWw':
      badge_label = 'Tortoise';
      badge_type = 'secondary';
      break;
    case 'VaY5yvFBUByguRdepA1wyDE1v3aSx58Gp4':
      badge_label = '42';
      badge_type = 'secondary';
      break;
    case 'VhaKdwG4YfWYemvuuPjNDPH91U2n6DxDpo':
      badge_label = 'P2Proxy';
      badge_type = 'success';
      break;
    case 'VqAYLWXUXCx5Nga5WBC2eSPWmwFn8N2QM6':
      badge_label = 'Nicehash';
      badge_type = 'secondary';
      break;
    case 'VfiQwknmacbpSbpVzhd93TJTrR82dpG4gw':
      badge_label = 'T-800';
      badge_type = 'secondary';
      break;
    default:
      badge_label = '';
      badge_type = '';
  }
  if (badge_label == '') {
    return '';
  } else {
    return '<span class="u-ml-small c-badge c-badge--' + badge_type + ' c-badge--xsmall">' + badge_label + '</span>';
  }
}
