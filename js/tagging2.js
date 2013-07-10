var tagging = {

	enabled : false,

	currentTag : undefined,

	leaveTaggingState : function() {
		if (tagging.enabled)
		{
			tagging.enabled = false;
			$("#tag-photo").text("Tag Photo");
			$("#detailed-photo-wrapper img").css("cursor", "inherit");				
			if (tagging.currentTag)
			{
				tagging.currentTag.remove();
				tagging.currentTag = undefined;
			}			
		}
	},

	hideAllPassiveTags : function() {
		$(".passive-tag").addClass("hidden");
	},

	initialize : function () {
		$("#tag-photo").click(function(ev) {
			if (!tagging.enabled) 
			{
				tagging.enabled = true;
				$("#detailed-photo-wrapper img").css("cursor", "crosshair");				
				$("#tag-photo").text("I'm done tagging!");
			}
			else
			{
				tagging.leaveTaggingState();
			}
		});	

		$("#tag-entry").hide();

		$("#detailed-photo-wrapper img").click(function(ev){
			if (tagging.enabled)
			{
				if (tagging.currentTag)
				{
					tagging.currentTag.css("top", ev.pageY - 50)
								   	  .css("left", ev.pageX - 50);
				}
				else
				{
					var $tag = $("<div/>").attr("id", "activeTag")
								   		  .css("top", ev.pageY - 50)
								   		  .css("left", ev.pageX - 50)
								   		  .css("position", "absolute")
								   		  .css("z-index", "100");

					var $tagEntry = $("#tag-entry").clone().attr('id', 'live-tag-entry').show();


					var $image = $("<img/>").attr("src", "img/tag-outline.png")
								   			.css("width", "100px")
								   			.css("height", "100px")
					$tag.append($image);
					$tag.append($tagEntry);
					tagging.currentTag = $tag;

					$("body").append($tag);


					// SAVE NEW TAG
					$("#live-tag-entry .btn-save").click(function() {
						var $newtag = $("#modal-tag-format").clone().attr("id", "");
						var $formContainer = $("#live-tag-entry");
						var noun = $formContainer.find(".input-noun").val()
						var verb = $formContainer.find(".input-verb option:selected").text()
						var adjective = $formContainer.find(".input-adjective").val()
						$newtag.find(".detailed-header div").text(noun);
//						$newtag.find(".detailed-adjectives li").text(verb + " " + adjective);
						$newtag.find(".content").text(noun + " " + verb + " " + adjective);
						$newtag.show();
						$("#detailed-tags").prepend($newtag);
						tagging.leaveTaggingState();
						initializeAddThoughtForms();
					})

					// CANCEL TAG CREATION
					$(".btn-cancel").click(function() {
						tagging.leaveTaggingState();
					})
				}

			}
		});

//		$(".passive-tag").css("opacity", 0);
		$(".passive-tag").hide();

		$("#detailed-photo-wrapper").mouseenter(function(ev){
//			$(".passive-tag").css("opacity", .5);
			$(".passive-tag").show();
		});

		$("#detailed-photo-wrapper").mouseleave(function(ev){
//			$(".passive-tag").css("opacity", 0);
			$(".passive-tag").hide();

		});

		$(".passive-tag").mouseenter(function(ev) {
			ev.preventDefault();
			$(".passive-tag").hide();
			$(this).show();
			$(this).css("opacity", 1);			
		});

		$(".passive-tag").mouseleave(function(ev) {
			$(this).css("opacity", .5);	
		});

		$(".passive-tag").click(function(ev){
			ev.preventDefault();

			var trgt = $(this).attr("data-anchor");

			//get the top offset of the target anchor
			var target_offset = $("#"+trgt).offset();
			var target_top = target_offset.top - 100;
 
			//goto that anchor by setting the body scroll top to anchor top
			$('#detailed-tags').animate({scrollTop:target_top}, 500, 
				function() {
					$("#" + trgt).css("background-color", "#000");

	 				$( "#" + trgt ).animate({
    	      			backgroundColor: "#ffffff"
				    }, 800, 

			       	 function () {
			       	 	$( "#" + trgt ).animate({
          					backgroundColor: "#000000"
						}, 800 );
			        });
			});
		});

		$("#modal-tag-format").hide();
	}

}