///* slideMenu
// 
// The first parameter is the id of the unordered list you would like to bind the accordion to. The second is the width you would like the accordion selection to expand to. The third is the timeout variable to control how quickly the sliding function is called. The fourth is the speed of the accordion with 1 being the fastest. The last is optional and is the integer that corresponds to the section you would like to be expanded when the accordion is loaded.
//  */
//
//var slideMenu=function(){
//
//	var sp,st,t,m,sa,l,w,sw,ot;
//	return{
//		build:function(sm,sw,mt,s,sl,h){
//                    alert(2);
//			sp=s; st=sw; t=mt;
//			m=document.getElementById(sm);
//			sa=m.getElementsByTagName('li');
//			l=sa.length; w=m.offsetWidth; sw=w/l; 
//			ot=Math.floor((w-st)/(l-1)); var i=0;
//			for(i;i<l;i++){s=sa[i]; s.style.width=sw+'px'; this.timer(s)}
//			if(sl!=null){m.timer=setInterval(function(){slideMenu.slide(sa[sl-1])},t)
//                        
//                    }
//		},
//		timer:function(s){
//                    
//                    alert(s);
//                    s.onmouseover=function(){
////                        alert(1);
//                        clearInterval(m.timer);m.timer=setInterval(function(){slideMenu.slide(s)},t)}},
//		slide:function(s){
//			var cw=parseInt(s.style.width,'10');
//			if(cw<st){
//				var owt=0; var i=0;
//				for(i;i<l;i++){
//					if(sa[i]!=s){
//                                             
//						var o,ow; var oi=0; o=sa[i]; ow=parseInt(o.style.width,'10');
//						if(ow>ot){oi=Math.floor((ow-ot)/sp); oi=(oi>0)?oi:1; o.style.width=(ow-oi)+'px'}
//						owt=owt+(ow-oi)}}
//				s.style.width=(w-owt)+'px';
//			}else{clearInterval(m.timer)}
//		}
//	};
//}();


$(document).ready(function() {
  $('ul.sm li').mouseenter(function() {
//      alert(1);
    //$(this).parents('li').children('#idea-grid').css('width','114px')
//    $(this).parents('li').children('#idea-grid').addClass("idea-grid-img-small");
//    $(this).parents('#idea-grid').removeClass("idea-grid-img-small");
//    $(this).parents('#idea-grid').addClass("idea-grid-img-large");
    //$(this).parents('#idea-grid').css('width','304px')
     $('ul.sm li').removeClass("idea-grid-img-large");
    $('ul.sm li').removeClass("idea-grid-img-small");
    
    
    $('ul.sm li').addClass("idea-grid-img-small");
    $(this).removeClass("idea-grid-img-small");
    $(this).addClass("idea-grid-img-large");
  }).mouseleave(function() {
//    //$(this).parents('li').children('#idea-grid').css('width','152px')
//    $(this).parents('li').children('#idea-grid').removeClass("idea-grid-img-small");
//    $(this).parents('li').children('#idea-grid').removeClass("idea-grid-img-large");

//    $('ul.sm li').removeClass("idea-grid-img-large");
//    $('ul.sm li').removeClass("idea-grid-img-small");
  });  
  
  
});