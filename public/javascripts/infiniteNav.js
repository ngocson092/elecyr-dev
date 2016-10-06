$(document).ready(function() {
		
	var currentClass;
	
	//Debounce the window resize event for performance
	function debouncer( func , timeout ) {
	   var timeoutID , timeout = timeout || 200;
	   return function () {
		  var scope = this , args = arguments;
		  clearTimeout( timeoutID );
		  timeoutID = setTimeout( function () {
			  func.apply( scope , Array.prototype.slice.call( args ) );
		  } , timeout );
	   }
	}

	//Listen for the window resize event to determine which style class to add
	$( window ).resize( debouncer( function ( e ) {
		var myClass = currentClass;
		
			var lastObj = $('#carousel_div .catWrap:last')
			var left = lastObj.offset().left;
			var width = lastObj.outerWidth(true);	
			var menuLength = left + (2 * width);
			var windowwidth = $(window).width();
			
			if(menuLength<windowwidth){
				$('#carousel_div').removeClass('carousel_div');
				$('#carousel_div').addClass('carousel_static');
				$('#left_scroll').hide();
				$('#right_scroll').hide();
			}
			if(menuLength>=windowwidth){
				$('#carousel_div').removeClass('carousel_static');
				$('#carousel_div').addClass('carousel_div');
				$('#left_scroll').show();
				$('#right_scroll').show();
			}
	} ) );
		



	//move he last list item before the first item. The purpose of this is if the user clicks to slide left he will be able to see the last item.
	$('#carousel_div .anchorTitle:first').before($('#carousel_div .anchorTitle:last')); 
	
	
	//when user clicks the image for sliding right        
	$('#right_scroll i').click(function(){
	
		//get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '
		var item_width = $('#carousel_div .catWrap').outerWidth() + 10;
		
		//calculae the new left indent of the unordered list
		var left_indent = parseInt($('#carousel_div').css('left')) - item_width;
		
		//make the sliding effect using jquery's animate function '
		$('#carousel_div:not(:animated)').animate({'left' : left_indent},400, function(){    
			
			//get the first list item and put it after the last list item (that's how the infinite effects is made) '
			$('#carousel_div .anchorTitle:last').after($('#carousel_div .anchorTitle:first')); 
			
			//and get the left indent to the default -210px
			$('#carousel_div').css({'left' : '-210px'});
		}); 
	});
	
	//when user clicks the image for sliding left
	$('#left_scroll i').click(function(){
		
		var item_width = $('#carousel_div .catWrap').outerWidth() + 10;
		
		/* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */
		var left_indent = parseInt($('#carousel_div').css('left')) + item_width;
		
		$('#carousel_div:not(:animated)').animate({'left' : left_indent},500,function(){    
		
		/* when sliding to left we are moving the last item before the first list item */            
		$('#carousel_div .anchorTitle:first').before($('#carousel_div .anchorTitle:last')); 
		
		/* and again, when we make that change we are setting the left indent of our unordered list to the default -210px */
		$('#carousel_div').css({'left' : '-210px'});
		});
		
		
	});
});