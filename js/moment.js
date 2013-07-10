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

	addTag : function($photo, id, xCoord, yCoord, tagName)
	{
		var $tagWrapper = $("<div/>").css("top", yCoord)
							  		 .css("left", xCoord)
							  		 .attr("id", id)
							  		 .addClass("tag-wrapper");

		var $tag = $("<div/>").addClass("tag");
		var $tagContent = $("<div/>").text(tagName)
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
		var tagName = $activeTag.find(".tag-input").val();
		var xCoord = $activeTag.css("left");
		var yCoord = $activeTag.css("top");
		var $photo = photoTransition.currentPhoto;
		tagging.addTag($photo, id, xCoord, yCoord, tagName);
		tagging.enterNontaggingState($photo);

		// submit to "database", this should ideally be consolidated with addTag method
		tags.push({
			id : id,
			tagName : tagName,
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
		lightbox.drawLines();

		$(".second-lightbox-shade").click(lightbox.destroyLightbox);
		lightbox.createBindingsForInput();
	},

	destroyLightbox : function() {
		lightbox.photo.remove();
		lightbox.feed.remove();
		lightbox.tag.remove();
		$("#lightbox-shade").remove();
		$(".second-lightbox-shade").remove();
		lightbox.verticalLine1.remove();
		lightbox.horizontalLine1.remove();
		lightbox.horizontalLine2.remove();
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

	drawLines : function() {
		$verticalLine1 = $("<div></div>").addClass("verticalLine");
		$horizontalLine1 = $("<div></div>").addClass("horizontalLine");
		$horizontalLine2 = $("<div></div>").addClass("horizontalLine");

		var startX = util.extractCssIntegerValue(lightbox.tag, "left") + 
						util.extractCssIntegerValue(lightbox.photo, "left") +
						lightbox.tag.width();

		var startY = util.extractCssIntegerValue(lightbox.tag, "top") + util.extractCssIntegerValue(lightbox.photo, "top") + 10;


		var endX = util.extractCssIntegerValue(lightbox.feed, "left");
		var endY = util.extractCssIntegerValue(lightbox.feed, "top") + 20;

		var midX = ((endX - startX) / 2) + startX;

		$horizontalLine1.css("left", startX);
		$horizontalLine1.css("top", startY);
		$horizontalLine1.css("width", (endX - startX) / 2);

		$verticalLine1.css("left", midX);
		$verticalLine1.css("top", endY);
		$verticalLine1.css("height", (startY - endY));

		$horizontalLine2.css("left", midX);
		$horizontalLine2.css("top", endY);
		$horizontalLine2.css("width", (endX - startX) / 2);

		$("body").append($horizontalLine1);
		$("body").append($horizontalLine2);
		$("body").append($verticalLine1);

		lightbox.horizontalLine1 = $horizontalLine1;
		lightbox.horizontalLine2 = $horizontalLine2;
		lightbox.verticalLine1 = $verticalLine1;
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
		reflect.lightbox.feed = $feed;

		$feed.css("height", $photo.height());

		var extraSpace = ($photo.width() - $photo.find("img").width()) / 2;
		$feed.css("left", $photo.width() + util.extractCssIntegerValue($photo, "left") - extraSpace);
		$feed.css("top", $photo.css("top"));

		$feed.removeClass("hidden");

		// populate feed with data
		var feedContent = lightbox.lookupFeedInfo(lightbox.getTagId());

		for (i=0; i<feedContent.feed.length; i++)
		{
			var content = feedContent.feed[i];
			lightbox.addContentItemToFeed(feedContent.tagName, content);
		}
		$("body").append($feed);

		$options = $feed.find(".add-thought-box option");
		for (var i=0; i < $options.length; i++)
		{
			var oldText = $($options[i]).text();
			$($options[i]).text(feedContent.tagName + " " + oldText);
		}
	},

	addContentItemToFeed : function(tagName, content)
	{
		$contentElement = lightbox.feed.find("#feed-content li:last");
		var $element = $contentElement.clone();
		$element.removeClass("hidden");

		// add icon
		var $img = $("<img/>").attr("src", lightbox.getIconLocation(content.type));
		$element.find(".content-type-wrapper").append($img);

		// add content
		if (content.type === "thought")
		{
			$element.find(".content1").addClass("thought-header").text(tagName + " " + content.content1);
		}
		$element.find(".content2").text(content.content2);

		// add info
		$element.find(".info").text(content.user + " " + content.time);

		lightbox.feed.find("ul").prepend($element);
	},

	getTagId : function() {
		return lightbox.photo.find(".lightbox-tag-wrapper").attr("id");
	},

	// ideally ajax call to server
	lookupFeedInfo : function(tagId)
	{
		for (i=0; i<tags.length; i++)
		{
			if (tags[i].id === tagId)
			{
				return tags[i];
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

			if (lightbox.commentOn)
			{
				lightbox.toggleCommentInput();
			}
			else if (lightbox.thoughtOn)
			{
				lightbox.toggleThoughtInput();
			}
			else if (lightbox.soundOn)
			{
				lightbox.toggleSoundInput();
			}
		})
	},

	createBindingsForInput : function() {

		// comments 
		lightbox.feed.find(".add-comment").click(lightbox.toggleCommentInput);

		lightbox.feed.find(".add-comment-box textarea").keyup(function(e) {
			e = e || event;
			if (e.keyCode === 13 && !e.ctrlKey) {
				lightbox.submitContent("comment", undefined, $(this).val());
				// reset comment entry
				$(this).val(""); 
				lightbox.toggleCommentInput();
				e.preventDefault();
			}
		})

		// thoughts
		lightbox.feed.find(".add-thought").click(lightbox.toggleThoughtInput);

		lightbox.feed.find(".add-thought-box textarea").keyup(function(e) {
			e = e || event;
			if (e.keyCode === 13 && !e.ctrlKey) {
				lightbox.submitContent("thought", $(this).prev().val(), $(this).val());

				// reset comment entry
				$(this).val(""); 
				lightbox.toggleThoughtInput();
				e.preventDefault();
			}
		})


		// sounds
		lightbox.feed.find(".add-sound").click(lightbox.toggleSoundInput);

	},

	toggleCommentInput : function() {
		if (lightbox.thoughtOn)
		{
			lightbox.toggleThoughtInput();
		}
		else if(lightbox.soundOn)
		{
			lightbox.toggleSoundInput();
		}

		lightbox.commentOn = !lightbox.commentOn;

		$commentBox = $("#feed").find(".add-comment-box");
		$header = $("#feed").find(".feed-header");

		if (lightbox.commentOn)
		{
			$commentBox.css("-webkit-transition-delay", ".5s");
			$header.css("-webkit-transition-delay", "0s");
			$header.addClass("feed-header-open");
			$commentBox.removeClass("transparent");
		}
		else
		{
			$commentBox.css("-webkit-transition-delay", "0s");
			$header.css("-webkit-transition-delay", ".5s");
			$header.removeClass("feed-header-open");
			$commentBox.addClass("transparent");
		}
	},

	toggleThoughtInput : function() {
		if (lightbox.commentOn)
		{
			lightbox.toggleCommentInput();
		}
		else if(lightbox.soundOn)
		{
			lightbox.toggleSoundInput();
		}

		lightbox.thoughtOn = !lightbox.thoughtOn;

		$thoughtBox = $("#feed").find(".add-thought-box");
		$header = $("#feed").find(".feed-header");

		if (lightbox.thoughtOn)
		{
			$thoughtBox.css("-webkit-transition-delay", ".5s");
			$header.css("-webkit-transition-delay", ".2s");
			$header.addClass("feed-header-open");
			$thoughtBox.removeClass("transparent");
		}
		else
		{
			$thoughtBox.css("-webkit-transition-delay", ".2s");
			$header.css("-webkit-transition-delay", ".5s");
			$header.removeClass("feed-header-open");
			$thoughtBox.addClass("transparent");
		}
	},

	toggleSoundInput : function() {

		if (lightbox.commentOn)
		{
			lightbox.toggleCommentInput();
		}
		else if (lightbox.thoughtOn)
		{
			lightbox.toggleThoughtInput();
		}

		lightbox.soundOn = !lightbox.soundOn;

		$soundBox = $("#feed").find(".add-sound-box");
		$header = $("#feed").find(".feed-header");

		if (lightbox.soundOn)
		{
			$soundBox.css("-webkit-transition-delay", ".5s");
			$header.css("-webkit-transition-delay", ".2s");
			$header.addClass("feed-header-open");
			$soundBox.removeClass("transparent");
		}
		else
		{
			$soundBox.css("-webkit-transition-delay", ".2s");
			$header.css("-webkit-transition-delay", ".5s");
			$header.removeClass("feed-header-open");
			$soundBox.addClass("transparent");
		}
	},

	submitContent : function(type, content1, content2) {
		var tagContent = lightbox.lookupFeedInfo(lightbox.getTagId());
		var feedInfo = tagContent.feed;
		var content = {
			type : type,
			content1 : content1,
			content2 : content2,
			user : "you",
			time : "just now"
		}

		if (feedInfo.length === undefined)
		{
			feedInfo = [];			
		}

		feedInfo = feedInfo.reverse();
		feedInfo.push(content);
		feedInfo = feedInfo.reverse();

		lightbox.addContentItemToFeed(tagContent.tagName, content);
	}
};

reflect.lightbox.photo = undefined;
reflect.lightbox.tag = undefined;
reflect.lightbox.feed = undefined;
reflect.lightbox.commentOn = false;
reflect.lightbox.thoughtOn = false;
reflect.lightbox.soundOn = false;
reflect.lightbox.verticalLine1 = undefined;
reflect.lightbox.horizontalLine1 = undefined;
reflect.lightbox.horizontalLine2 = undefined;

var photoTransition = reflect.moment.phototransition;
var tagging = reflect.moment.tagging;
var util = reflect.moment.util;
var lightbox = reflect.lightbox;

var tags = [
	{
		id : "test",
		tagName : "Sam",
		xCoord : 1073,
		yCoord : 174,
		photoId : "#santancon1",
		feed : [
			{
				type : "comment",
				content2 : "this is great",
				user : "leslie l",
				time : "3 minutes ago"
			},
			{
				type : "song",
				content2 : "song by taylor swift",
				user : "leslie l",
				time : "3 hours ago"
			},
			{
				type : "thought",
				content1 : "is feeling",
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
		tagging.addTag($(tag.photoId), tag.id , tag.xCoord, tag.yCoord, tag.tagName);
	}
});