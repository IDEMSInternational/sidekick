function pushAllDataAndCreatePR(allArticleNames,jsonObject,imagesAndNames){
  pushAllDataToSheet(allArticleNames,jsonObject,imagesAndNames)
  if (isValidDocument()) {
    test112()
  }
}


var CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET';
var REDIRECT_URI = ScriptApp.getService().getUrl();

//function doGet(e) {
//  var template = HtmlService.createTemplateFromFile('OAuth');
//  return template.evaluate();
//}

function authorize() {
  var state = ScriptApp.newStateToken()
                      .withMethod('callback')
                      .withTimeout(600)
                      .createToken();
  var url = 'https://github.com/login/oauth/authorize?' +
            'client_id=' + CLIENT_ID +
            '&redirect_uri=' + REDIRECT_URI +
            '&scope=repo&state=' + state;
  return url;
}


function test112(){
  var repo = 'IDEMSInternational/app-sample-content';
  var eventType = 'content-sync';
  var branch = 'main';
  var title = 'Testing for docs';
  
  var payload = JSON.stringify({
    event_type: eventType,
    client_payload: {
      branch: branch,
      title: title
    }
  });
  
  var url = 'https://api.github.com/repos/' + repo + '/dispatches';
  
  var options = {
    method: 'POST',
    headers: {
 //     'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json'
    },
    payload: payload
  };


  var url ='https://github.com/IDEMSInternational/app-sample-content/actions/workflows/content-sync.yml'
  testing(url)
  
}

function testing(url){

  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  DocumentApp.getUi().showModalDialog( html, "Opening ..." );
}

function callback(request) {
  var code = request.parameter.code;
  var state = request.parameter.state;
  
  var tokenResponse = UrlFetchApp.fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    payload: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
      state: state
    },
    headers: {
      'Accept': 'application/json'
    }
  });
  var token = JSON.parse(tokenResponse.getContentText()).access_token;
  
  PropertiesService.getUserProperties().setProperty('GITHUB_TOKEN', token);
  
  return HtmlService.createHtmlOutput("Authorization complete. You can close this tab.");
}

function triggerGitHubAction() {
 // var token = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');
 // if (!token) {
 //   var authorizationUrl = authorize();
 //   return HtmlService.createHtmlOutput('<a href="' + authorizationUrl + '" target="_blank">Authorize with GitHub</a>');
 // }
  
  var repo = 'IDEMSInternational/app-sample-content';
  var eventType = 'content-sync';
  var branch = 'main';
  var title = 'Testing for docs';
  
  var payload = JSON.stringify({
    event_type: eventType,
    client_payload: {
      branch: branch,
      title: title
    }
  });
  
  var url = 'https://api.github.com/repos/' + repo + '/dispatches';
  
  var options = {
    method: 'POST',
    headers: {
   //   'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json'
    },
    payload: payload
  };
  
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}