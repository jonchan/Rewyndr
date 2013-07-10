reflect = { };
reflect.moment = { };

reflect.moment.util = {
	resetPhotos : function() {
		$(".photo-background .button").hide();
		$(".photo-background").unbind();
	},

	extractInteger : function(str)
	{
		console.log(str);
		return parseInt(str.replace("px", "").trim());
	},

	extractCssIntegerValue : function($element, param)
	{
		return util.extractInteger($element.css(param));
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
		var id = $activeTag.find(".tag-input").val().replace(/ /g, "");
		console.log(id);
		var xCoord = $activeTag.css("left");
		var yCoord = $activeTag.css("top");
		var $photo = photoTransition.currentPhoto;
		tagging.addTag($photo, id, xCoord, yCoord);
		tagging.enterNontaggingState($photo);

		// submit to "database", this should ideally be consolidated with addTag method
		tags.push({
			id : id,
			photoId : $photo.attr("id"),
			xCoord : xCoord,
			yCoord : yCoord,
			feed : { }
		});
	}

}

reflect.lightbox = { 

	createLightbox : function($photo, $tag) {
		$lightboxShade = $("<div/>").attr("id", "lightbox-shade")
		$("body").append($lightboxShade);

		lightbox.photo = lightbox.createNewPhoto($photo, $tag);
		lightbox.createReverseLightbox($tag);
		lightbox.createFeed();
		lightbox.enableAddContent();

		$(".second-lightbox-shade").click(lightbox.destroyLightbox);
		lightbox.createBindingsForInput();
	},

	destroyLightbox : function() {
		lightbox.photo.remove();
		lightbox.feed.remove();
		lightbox.tag.remove();
		$("#lightbox-shade").remove();
		$(".second-lightbox-shade").remove();
	},

	createNewPhoto : function($photo, $tag)
	{
		var $photoCopy = $photo.clone().attr("id", "lightbox-photo");
		$("body").append($photoCopy);

		// modify tag so it's positioned correctly
		var $tag = $photoCopy.find("#" + $tag.attr("id"));
		lightbox.tag = $tag;

		// remove all other tags
		$photoCopy.find(".tag-wrapper").not("#" + $tag.attr("id")).remove();

		var xCoord = util.extractInteger($tag.css("left"));
		xCoord = xCoord - (photoTransition.currentPhotoIndex + 1) * photoTransition.imageWidth;

		$tag.css("left", xCoord);
		$tag.addClass("lightbox-tag-wrapper");


		// remove tag button
		$photoCopy.find(".button").remove();

		return $photoCopy;
	},

	createReverseLightbox : function() {
		var $photo = lightbox.photo;
		var $tag = lightbox.tag;

		$lightboxShadeTop = $("<div/>").addClass("second-lightbox-shade");
		$lightboxShadeLeft = $("<div/>").addClass("second-lightbox-shade");
		$lightboxShadeRight = $("<div/>").addClass("second-lightbox-shade");
		$lightboxShadeBottom = $("<div/>").addClass("second-lightbox-shade");

		var height = util.extractCssIntegerValue($tag, "top") + util.extractCssIntegerValue($photo, "top");
		$lightboxShadeTop.css("top", "0");
		$lightboxShadeTop.css("height", height);

		$lightboxShadeBottom.css("top", height + $tag.height());

		var width = util.extractCssIntegerValue($tag, "left") + util.extractCssIntegerValue($photo, "left");
		$lightboxShadeLeft.css("width", width);
		$lightboxShadeLeft.css("left", "0");
		$lightboxShadeLeft.css("top", height);
		$lightboxShadeLeft.css("height", $tag.height());

		$lightboxShadeRight.css("left", width + util.extractCssIntegerValue($tag, "width"));
		$lightboxShadeRight.css("top", height);
		$lightboxShadeRight.css("height", $tag.height());



		$("body").append($lightboxShadeTop)
  			     .append($lightboxShadeBottom)
  			     .append($lightboxShadeLeft)
  			     .append($lightboxShadeRight);
	},

	createFeed : function() {
		var $photo = lightbox.photo;
		var $feed = $("#feed-template").clone().attr("id", "feed");
		$feed.css("height", $photo.height());

		var extraSpace = ($photo.width() - $photo.find("img").width()) / 2;
		$feed.css("left", $photo.width() + util.extractCssIntegerValue($photo, "left") - extraSpace);
		$feed.css("top", $photo.css("top"));

		$feed.removeClass("hidden");

		// populate feed with data
		var feedContent = lightbox.lookupFeedInfo($photo.find(".lightbox-tag-wrapper").attr("id"));
		$contentElement = $feed.find("#feed-content li:first");

		for (i=0; i<feedContent.length; i++)
		{
			var content = feedContent[i];
			var $element = $contentElement.clone();

			// add icon
			$img = $("<img/>").attr("src", lightbox.getIconLocation(content.type));
			$element.find(".content-type-wrapper").append($img);

			// add content
			$element.find(".content").text(content.content1);

			// add info
			$element.find(".info").text(content.user + " " + content.time);

			$feed.find("ul").append($element);
		}
		$contentElement.remove();
		$("body").append($feed);
		reflect.lightbox.feed = $feed;
	},

	// ideally ajax call to server
	lookupFeedInfo : function(tagId)
	{
		for (i=0; i<tags.length; i++)
		{
			if (tags[i].id == tagId)
			{
				return tags[i].feed;
			}
		}
	},

	getIconLocation : function(type)
	{
		if (type == "comment")
		{
			return "img/comment-icon.png"
		}
		else if (type == "song")
		{
			return "img/sound-icon.png"
		}
		else if (type == "thought")
		{
			return "img/thought-icon.png"
		}
	},

	enableAddContent : function()
	{
		$addContentButton = lightbox.feed.find(".add-content-button");
		$addContentButton.click(function() {
			// toggle + icon
			var $addContent = $(this).find("img")
			if ($addContent.attr("src") === "img/add-icon-on.png")
			{
				$(this).find("img").attr("src", "img/add-icon.png");
			}
			else 
			{
				$(this).find("img").attr("src", "img/add-icon-on.png");
			}

			lightbox.feed.find(".add-comment").toggleClass("add-comment-shown");
			lightbox.feed.find(".add-sound").toggleClass("add-sound-shown");
			lightbox.feed.find(".add-thought").toggleClass("add-thought-shown");
		})
	},

	createBindingsForInput : function() {
		lightbox.feed.find(".add-comment").click(function(){
			$("#feed").find(".feed-header").toggleClass("feed-header-open");
			$("#feed").find(".add-comment-box").toggleClass("hidden");
		});
	}
};

reflect.lightbox.photo = undefined;
reflect.lightbox.tag = undefined;
reflect.lightbox.feed = undefined;


var photoTransition = reflect.moment.phototransition;
var tagging = reflect.moment.tagging;
var util = reflect.moment.util;
var lightbox = reflect.lightbox;

var tags = [
	{
		id : "test",
		xCoord : 1073,
		yCoord : 174,
		photoId : "#santancon1",
		feed : [
			{
				type : "comment",
				content1 : "this is great",
				user : "leslie l",
				time : "3 minutes ago"
			},
			{
				type : "song",
				content1 : "song by taylor swift",
				user : "leslie l",
				time : "3 hours ago"
			},
			{
				type : "thought",
				content1 : "Sam is feeling",
				content2 : "like a diva",
				user : "john r",
				time : "july 7, 2013 10:30 am"
			}
		]
	}
];



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

	for (i = 0; i<tags.length; i++)
	{
		var tag = tags[i];
		tagging.addTag($(tag.photoId), tag.id , tag.xCoord, tag.yCoord);
	}
});