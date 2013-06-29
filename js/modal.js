function createModalBackground()
{
	var $background = $("<div> </div>").attr("id", "modal-background")
	.css("position", "fixed")
	.css("opacity", ".90")
	.css("background-color", "#000")
	.css("width", "100%")
	.css("height", "100%")
	.css("z-index", "2")
	.css("left", "0")
	.css("top", "0");
	$("body").append($background);

	var $closeButton = $("<div> <a href=\"#\"> X </a></div>").attr("id", "close-button")
	.css("position", "fixed")
	.css("z-index", "2")
	.css("right", "30px")
	.css("top", "20px")
	.css("font-size", "30px")
	.attr("onClick", "closeModalWindow()");
 


	$("body").append($closeButton);
	$("body").css({ overflow: 'hidden' })

	$background.hover(function() {
		$(this).css("cursor", "pointer");
	})

	$background.click(function() {
		closeModalWindow();
	})

}

function destroyModalBackground()
{
	$("#modal-background").remove();
	$("#close-button").remove();  
	$("body").css({ overflow: 'inherit' })
}

function openModalWindow()
{
	createModalBackground();
	$("#detailed-photo").removeClass("hidden");
	$("#detailed-tags").removeClass("hidden");
}

function closeModalWindow()
{
	tagging.leaveTaggingState();
	tagging.hideAllPassiveTags();
	$("#detailed-photo").addClass("hidden");
	$("#detailed-tags").addClass("hidden");
	destroyModalBackground();
}

