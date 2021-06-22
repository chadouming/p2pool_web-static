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

/*! jquery-dateFormat 01-12-2013 */
!function(a){var b,c,d,e,f=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],g=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],h=["January","February","March","April","May","June","July","August","September","October","November","December"],i={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};a.format=function(){function a(a){return f[parseInt(a,10)]||a}function j(a){var b=parseInt(a,10)-1;return g[b]||a}function k(a){var b=parseInt(a,10)-1;return h[b]||a}var l=function(a){return i[a]||a},m=function(a){var b=a,c="";if(-1!==b.indexOf(".")){var f=b.split(".");b=f[0],c=f[1]}return d=b.split(":"),3===d.length?(e=d[0],minute=d[1],second=d[2],{time:b,hour:e,minute:minute,second:second,millis:c}):{time:"",hour:"",minute:"",second:"",millis:""}},n=function(a,b){for(var c=b-String(a).length,d=0;c>d;d++)a="0"+a;return a},o=function(){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/};return{date:function(d,f){try{var g=null,h=null,i=null,p=null,q=null,r=null;if("number"==typeof d)return this.date(new Date(d),f);if("function"==typeof d.getFullYear)h=d.getFullYear(),i=d.getMonth()+1,p=d.getDate(),q=d.getDay(),r=m(d.toTimeString());else if(-1!=d.search(o()))b=d.split(/[T\+-]/),h=b[0],i=b[1],p=b[2],r=m(b[3].split(".")[0]),g=new Date(h,i-1,p),q=g.getDay();else switch(b=d.split(" "),b.length){case 6:h=b[5],i=l(b[1]),p=b[2],r=m(b[3]),g=new Date(h,i-1,p),q=g.getDay();break;case 2:c=b[0].split("-"),h=c[0],i=c[1],p=c[2],r=m(b[1]),g=new Date(h,i-1,p),q=g.getDay();break;case 7:case 9:case 10:h=b[3],i=l(b[1]),p=b[2],r=m(b[4]),g=new Date(h,i-1,p),q=g.getDay();break;case 1:c=b[0].split(""),h=c[0]+c[1]+c[2]+c[3],i=c[5]+c[6],p=c[8]+c[9],r=m(c[13]+c[14]+c[15]+c[16]+c[17]+c[18]+c[19]+c[20]),g=new Date(h,i-1,p),q=g.getDay();break;default:return d}for(var s="",t="",u="",v=!1,w=0;w<f.length;w++){var x=f.charAt(w);if(v)"'"==x?(t+=""===s?"'":s,s="",v=!1):s+=x;else switch(s+=x,u="",s){case"ddd":t+=a(q),s="";break;case"dd":if("d"==f.charAt(w+1))break;t+=n(p,2),s="";break;case"d":if("d"==f.charAt(w+1))break;t+=parseInt(p,10),s="";break;case"D":p=1==p||21==p||31==p?parseInt(p,10)+"st":2==p||22==p?parseInt(p,10)+"nd":3==p||23==p?parseInt(p,10)+"rd":parseInt(p,10)+"th",t+=p,s="";break;case"MMMM":t+=k(i),s="";break;case"MMM":if("M"===f.charAt(w+1))break;t+=j(i),s="";break;case"MM":if("M"==f.charAt(w+1))break;t+=n(i,2),s="";break;case"M":if("M"==f.charAt(w+1))break;t+=parseInt(i,10),s="";break;case"y":case"yyy":if("y"==f.charAt(w+1))break;t+=s,s="";break;case"yy":if("y"==f.charAt(w+1)&&"y"==f.charAt(w+2))break;t+=String(h).slice(-2),s="";break;case"yyyy":t+=h,s="";break;case"HH":t+=n(r.hour,2),s="";break;case"H":if("H"==f.charAt(w+1))break;t+=parseInt(r.hour,10),s="";break;case"hh":e=0===r.hour?12:r.hour<13?r.hour:r.hour-12,t+=n(e,2),s="";break;case"h":if("h"===f.charAt(w+1))break;e=0===r.hour?12:r.hour<13?r.hour:r.hour-12,t+=parseInt(e,10),s="";break;case"mm":t+=n(r.minute,2),s="";break;case"m":if("m"==f.charAt(w+1))break;t+=r.minute,s="";break;case"ss":t+=n(r.second.substring(0,2),2),s="";break;case"s":if("s"==f.charAt(w+1))break;t+=r.second,s="";break;case"S":case"SS":if("S"==f.charAt(w+1))break;t+=s,s="";break;case"SSS":t+=r.millis.substring(0,3),s="";break;case"a":t+=r.hour>=12?"PM":"AM",s="";break;case"p":t+=r.hour>=12?"p.m.":"a.m.",s="";break;case"'":s="",v=!0;break;default:t+=x,s=""}}return t+=u}catch(y){return d}},prettyDate:function(a){var b,c,d;return("string"==typeof a||"number"==typeof a)&&(b=new Date(a)),"object"==typeof a&&(b=new Date(a.toString())),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400),isNaN(d)||0>d?void 0:60>c?"just now":120>c?"1 minute ago":3600>c?Math.floor(c/60)+" minutes ago":7200>c?"1 hour ago":86400>c?Math.floor(c/3600)+" hours ago":1===d?"Yesterday":7>d?d+" days ago":31>d?Math.ceil(d/7)+" weeks ago":d>=31?"more than 5 weeks ago":void 0},toBrowserTimeZone:function(a,b){return this.date(new Date(a),b||"MM/dd/yyyy HH:mm:ss")}}}()}(jQuery),jQuery.format.date.defaultShortDateFormat="dd/MM/yyyy",jQuery.format.date.defaultLongDateFormat="dd/MM/yyyy HH:mm:ss",jQuery(document).ready(function(){jQuery(".shortDateFormat").each(function(a,b){jQuery(b).is(":input")?jQuery(b).val(jQuery.format.date(jQuery(b).val(),jQuery.format.date.defaultShortDateFormat)):jQuery(b).text(jQuery.format.date(jQuery(b).text(),jQuery.format.date.defaultShortDateFormat))}),jQuery(".longDateFormat").each(function(a,b){jQuery(b).is(":input")?jQuery(b).val(jQuery.format.date(jQuery(b).val(),jQuery.format.date.defaultLongDateFormat)):jQuery(b).text(jQuery.format.date(jQuery(b).text(),jQuery.format.date.defaultLongDateFormat))})});
