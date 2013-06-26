var PHOTO_CONTAINER_CLASS_NAME = ".photo-container";
var PHOTO_CONTAINERS;
var PHOTO_CONTAINER_IN_VIEW;

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
	if (audio)
	{
		$("audio", this.container).get(0).play();
	}
}

PhotoContainer.prototype.fade = function () 
{
	var audio = $("audio", this.container);
	if (audio.get(0))
	{
		/*
		audio.animate(
			{
				volume: 0
			}, 
			1000
		);
*/
		audio.get(0).pause();

	}
}


PhotoContainer.prototype.isElementInView = function() 
{
	var topOfWindow = $(window).scrollTop();
	var bottomOfWindow = bottomOfWindow + $(window).height();

	var topOfElement = this.container.offset().top;
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

	openModalWindow();

});

/********
** TESTS
*********/

function testIsElementInView() {

}