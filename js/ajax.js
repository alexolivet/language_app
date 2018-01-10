$(document).ready(function() { // start document ready
    //jQuery has a handy method called $.ajaxSetup() which allows you to set options 
    //that apply to all jQuery based AJAX requests that come after it. 
    //By placing this method in your main document ready function, 
    //all of the settings will be applied to the rest of your functions automatically and in one location.
    //as per jquery doc its use is not recommened.
    $(function() { //error handling start
        //setup ajax error handling
        $.ajaxSetup({
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                var statusCode = jqXHR.status
                var errorMessageRandom = "Please try again." + " " + "Error code:" + " " + statusCode;
                if (jqXHR.status === 0) {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    $('#wordDump').html(errorMessageRandom); // dump error in div
                } else if (jqXHR.status >= 300 && jqXHR.status <= 599) {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    $('#wordDump').html(errorMessageRandom);
                } else if (textStatus === 'parsererror') {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    $('#wordDump').html(errorMessageRandom);
                } else if (textStatus === 'timeout') {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    $('#wordDump').html(errorMessageRandom);
                } else if (textStatus === 'abort') {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    $('#wordDump').html(errorMessageRandom);
                } else {
                    $('#getDefinition').hide();
                    $('#getPicture').hide();
                    alert('Uncaught Error.n' + jqXHR.responseText);
                }
            }
        });
    }); //error handling end

    $(function() {
        $('.next').on('click', function() {
            $('#appSteps>div').each(function() {
                var id = $(this).index();
                if ($(this).is(':visible')) {
                    $(this).hide();
                    if (id == $('#appSteps>div').length - 1) {
                        $('#appSteps>div').eq(0).show();
                    } else {
                        $('#appSteps>div').eq(id + 1).show();
                    }
                    return false;
                }
            });
        });
    });

    $('#startAjax').click(function() {
        //empty all fields before search
        $('#wordDump').empty();
        $('#wordDefinition').empty();
        $('#result').empty();
        $('#caption').empty();
        $('#getDefinition').hide();
        $('#getPicture').hide();
        //clicking on the 'update' button starts the ajax call
        myCalls();
    });
    $('#getDefinition').hide();
    $('#getPicture').hide();

    function myCalls() { //start ajax calls
        // Wordnik API and URL
        var URL = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=d4964566bbc960329e0080f95100263c0431ce19dd14d81a3"
        //var URL = "https://httpstat.us/421?sleep=3000/"
        //var URL = "https://www.w3schools.com/xml/note_error.xml"
        //var URL = "http://elwebman.io/test/"
        // GET request to Wordnik API
        //Perform an asynchronous HTTP (Ajax) request.
        $.ajax({
                method: 'GET',
                //A string containing the URL to which the request is sent.
                url: URL,
                // the type of data we expect back
                dataType: 'json',
                //An object of numeric HTTP codes and functions to be called when the response has the corresponding code.
                statusCode: {
                    200: function() {
                        console.log("200 response for random word search");
                    },
                    503: function() {
                        console.log("Service is unavailable");
                    },
                    401: function() {
                        console.log("401 Unauthorized");
                    },
                    404: function() {
                        console.log("404 page not found");
                    },
                    421: function() {
                        console.log("421 page not found");
                    }

                },
            })
            .done(function(response, data, jqXHR) {
                // This function will executes if response is success
                var word = response.word // get the random word
                if (word.length != 0) {
                    $('#wordDump').addClass('animated fadeIn');
                    $('#wordDump').html(word); // dump the random word on the page
                } else {
                    alert("no random word found");
                    $('#getDefinition').hide();
                };
                setTimeout(function() { //timeout  starts

                    var definitionURL = "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=1&includeRelated=true&useCanonical=true&includeTags=false&api_key=d4964566bbc960329e0080f95100263c0431ce19dd14d81a3"
                    //var definitionURL = "http://elwebman.io/test"
                    //var definitionURL = "https://httpstat.us/404?sleep=3000/"
                    $.ajax({ // call for word definition
                            method: 'GET',
                            //A string containing the URL to which the request is sent.
                            url: definitionURL,
                            // the type of data we expect back
                            dataType: 'json',
                            //An object of numeric HTTP codes and functions to be called when the response has the corresponding code.
                            statusCode: {
                                200: function() {
                                    console.log("200 response for word definition");
                                    $('#getDefinition').show();
                                },
                                503: function() {
                                    console.log("Service is unavailable");
                                },
                                401: function() {
                                    console.log("401 Unauthorized");
                                },
                                404: function() {
                                    console.log("404 page not found");
                                }

                            },
                        })
                        .done(function(response, data, jqXHR) {
                            if (!response[0]) alert("JSON empty");
                            var wordDefinition = response[0].text; //this is the definition
                            //wordDefinition = undefined;
                            if (typeof(wordDefinition) === "undefined") alert("wordDefinition is undefined");
                            if (wordDefinition.length != 0) {
                                $('#wordDefinition').addClass('animated fadeIn');
                                $('#wordDefinition').html(wordDefinition); //place definition on page
                            } else {
                                alert("no word definition");
                                $('#getPicture').hide();
                            };
                            setTimeout(function() { //timeout for unsplash starts
                                //Use encodeURIComponent when you want to encode the value of a URL parameter
                                var str = encodeURIComponent(document.getElementById("wordDefinition").innerHTML);
                                //var imageUrl = "http://elwebman.io/test"
                                //var imageUrl = "https://httpstat.us/404?sleep=3000/"
                                var imageUrl = "https://api.unsplash.com/search/photos/?client_id=8d5285f5ff3b967d3cf4f31b67b5b5134c8f76075f9f8a892d305024f43332fd&query=" + str + "&per_page=1&page=1";
                                $.ajax({ // call for unsplash starts
                                        method: 'GET',
                                        //A string containing the URL to which the request is sent.
                                        url: imageUrl,
                                        // the type of data we expect back
                                        dataType: 'json',
                                        //An object of numeric HTTP codes and functions to be called when the response has the corresponding code.
                                        statusCode: {
                                            200: function() {
                                                console.log("200 response. There is a picture.");
                                                $('#getPicture').show();
                                            },
                                            503: function() {
                                                console.log("503 Service is unavailable. No picture are returned");
                                            },
                                            401: function() {
                                                console.log("401 Unauthorized");
                                            },
                                            404: function() {
                                                console.log("404 page not found");
                                            }
                                        },
                                    })
                                    .done(function(response, data, jqXHR) {
                                        if (response.total != 0) {
                                            //json response variable
                                            var imageLink = response.results[0].urls.small;
                                            var artistName = response.results[0].user.name;
                                            var artistLink = response.results[0].user.links.html;
                                            $('#result').addClass('animated fadeIn');
                                            var resultD = document.getElementById("result"); //get the figure element to place the results
                                            $("#result").html(resultD);
                                            var rImg = document.createElement("img"); // create the image
                                            $('#result').addClass('animated fadeIn');
                                            rImg.src = imageLink;
                                            rImg.setAttribute("class", "animated fadeIn responsive-img");
                                            rImg.setAttribute("crossOrigin", "Anonymous"); //needed so I can actually copy the image for later use
                                            resultD.appendChild(rImg); // append image to link
                                            var caption = document.createElement("figcaption");
                                            caption.setAttribute("id", "caption");
                                            $('#caption').addClass('animated fadeIn');
                                            resultD.appendChild(caption); // append image to link
                                            var artistAttribution = document.createElement("a"); // create the link
                                            var text = document.createTextNode('Photos by ');
                                            artistAttribution.setAttribute("href", artistLink + "?utm_source=your_app_name&utm_medium=referral");
                                            artistAttribution.innerHTML = artistName;
                                            caption.appendChild(text); // append link to div
                                            caption.appendChild(artistAttribution); // append link to div
                                            var textOn = document.createTextNode(' on ');
                                            caption.appendChild(textOn); // append link to div
                                            var unsplashAttribution = document.createElement("a"); // create the link
                                            unsplashAttribution.setAttribute("href", "https://unsplash.com/?utm_source=your_app_name&utm_medium=referral");
                                            unsplashAttribution.innerHTML = "Unsplash"
                                            caption.appendChild(unsplashAttribution); // append link to div
                                            $('#startAjax').show();
                                        } else { //sometimes the result will be ok but no pictures will be returned
                                            //no-image placeholder
                                            var img = document.createElement("IMG");
                                            img.setAttribute("class", "animated fadeIn");
                                            img.src = "http://api.elwebman.io/images/no-image.png";
                                            $('#result').addClass('animated fadeIn');
                                            $('#result').html(img); // dump the random word on the page
                                        } //end else
                                    })
                                    .fail(function() {
                                        // This function will executes if response is failure
                                        // jqXHR is the object describing error's detailed information
                                        // textStatus can be null, "timeout", "error", "abort", and "parsererror"
                                        // When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
                                        // Handle error scenario of ajax request here
                                        var img = document.createElement("IMG");
                                        img.setAttribute("class", "animated fadeIn");
                                        img.src = "http://api.elwebman.io/images/no-image.png";
                                        $('#result').addClass('animated fadeIn');
                                        $('#result').html(img); // dump the random word on the page
                                    }); // call for unsplash ends
                            }, 1000); //timeout for unsplash end

                        })
                        .fail(function() {
                            // This function will executes if response is failure
                            // jqXHR is the object describing error's detailed information
                            // textStatus can be null, "timeout", "error", "abort", and "parsererror"
                            // When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
                            // Handle error scenario of ajax request here
                        }); //end of call for word definition
                }, 6000); //timeout stop
            })
            .fail(function() {
                // This function will executes if response is failure
                // jqXHR is the object describing error's detailed information
                // textStatus can be null, "timeout", "error", "abort", and "parsererror"
                // When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
                // Handle error scenario of ajax request here
            });
    }; //end of ajax calls

}); // end of document ready