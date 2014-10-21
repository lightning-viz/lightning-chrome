
var host = 'lightning.mathisonian.com';


chrome.storage.sync.get({
    host: 'lightning.mathisonian.com'
}, function(items) {
    host = items.host;
});

chrome.storage.onChanged.addListener(function(changes, name) {
    if(changes.host) {
        host = changes.host.newValue;
    }
});

var formatUrl = function(gitUrl, path) {

    var url = 'http://' + host + '/visualization-types/preview/?url=' + gitUrl;
    if(path) {
        url += '&path=' + path;
    }

    return url;
};

chrome.browserAction.onClicked.addListener(function callback(activeTab) {

    var url = activeTab.url;
    var previewURL;

    // check if 
    // example urls:
    //
    // bare github: https://github.com/mathisonian/lightning-default-visualizations
    // https://github.com/mathisonian/lightning-default-visualizations.git
    // github in a folder: https://github.com/mathisonian/lightning-default-visualizations/tree/master/line
    //
    // https://gist.github.com/mathisonian/77853979c58be91eb13c

    // should translate to:
    //
    // URL:
    // PATH: 
    //
    // https://gist.github.com/77853979c58be91eb13c.git

    if(url.indexOf('gist.github.com') > -1) {
        
        var gitUrl = 'https://gist.github.com' + url.substring(url.lastIndexOf('/')) + '.git';
        previewURL = formatUrl(gitUrl);

    } else if(url.indexOf('github.com') > -1) {


        var githubPathRegex = /(https?:\/\/github.com\/[^\/]+\/[^\/]+)\/tree\/master\/(.*)/;
        var pathMatch = githubPathRegex.exec(url)

        if(pathMatch) {
            var gitUrl = pathMatch[1] + '.git';
            var path = pathMatch[2];
            previewURL = formatUrl(gitUrl, path);
        } else {
            var githubRegex = /(https?:\/\/github.com\/[^\/]+\/[^\/]+)\/?/;
            var match = githubRegex.exec(url);
            var gitUrl = pathMatch[1] + '.git';
            previewURL = formatUrl(gitUrl);
        }
    }

    if(previewURL) {
        chrome.tabs.create({ url: previewURL });
    } else {
        alert('Could not parse this URL for a git repository. If this is a mistake please see <chrome ext repo>')
    }

});
