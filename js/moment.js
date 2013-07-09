reflect = { };
reflect.moment = { };

reflect.moment.util = {
	resetPhotos : function() {
		$(".photo-background .button").hide();
		$(".photo-background").unbind();
	},

	extractInteger : function(str)
	{
		return parseInt(str.replace("px", "").trim());
	}
}

reflect.moment.phototransition = {
	
	nextPhoto : function() {
		var pixelsToMove = photoTransition.calculateDistanceToMove(photoTransition.imageWidth, (photoTransition.currentPhotoIndex + 1));
		$("#photos").css("-webkit-transform", "translate3d(-"+pixelsToMove+"px,0px,0px)");

		var $nextPhoto = photoTransition.currentPhoto.next();

		photoTransition.currentPhotoIndex++;
		photoTransition.setCurrentPhoto($nextPhoto, photoTransition.currentPhoto);
	},

	prevPhoto : function() {
		var pixelsToMove = photoTransition.calculateDistanceToMove(photoTransition.imageWidth, (photoTransition.currentPhotoIndex - 1));
		$("#photos").css("-webkit-transform", "translate3d(-"+pixelsToMove+"px,0px,0px)");

		var $prevPhoto = photoTransition.currentPhoto.prev();

		photoTransition.currentPhotoIndex--;
		photoTransition.setCurrentPhoto($prevPhoto, photoTransition.currentPhoto);
	},

	calculateDistanceToMove : function(imageWidth, index)
	{
		return imageWidth * index + 800;
	},

	setCurrentPhoto : function($photo, $oldCurrentPhoto)
	{
		photoTransition.currentPhoto = $photo;

		$photo.removeClass("nextPhoto").removeClass("prevPhoto");
		$photo.next().addClass("nextPhoto");

		if (photoTransition.hasPrevPhoto()) {
			$photo.prev().addClass("prevPhoto");
		}

		if ($oldCurrentPhoto)
		{
			tagging.enterNontaggingState($oldCurrentPhoto);
		}

		util.resetPhotos();
		tagging.enterNontaggingState($photo);


		photoTransition.createBindings();
	},

	createBindings : function() {
		$(".nextPhoto").click(photoTransition.nextPhoto);
		$(".prevPhoto").click(photoTransition.prevPhoto);
	},

	hasPrevPhoto : function()
	{
		return photoTransition.currentPhotoIndex > 0; 
	}

}

reflect.moment.phototransition.imageWidth = 950;
reflect.moment.phototransition.currentPhotoIndex = 0;
reflect.moment.phototransition.currentPhoto = undefined;

reflect.moment.tagging = {

	enterTaggingState : function($photo)
	{
		$photo.unbind();
		$photo.addClass("taggable");

		var $tagButton = $photo.find(".button");
		
		$tagButton.addClass("open")
				  .text("I'm finished tagging")
				  .unbind()
				  .click(function() { tagging.enterNontaggingState($photo) });

		$photo.click(function(event) { 
			tagging.createActiveTag(event, $photo); 
		});
	},

	enterNontaggingState : function($photo)
	{
		$photo.unbind();
		$photo.mouseenter(function() {
			$photo.find(".button").show();
		});

		$photo.mouseleave(function() {
			$photo.find(".button").hide();
		});

		$photo.removeClass("taggable");

		var $tagButton = $photo.find(".button");
		$tagButton.text("Tag this photo!")
				  .unbind()
				  .click(function(ev) { 
				  	tagging.enterTaggingState($photo); 
				  	ev.stopPropagation(); 
				  })
				  .removeClass("open");

		tagging.removeActiveTag();
	},

	createActiveTag : function(event, $photo)
	{
		var $tag = $("#active-tag").show();
		var yCoord = event.pageY;
		var xCoord = (photoTransition.currentPhotoIndex + 1) * photoTransition.imageWidth + event.pageX;

		if ($tag.length == 0)
		{
			var $tag = $("<div/>").attr("id", "active-tag")
								  .css("top", yCoord - 225)
								  .css("left", xCoord - 225)
						   		  .css("position", "absolute");

			var $tagEntry = $("#tag-entry").show();


			var $image = $("<div/>").addClass("active-tag");
			$tag.append($image);
			$tag.append($tagEntry);
		}
		else
		{
			$tag.css("top", yCoord - 225);
			$tag.css("left", xCoord - 225);
		}

		$photo.append($tag);
	},

	removeActiveTag : function()
	{
		$("#active-tag").hide();
	}, 

	addTag : function($photo, id, xCoord, yCoord)
	{
		var $tagWrapper = $("<div/>").css("top", yCoord)
							  		 .css("left", xCoord)
							  		 .attr("id", id)
							  		 .addClass("tag-wrapper");

		var $tag = $("<div/>").addClass("tag");
		var $tagContent = $("<div/>").text(id)
									 .addClass("tag-content");

		$tagWrapper.append($tag);
		$tagWrapper.append($tagContent);
		$photo.append($tagWrapper);

		$tagWrapper.click(function() {
			reflect.lightbox.createLightbox(photoTransition.currentPhoto, $(this));
		});
	},

	submitActiveTag : function($activeTag)
	{
		var id = $activeTag.find(".tag-input").val();
		var xCoord = $activeTag.css("left");
		console.log($activeTag);
		var yCoord = $activeTag.css("top");
		var $photo = photoTransition.currentPhoto;
		tagging.addTag($photo, id, xCoord, yCoord);
		tagging.enterNontaggingState($photo);
	}

}

reflect.lightbox = { 

	createLightbox : function($photo, $tag) {
		$lightboxShade = $("<div/>").attr("id", "lightbox-shade")
		$("body").append($lightboxShade);

		lightbox.createNewPhoto($photo);
	},

	createNewPhoto : function($photo)
	{
		var $photoCopy = $photo.clone().attr("id", "lightbox-photo");
		$("body").append($photoCopy);

		// modify tag so it's positioned correctly
		var $tag = $photoCopy.find(".tag-wrapper");

		var xCoord = util.extractInteger($tag.css("left"));
		xCoord = xCoord - (photoTransition.currentPhotoIndex + 1) * photoTransition.imageWidth;

		$tag.css("left", xCoord);
		$tag.addClass("lightbox-tag-wrapper");

		// remove tag button
		$photoCopy.find(".button").remove();
	},


};


var photoTransition = reflect.moment.phototransition;
var tagging = reflect.moment.tagging;
var util = reflect.moment.util;
var lightbox = reflect.lightbox;


$(document).ready(function() {
	util.resetPhotos();
	reflect.moment.phototransition.setCurrentPhoto($(".photo-background:first"));

	$("#tag-entry").hide();
	$("#tag-entry .tag-input").click(function(ev){
		ev.stopPropagation();
	})
	$("#tag-entry .tag-input").typeahead({
		source: ["John Smith", "Sarah Stevens", "Jerry Frick"]
	});

	$("#tag-entry").submit(function(ev) {
		tagging.submitActiveTag($("#active-tag"));
		ev.preventDefault();
	});

	tagging.addTag(photoTransition.currentPhoto, "test", 1073, 174);


});