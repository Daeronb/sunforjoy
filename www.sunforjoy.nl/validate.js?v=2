function validInput (fieldname,message) {
	// This function checks if anything has been entered in the field
	// Usage:
	// if not validInput (myForm.lastname,term("Achternaam moet gevuld zijn","msgAchternaamverplicht")) {exit function}
	if (fieldname.value == "") {
		alert(message);
		fieldname.focus();
		return false ;
	}
	return true ;
} 



function validNumeric(fieldname,message) {
	// This function checks the entered text in the field is numeric
	// Usage:
	// if not validNumeric (myForm.lastname,term("Veld is niet numeriek","msgNietNumeriek")) {exit function}
	//if (!/\D/.test(fieldname.value) == false) {
	if (/^[-+]?\d+$/.test(fieldname.value) == false) {
		alert(message);
		fieldname.focus();
		return false ;
	}
	return true ;
}
function validDecimal(fieldname,message) {
	// This function checks the entered text in the field is numeric
	// Usage:
	// if not validNumeric (myForm.lastname,term("Veld is niet numeriek","msgNietNumeriek")) {exit function}
	var numericExpression = /^[0-9.\-+]+$/;
	if(!fieldname.value.match(numericExpression)){
		alert(message);
		fieldname.focus();
		return false ;
	}
	return true ;
}




function validEmail(fieldname,message) {
var emailfilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!emailfilter.test(fieldname.value)) {
		alert(message);
		fieldname.focus();
		return false ;
	}
	return true ;
}

/**
 * DHTML date validation script for dd/mm/yyyy. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
// example 	if (!isDate(myForm.next_launch.value)) {alert('<%=term("Datumformaat moet dd-mm-yyyy zijn","msgDatumFormaatFout")%>'); myForm.next_launch.focus(); return};

var dtCh= "-";
var minYear=1900;
var maxYear=2100;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}
 
function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12);
	
	var pos1=dtStr.indexOf(dtCh);
	var pos2=dtStr.indexOf(dtCh,pos1+1);
	if (pos1!=2 || pos2!=5){
		//alert("The date format should be : dd/mm/yyyy")
		return false
	}


	var strDay=dtStr.substring(0,pos1);
	var strMonth=dtStr.substring(pos1+1,pos2);
	var strYear=dtStr.substring(pos2+1);
	strYr=strYear;
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		//alert("The date format should be : dd/mm/yyyy")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		//alert("Please enter a valid month")
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		//alert("Please enter a valid day")
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		//alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		//alert("Please enter a valid date")
		return false
	}
return true
}



function setClassProperty (className, property, value) {
  if (document.all) {
    var lastStyleSheet = 
      document.styleSheets[document.styleSheets.length - 1];
    var selector = '.' + className;
    var css = property + ': ' + value + ';';
    lastStyleSheet.addRule(selector, css);
  }
  else if (document.getElementById) {
    var lastStyleSheet = 
      document.styleSheets[document.styleSheets.length - 1];
    var ruleText = '.' + className + ' { ' + property + ': ' + value 
+ '}';
    lastStyleSheet.insertRule(ruleText, lastStyleSheet.cssRules.length);
  }
}


function getWindowWidth() {
		var windowWidth = 0;
		if (typeof(window.innerWidth) == 'number') {
			windowWidth = window.innerWidth;
		}
		else {
			if (document.documentElement && document.documentElement.clientWidth) {
				windowWidth = document.documentElement.clientWidth;
			}
			else {
				if (document.body && document.body.clientWidth) {
					windowWidth = document.body.clientWidth;
				}
			}
		}
		return windowWidth;
	}


function changecss(myclass,element,value) {
	var CSSRules
	if (document.all) {
		CSSRules = 'rules'
	}
	else if (document.getElementById) {
		CSSRules = 'cssRules'
	}
	for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
		if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
			document.styleSheets[0][CSSRules][i].style[element] = value
		}
	}	
}

function reversedate(datefrom) {
// van dd-mm-yyyy naar yyyy-mm-dd
if (datefrom > '') {return (datefrom.substr(6,4)  + '-' + datefrom.substr(3,2) + '-' + datefrom.substr(0,2) )} else {return ''};
}


function getrss(rssurl,rssnumber,rssblock,mwi) {
var ajaxIndex = ajax_objects.length;
ajax_objects[ajaxIndex] = new sack();
ajax_objects[ajaxIndex].method = 'POST';

ajax_objects[ajaxIndex].setVar('rssurl',rssurl);
ajax_objects[ajaxIndex].setVar('rssnumber',rssnumber);
ajax_objects[ajaxIndex].setVar('rssblock',rssblock);
ajax_objects[ajaxIndex].setVar('mwi',mwi);

ajax_objects[ajaxIndex].requestFile = '/showrss.cgi';	
ajax_objects[ajaxIndex].onCompletion = function(){ getrss_ret(ajaxIndex,rssblock) };

ajax_objects[ajaxIndex].runAJAX();		// Execute AJAX function		
};
function getrss_ret (ajaxIndex,rssblock) {
document.getElementById('rss'+rssblock).innerHTML = ajax_objects[ajaxIndex].response;
try {setupBlocks()} catch(err) {};
try {$('#tblok').mCustomScrollbar('update')} catch(err) {};
setTimeout( function () {try {$('#tblok').mCustomScrollbar('update')} catch(err) {} } ,1000);
};


function srchblok (str) {
str=str.replace(/\'/gi, "%27");
str=str.replace(/ /gi, "+");
window.top.location.href='/s/' + str;
}

function getCookie(name) {
	var search = name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1) end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
			}
		else {
			return "";
			}
	}
	else {
		return "";
	}	
}


function resizeIframe(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight+100;
	}
function resizeIframe2(iframe,hg) {
    iframe.height = hg+100;
	}
