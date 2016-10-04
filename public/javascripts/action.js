/* Form Validation Function */
function formValidation(oEvent) {
	oEvent = oEvent || window.event;
	var txtField = oEvent.target || oEvent.srcElement; 
	var tick=true;	
	var form = txtField.closest('form')
	
	if($('#' + form.id + ' .fName').val().length < 2){tick=false;}
	if($('#' + form.id + ' .lName').val().length < 2){tick=false;}
	var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var tick = function(){
		var email = $('#' + form.id + ' .uEmail').val();
		return re.test(email);
	}()
	
	if(tick){$('#' + form.id + ' .subForm').prop('disabled', false); }
	else{$('#' + form.id + ' .subForm').prop('disabled', 'disabled'); }
}

$(window).load(function() {

/* Language Listener 
$('#langSelect').change(testFunc);
	
/*Form Validation Listener */

validationListener();

function validationListener(){

	var tick=false;
	
	$('form .subForm').prop('disabled', 'disabled');

	$('form .fName').on('keyup', formValidation);
	$('form .lName').on('keyup', formValidation);
	$('form .uEmail').on('keyup', formValidation);
	
}

	/* Variables
	*/

	//Top navbar and it's height
	var elem = $('div .navbar-fixed-top');

	var headerHeight = elem.height();

	/* pathname= '/contact'
	*/
	if($(location).attr('pathname') == "/contact") {
		var contactOffset = $('#contact').offset().top;
		var contactHeight = contactOffset

		$('html, body').animate({
			scrollTop : contactHeight
		}, 1000)
	}
		
	/* pathname= '/'
	*/

	/*Listener on Index page, down arrow */
	if($(location).attr('pathname') == "/") {
	
		var sectionOffset = $('#introBody').offset().top;
		var sectionHeight = (sectionOffset - headerHeight);
		
		$('.navDown').on('click', function() {
			$('html body').animate({
				scrollTop : sectionHeight
			}, 1000)
		});
	}


	// Scroll Listener to toggle navbar style
	$(window).on('scroll', function() {
		var scrollPos = window.pageYOffset;

		if(scrollPos > 150) {
			elem.addClass("scroll-fixed-navbar");
		}
		else{
			elem.removeClass("scroll-fixed-navbar");
		}
	});




	$('.subForm').click(function(event){

		// stop the form from submitting the normal way and refreshing the page
        event.preventDefault();

		var myForm = $(this).closest("form");
		var formID = myForm.attr('id');  //form ID
		var formInputs = 'formName=' + formID; //Start of data input string
	
		//iterate through all the form inputs with class .form-control to compile to request object
		$('#' + formID + ' ' + '.form-control').each(function(){

			var fieldID = $(this).attr('id');
			var fieldVal = $(this).val();
			
			formInputs += '&' + fieldID + '=' + fieldVal;
		
		})
		
		if($(this).attr("data-myModal")){
		//	document.getElementById(formID + "Anchor").click();
			$(this).closest(".modal")
				.modal("hide");
		};
		
		//If the download property is present and defined
		if($(this).attr("data-fileMethod")){

			//close the modal(only modal buttons have data-fileMethod at this point

			var fileString = '';
			var fileArray = new Array();
			var fileMethod = $(this).attr("data-fileMethod");
			
			//get all checked checkbox values
			$('#' + formID + ' input:checkbox:checked').each(function(){
				
				var dl = $(this).attr('data-dl');
				fileString += dl + ','
				fileArray.push(dl);
			
			})
			
			formInputs += '&' + fileMethod + '=' + fileString;
			if(fileMethod=='download'){
				downloadFiles(fileArray);
			}
			
			postAJAX(formInputs);
			
		}
		else{ //if there are no files to download go straight to the ajax submission
		
			postAJAX(formInputs);
		}
		
		

	});

})
function downloadFiles(fileArray){

	for(i=0;i<fileArray.length;i++){
		dlID = fileArray[i];

		document.getElementById(''+dlID+'').click();
	}
}

function postAJAX(formdata){

		var xmlhttp = new XMLHttpRequest();

	
//		console.log("this is the formData" + JSON.stringify(formdata, null, 4));	
		xmlhttp.open("POST", "/formhandling/mongoSubmit", true);
	
		xmlhttp.onreadystatechange=function() {
	
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		
					width = $(window).width();
					if(width>767){
						$('#thankYou')
							.animate({top:"6em"}, 700, "swing")
							.delay(2000)
							.animate({top:"-8em"}, 300, "swing")
					}
					if(width<768){
						$('#thankYou')
							.animate({top:"4.6em"}, 700, "swing")
							.delay(2000)
							.animate({top:"-8em"}, 300, "swing")
					}
					else{
						//throw error
					}

			}
		
		}
		
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send(formdata);
		
		return false;
}

/* 
	Slide in the callbox overlay
*/

$('#callboxLink').on('click', function(){

	$('#callbox')
		.animate({right:"0"}, 700, "swing")		
	return false;
});
$(document).on('click', function( e ) {

	$('#callbox')
		.animate({right:"-215px"}, 700, "swing");

});