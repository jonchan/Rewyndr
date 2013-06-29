var PHOTO_CONTAINER_CLASS_NAME = ".photo-container";
var PHOTO_CONTAINERS;
var PHOTO_CONTAINER_IN_VIEW;
var SOUND_OFF = false;

/*****
** PhotoContainer
******/

function PhotoContainer($element)
{
	this.container = $element;
}

PhotoContainer.prototype.enable = function () 
{
	this.playSound();
	this.container.addClass("enabled");
	this.container.removeClass("disabled");
}

PhotoContainer.prototype.disable = function () 
{
	this.fade();
	this.container.removeClass("enabled");
	this.container.addClass("disabled");
}


PhotoContainer.prototype.playSound = function () 
{
	var audio = $("audio", this.container).get(0);
	if (audio && !SOUND_OFF)
	{
		$("audio", this.container).get(0).play();
	}
}

PhotoContainer.prototype.fade = function () 
{
	var audio = $("audio", this.container);
	if (audio.get(0))
	{
		audio.get(0).pause();

	}
}


PhotoContainer.prototype.isElementInView = function() 
{
	var topOfWindow = $(window).scrollTop();
	var bottomOfWindow = bottomOfWindow + $(window).height();

	var topOfElement = this.container.offset().top - 150;
	var bottomOfElement = topOfElement + this.container.height();
	return topOfElement >= topOfWindow && bottomOfElement <= bottomOfElement;
}


function firstElementInView() 
{
	var $photos = $(PHOTO_CONTAINER_CLASS_NAME);
	for (i = 0; i < PHOTO_CONTAINERS.length; i++)
	{
		var container = PHOTO_CONTAINERS[i];
		if (container.isElementInView())
		{
			return container;
		}
	}
}

function initializePhotoContainerObjects()
{
	var photoContainers = [];
	var $photos = $(PHOTO_CONTAINER_CLASS_NAME);
	for (i = 0; i < $photos.length; i++)
	{
		photoContainers.push(
			new PhotoContainer($($photos.get(i)))
		);
	}
	return photoContainers;
}

function initializeAddThoughtForms()
{

	$(".add-thoughts").click(function(){
		$(this).hide();
		$(this).next().show();
	})

	$(".btn-cancel").click(function() {
		var $formContainer = $(this).parent().parent();
		hideAddThoughtsForm($formContainer);
	})

	$(".photo").click(function(){
		openModalWindow();
	})

	$(".btn-save").click(function() {
		var $formContainer = $(this).parent().parent();

		var status = $formContainer.find(".input-noun").text() + " " + $formContainer.find(".input-verb option:selected").text() + " " + $formContainer.find(".input-adjective").val();

		var $recentData = $formContainer.parent().next().clone();
		$recentData.after($("<div class='row-fluid line'><hr/> </div>"));
		$recentData.find(".user").text("You");
		$recentData.find(".time").text("Just Now");
		$recentData.find(".content").text(status);
		$recentData.find(".people-like-link").text("0 people liked this");

		$formContainer.after($recentData);
		hideAddThoughtsForm($formContainer);
	})
}

$(document).ready(function() 
{
	PHOTO_CONTAINERS = initializePhotoContainerObjects();

	$(window).scroll(function() {
		var inView = firstElementInView(); 
		if (PHOTO_CONTAINER_IN_VIEW)
		{
			PHOTO_CONTAINER_IN_VIEW.disable();
		}
		PHOTO_CONTAINER_IN_VIEW = inView;
		inView.enable();
	})

	for (i=0; i<$(".adjectives").length; i++)
	{
		$($(".adjectives").get(i)).featurify({
			directionIn : -1,
			directionOut: -1,
			pause: 4000, 
			transition: 200 
		});	
	}

		for (i=0; i<$(".detailed-adjectives").length; i++)
		{
			$($(".detailed-adjectives").get(i)).featurify({
				directionIn : -1,
				directionOut: -1,
				pause: 4000, 
				transition: 200 
			});		
		}

	$("#audio-control a").click(function(e) {
		e.preventDefault();

		if ($(this).text().indexOf("off") != -1)
		{
			SOUND_OFF = true;
			PHOTO_CONTAINER_IN_VIEW.fade();
			$(this).text("Turn sound on");
		}
		else
		{
			SOUND_OFF = false;
			PHOTO_CONTAINER_IN_VIEW.playSound();
			$(this).text("Turn sound off");
		}
	})

	$(".thoughts-form").hide();

	initializeAddThoughtForms();

	$("#moment-header-content form").hide();

	$("#moment-header-content a").click(function(){
		$(this).hide();
		var $form = $(this).next();
		$form.find("input").val($(this).text());
		$(this).next().show();
	})

	$("#moment-header-content button").click(function(){
		var $form = $(this).parent();
		var $title = $form.parent().find("a");
		$form.hide();
		var inputValue = $form.find("input").val();
		$title.text(inputValue);
		$title.show();
		var $form = $(this).next();
	})

	momentTimeline.draw();
	tagging.initialize();

});

function hideAddThoughtsForm($formContainer)
{
	$formContainer.hide();
	$formContainer.prev().show();
}

