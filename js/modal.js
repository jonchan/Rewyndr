function createModalBackground()
{
	var $background = $("<div> </div>").attr("id", "modal-background")
	.css("position", "fixed")
	.css("opacity", ".80")
	.css("background-color", "#000")
	.css("width", "100%")
	.css("height", "100%")
	.css("z-index", ".5")
	.css("left", "0")
	.css("top", "0");
	$("body").append($background);

	var $closeButton = $("<div> <a href=\"#\"> X </a></div>").attr("id", "close-button")
	.css("position", "fixed")
	.css("z-index", ".51")
	.css("right", "30px")
	.css("top", "20px")
	.css("font-size", "30px")
	.attr("onClick", "closeModalWindow()");
 
	$("body").append($closeButton);

	console.log($background);
}

function destroyModalBackground()
{
	$("#modal-background").remove();
	$("#close-button").remove();
}

function openModalWindow()
{
	createModalBackground();
	$("#detailed-photo").removeClass("hidden");
	$("#detailed-tags").removeClass("hidden");
}

function closeModalWindow()
{
	$("#detailed-photo").addClass("hidden");
	$("#detailed-tags").addClass("hidden");
	destroyModalBackground();
}

