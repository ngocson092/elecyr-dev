// JavaScript Document

	/*----------------------------------------------------*/
	/*	Preloader
	/*----------------------------------------------------*/

    $(window).load(function() {
	
		"use strict";	
	
       $('#status').delay(100).fadeOut('slow');
       $('#preloader').delay(500).fadeOut('slow');
       $('body').delay(500).css({'overflow':'visible'});
	   
	});


	$(window).load(function(){
	
		"use strict";	
	
		$(window).stellar({});

	});

	/*----------------------------------------------------*/
	/*	Scroll Navbar
	/*----------------------------------------------------*/
	$(window).scroll(function(){	

		"use strict";	
	
		var b = $(window).scrollTop();
		
		if( b > 60 ){		
			$(".navbar").addClass("scroll-fixed-navbar");				
		} else {
			$(".navbar").removeClass("scroll-fixed-navbar");
		}
		
	});	
	
	
	/*----------------------------------------------------*/
	/*	Mobile Menu Toggle
	/*----------------------------------------------------*/
	$(document).ready(function() {
		
		"use strict";	

		$('.navbar-nav li a').click(function() {				
			$('#navigation-menu').css("height", "1px").removeClass("in").addClass("collapse");
			$('#navigation-menu').removeClass("open");				
		});			
	});

	
	
	/*----------------------------------------------------*/
	/*	Animated Scroll To Anchor
	/*----------------------------------------------------*/
	/**
	 * Animated Scroll To Anchor v0.3
	 * Author: David Vogeleer
	 * http://www.individual11.com/
	 *
	 * THANKS:
	 *
	 * -> solution for setting the hash without jumping the page -> Lea Verou : http://leaverou.me/2011/05/change-url-hash-without-page-jump/
	 * -> Add stop  - Joe Mafia
	 * -> add some easing - Daniel Garcia
	 * -> added use strict, cleaned up some white space adn added conditional for anchors without hashtag -> Bret Morris, https://github.com/bretmorris
	 *
	 * TODO:
	 * -> Add hashchange support, but make it optional http://leaverou.me/2011/05/get-your-hash-the-bulletproof-way/
	 *
	 * Licensed under the MIT license.
	 * http://www.opensource.org/licenses/mit-license.php
	 * 
	 */
	 
	$(document).ready(function(){
		"use strict";
		
		$.fn.scrollTo = function( options ) {
		  var other_pages = ['cellsbatteries', 'distributedpower', 'solar-calculator'];
		  
            for (var i=0; i<other_pages.length; i++) {
                var path_index = location.pathname.indexOf(other_pages[i]);
              if (path_index > -1) {
                return;
              }
            }
		  
			var settings = {
				offset : -60,       //an integer allowing you to offset the position by a certain number of pixels. Can be negative or positive
				speed : 'slow',   //speed at which the scroll animates
				override : null,  //if you want to override the default way this plugin works, pass in the ID of the element you want to scroll through here
				easing : null //easing equation for the animation. Supports easing plugin as well (http://gsgd.co.uk/sandbox/jquery/easing/)
			};

			if (options) {
				if(options.override){
					//if they choose to override, make sure the hash is there
					options.override = (override('#') != -1)? options.override:'#' + options.override;
				}
				$.extend( settings, options );
			}

			return this.each(function(i, el){
				$(el).click(function(e){
					var idToLookAt;
					if ($(el).attr('href').match(/#/) !== null) {
						e.preventDefault();
						idToLookAt = (settings.override)? settings.override:$(el).attr('href');//see if the user is forcing an ID they want to use
						
						if (idToLookAt.charAt(0)=='/')
						  idToLookAt = idToLookAt.substring(1);
						  
						//if the browser supports it, we push the hash into the pushState for better linking later
						if(history.pushState){
							history.pushState(null, null, idToLookAt);
							$('html,body').stop().animate({scrollTop: $(idToLookAt).offset().top + settings.offset}, settings.speed, settings.easing);
						}else{
							//if the browser doesn't support pushState, we set the hash after the animation, which may cause issues if you use offset
							$('html,body').stop().animate({scrollTop: $(idToLookAt).offset().top + settings.offset}, settings.speed, settings.easing,function(e){
								//set the hash of the window for better linking
								window.location.hash = idToLookAt;
							});
						}
					}
				});
			});
		};
		
		  
		$('#GoToMainContent, #GoToHome, #GoToMicrogrids, #GotoStorage, #GoToApplications, #GoToTechnology, #GoToContact' ).scrollTo({ speed: 1400 });

	});
	
	
	/*----------------------------------------------------*/
	/*	Current Menu Item
	/*----------------------------------------------------*/
	
	$(document).ready(function() {
		
		//Bootstraping variable
		headerWrapper		= parseInt($('#navigation-menu').height());
		offsetTolerance	= 100;
		
		//Detecting user's scroll
		$(window).scroll(function() {
		
			//Check scroll position
			scrollPosition	= parseInt($(this).scrollTop());
			
			//Move through each menu and check its position with scroll position then add selected-nav class
			$('.navbar-nav > li > a').each(function() {

				thisHref			= $(this).attr('href');
				thisTruePosition	= parseInt($(thisHref).offset().top);
				thisPosition 		= thisTruePosition - headerWrapper - offsetTolerance;
				
				if(scrollPosition >= thisPosition) {
					
					$('.selected-nav').removeClass('selected-nav');
					$('.navbar-nav > li > a[href='+ thisHref +']').addClass('selected-nav');
					
				}
			});
			
			
			//If we're at the bottom of the page, move pointer to the last section
			bottomPage	= parseInt($(document).height()) - parseInt($(window).height());
			
			if(scrollPosition == bottomPage || scrollPosition >= bottomPage) {
			
				$('.selected-nav').removeClass('selected-nav');
				$('navbar-nav > li > a:last').addClass('selected-nav');
			}
		});
		
	});


	/*----------------------------------------------------*/
	/*	Intro Page Slider
	/*----------------------------------------------------*/
	$(document).ready(function(){
	
		"use strict";

		$("#slides").superslides({
			play: 3000,
			animation: "fade",
			pagination: false
		});
		
	});
	
	
	/*----------------------------------------------------*/
	/*	Parallax
	/*----------------------------------------------------*/
	$(window).bind('load', function() {
	
		"use strict";	
		parallaxInit();
		
	});

	function parallaxInit() {
		$('#newsletter').parallax("30%", 0.3);
		$('#features').parallax("30%", 0.3);
		$('#testimonials-rotator').parallax("30%", 0.3);	
	}
	
	
	/*----------------------------------------------------*/
	/*	Lightbox
	/*----------------------------------------------------*/
	$(document).ready(function() {
	
		"use strict";
	
	  $('.image_zoom').magnificPopup({type:'image'});
	  
	});
	
	
	/*----------------------------------------------------*/
	/*	Flexslider
	/*----------------------------------------------------*/
	
	$(document).ready(function(){
	
		"use strict";

		$('.flexslider').flexslider({
			animation: "fade",
			controlNav: true,
			directionNav: false,  
			slideshowSpeed: 4000,   
			animationSpeed: 800,  
			start: function(slider){
				$('body').removeClass('loading');
			}
		});

	});
	
	
	/*----------------------------------------------------*/
	/*	Newsletter Form Validation
	/*----------------------------------------------------*/
	
	$(document).ready(function(){
	
		"use strict";

		$("#subscribe-form").validate({
			rules:{ 
				email:{
						required: true,
						email: true,
						}
					},
					messages:{
							email:{
								required: "We need your email address to contact you",
								email: "Your email address must be in the format of name@domain.com"
							}, 
						}
		});			
		
	});	
	
	
	/*----------------------------------------------------*/
	/*	Contact Form Validation
	/*----------------------------------------------------*/
	
	$(document).ready(function(){
	
		"use strict";

		$("#contact-form").validate({
			rules:{ 
				email:{
						required: true,
						email: true,
					},
					subject:{
						required: true,
						minlength: 4,
						maxlength: 24,
					},		
					message:{
						required: true,
						minlength: 2,
						}
					},
					messages:{
							email:{
								required: "We need your email address to contact you",
								email: "Your email address must be in the format of name@domain.com"
							}, 
							message:{
								required: "Please enter no more than (2) characters"
							}, 
						}
		});			
		
	});
	
	
$(document).ready(function contact_submit() {
  $('#contact-form input#submit').click(function() {
    $.post('contact', $('#contact-form').serialize(), function thank_you(e) {
      alert("Thank you for contacting us. We will get in touch with you soon.");
    });
    $("#contact-form").trigger('reset');
  });
});