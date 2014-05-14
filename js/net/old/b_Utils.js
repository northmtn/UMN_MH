$(document).ready(function () {



});



/*---------------*/

/* Browser Fixes */

/*---------------*/



//Fix for IE console logs

if (typeof console === "undefined") { console = { log: function () { } }; }



//Fix for indexOf on Array in IE

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function (elt /*, from*/) {

        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;

        from = (from < 0)

         ? Math.ceil(from)

         : Math.floor(from);

        if (from < 0)

            from += len;

        for (; from < len; from++) {

            if (from in this &&

          this[from] === elt)

                return from;

        }

        return -1;

    };

}



/*---------------*/

/* Display Utils */

/*---------------*/



function changeDisplayState(containerId, stateId, filterKey) {



    //Hides children with id's containing filter key, and displays new state.



    $("#" + containerId).children().each(function () {



        var childId = $(this).attr('id');



        if (childId.indexOf(filterKey) != -1) {



            if (childId != stateId) {



                $(this).hide();



            } else {



                $(this).show();



            }



        }



    });



}



//Swaps an img's data-src attribute into src if not already loaded.

function loadWaitingImage(selectorStr) {



    var dataSrc = $(selectorStr).data("src");



    if (dataSrc != "undefined") {

        $(selectorStr).attr('src', dataSrc);

    } else {

        dump(["Missing data-src : " + $(selectorStr).attr('id')]);

    }



}



function getRotationDegrees(obj) {

    var matrix = obj.css("-webkit-transform") ||

    obj.css("-moz-transform") ||

    obj.css("-ms-transform") ||

    obj.css("-o-transform") ||

    obj.css("transform");

    if (matrix !== 'none') {

        var values = matrix.split('(')[1].split(')')[0].split(',');

        var a = values[0];

        var b = values[1];

        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    } else { var angle = 0; }

    return angle;

}



function openDivInNewWindow(divSelector, includeCSSPaths, windowTitle, divWidth, divHeight) {



    $(divSelector).show();



    var divHTML = $(divSelector).html();



    var html = "<!DOCTYPE HTML><html>"

    html += "<head><title>" + windowTitle + "</title>";

    for (var i = 0; i < includeCSSPaths.length; i++) html += "<link href='" + includeCSSPaths[i] + "' type='text/css' rel='stylesheet' />";

    html += "</head><body>";

    html += divHTML;

    html += "</body></html>";



    var myWindow = window.open('', '', 'width=' + divWidth + ',height=' + divHeight);

    myWindow.document.open();

    myWindow.document.write(html);

    myWindow.focus();

    myWindow.print();

    myWindow.document.close();



}

//Returns the browser zoom level for IE7, 8, and 9.

function getZoom() {
	
    var screen;

    screen = document.frames.screen;
    return ((screen.deviceXDPI / screen.systemXDPI) * 100 + 0.9).toFixed();
	
	
}

/*--------------*/

/* String Utils */

/*--------------*/



//Extract filename from full path

function getFileName(fullPath) {

    return fullPath.replace(/^.*[\\\/]/, '');

}



//Makes string associated enums.

function Enum() {

    for (var i = 0; i < arguments.length; ++i) {

        this[arguments[i]] = i;

    }

    return this;

}


/*---------*/

/* App Utils */

/*---------*/

function hasCompletedSlide(num, completed){
	
	var chapterCompleted = getChapterIndex(savedChapter);
	var sectionCompleted = getSectionIndex(savedChapter, savedSection);
	
	if ( getChapterIndex(currentChapterId) < chapterCompleted){
		return true;
	} else if(getSectionIndex(currentChapterId, currentSectionId) < sectionCompleted){
		return true;
	} else if(num < completed){
		return true;
	}
	return false;
}




/*---------*/

/* Cookies */

/*---------*/

function createCookie(name, value, days) {

    if (days) {

        var date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        var expires = "; expires=" + date.toGMTString();

    }

    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";

}



function readCookie(name) {

    var nameEQ = name + "=";

    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {

        var c = ca[i];

        while (c.charAt(0) == ' ') c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);

    }

    return null;

}



function eraseCookie(name) {

    createCookie(name, "", -1);

}


/*-----------*/

/* Math / Geom */

/*-----------*/

function deg2Rad(degrees) {
	return degrees * (Math.PI/180);
}

//Generate random point within a circle
function randomPointInCircle( radius ) {

    var randomAngle = Math.random() * (Math.PI * 2);
    var newX = (Math.random()*radius)*Math.cos(randomAngle);
    var newY = (Math.random()*radius)*Math.sin(randomAngle);
    return [newX,newY];

}

//Generate random point on a ring
function randomPointOnRing( radius ) {

    var randomAngle = Math.random() * (Math.PI * 2);
    return getPointOnRing(randomAngle);

}

//Generate point on a ring
function getPointOnRing( angle, radius ) {

    var newX = radius*Math.cos(angle);
    var newY = radius*Math.sin(angle);
    return [newX,newY];

}





/*-----------*/

/* Debug Tools */

/*-----------*/


//Convenience log for debugging
function out(obj) {
    var outStr = obj.toString();
    if (console) { console.log(outStr); }
}


//Dump for debugging

function dump(obj) {

    var out = '';

    for (var i in obj) {

        out += i + ": " + obj[i] + "\n";

    }



    if (console) { console.log(out); }

}