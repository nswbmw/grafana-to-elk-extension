;(function(){
  var kibanaUrl = `${window.location.protocol}//${window.location.host}`
  // 1. add requestId link
  setInterval(addRequestLink, 5000);
  // 2. redirect
  var url = window.location.href;
  var timeRangeStr = ''
  var timeRangeReg = /from=(.+?)\&to=(.+?)\&/;
  var matched = url.match(timeRangeReg);
  if (!matched) {
    return;
  }
  var from = formatDate(matched[1]);
  var to = formatDate(matched[2]);
  if (!isNaN(+from) && !isNaN(+to)) {
    timeRangeStr = `time:(from:'${formatDate(from)}',mode:absolute,to:'${formatDate(to)}')`;
  } else {
    timeRangeStr = `time:(from:'${from}',mode:quick,to:'${to}')`;
  }
  var name = url.match(/name=([^&]+)/)[1]
  var routerName = url.match(/routerName=([^&]+)/)[1]

  return window.location = `${kibanaUrl}/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),${timeRangeStr})&_a=(columns:!(routerName,sumOfTake,requestId),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'name:%22${name}%22%20AND%20routerName:%22${routerName}%22%20AND%20_exists_:sumOfTake')),sort:!('@timestamp',asc))`;

  function formatDate(date) {
    // timestamp
    if (String(+date) === date) {
      return moment(+date).format('YYYY-MM-DDTHH:mm:ss.SSS');
    } else {
      return date;
    }
  }

  function addRequestLink() {
    try {
      [].slice.call(document.querySelectorAll(".truncate-by-height,.doc-viewer-value")).forEach(function (item) {
        if (item.innerText.trim().match(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/)) {
          var time = item.baseURI.match(/time\:\(.*?\)/)[0];
          var uuid = item.innerText;
          var url = `${kibanaUrl}/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),${time})&_a=(columns:!(step,take,error.message),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:%22${uuid}%22)),sort:!(step,asc))`;
          item.innerHTML = `<a href="${url}" target="_blank">${item.innerText}</a>`.replace('&amp;', '&');
        }
      });
      [].slice.call(document.querySelectorAll('[title=fn].doc-viewer-field')).forEach(function (item) {
        var fnItem = item.parentElement.children[2].children[0];
        fnItem.innerHTML = `<mark>${fnItem.innerText}</mark>`;
      });
    } catch (e) {}
  }
})();
