
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var street=$("#street").val();
    var city=$("#city").val();
    var location=street+", "+city;
    $greeting.text("Are you going to live at "+location+"?");
    var streetURL="https://maps.googleapis.com/maps/api/streetview?size=600x400&location="+location+"&key=AIzaSyCGCULf6_E5s5Rlv-jjATbAa48dV7cIhgM";
    $body.append('<img class="bgimg" src="'+streetURL+'"/>');

    var nytimesUrl='http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+
    city+'&sort=newest&api-key=a20918469af5400fb87c17aa13e66fe3'
    $.getJSON(nytimesUrl,function(data){
        $nytHeaderElem.text("New York Times Articles About "+city);
        articles=data.response.docs;
        for(var i=0;i<articles.length;i++){
            var article=articles[i];
            var aTag='<a href="'+article.web_url+'">'+article.headline.main+'</a>';
            var pTag='<p>'+article.snippet+'</p>';
            $nytElem.append('<li class="article">'+aTag+pTag+'</li>');
        }
    }).error(function(){
        $nytHeaderElem.text("unable to do that");
    });

    var wikiUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search='
    +city+'&format=json&callback=wikiCallback';
    var wikiRequestTimeout=setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },10000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",}).done(function(response){
            var articlelist=response[1];
            for (var i=0;i<articlelist.length;i++){
                articleStr=articlelist[i];
                var url='http://wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
                clearTimeout(wikiRequestTimeout);
            }
        });
    return false;
};

$('#form-container').submit(loadData);
