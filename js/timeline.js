var timeline = {};

timeline.moment = {

	getMoment : function(momentId)
	{
		return $("#" + momentId);
	},

	toggleHighlight : function(momentId)
	{
		moment.getMoment(momentId).toggleClass("highlight");
	},

	showPeople : function(momentId)
	{
		var $moment = moment.getMoment(momentId);
		$moment.find(".people-open").toggleClass("hidden");
		$moment.find(".people").toggleClass("hidden");
	},

	filterMoments : function(personId)
	{
		console.log(filter.people);
	}
};


timeline.filter = {

	disableFilter : function(personId)
	{
		$("#" + personId+".person").find("input").prop("checked", false);
		$("#" + personId+".enabled-filter").remove();

		if ($(".enabled-filter").length == 1)
		{
			$(".filters").addClass("hidden");
			$timeline = $(".timeline-inner");
			$timeline.css("margin-top", parseInt($timeline.css("margin-top")) - 30);
			$(".moment").css("border", "inherit");
		}
		

		timeline.momentFilter.removeFilter(personId);

		if ($(".enabled-filter").length > 1)
		{
//			$(".moment:not(.disabled)").css("border", "#ff2100 1px solid");
		}
	},

	enableFilter : function(personId)
	{
		if ($(".filters").hasClass("hidden"))
		{
			$(".filters").removeClass("hidden");
			$timeline = $(".timeline-inner");
			$timeline.css("margin-top", parseInt($timeline.css("margin-top")) + 30);
		}

		var $person = $("#" + personId);

		var imgSrc = $person.find("img").attr("src");
		var name = $person.find("label").text();

		var $filter = $("#enabled-filter-template").clone();
		$filter.removeClass("hidden");
		$filter.attr("id", personId);
		$filter.find(".name").text(name);
		$filter.find("img").attr("src", imgSrc);
		$(".enabled-filters").append($filter);		
		$filter.find(".close").click(function() {
			filter.disableFilter(personId);
		});

		timeline.momentFilter.applyFilter(personId);
		$(".disabled").css("border", "inherit");
//		$(".moment:not(.disabled)").css("border", "1px solid");
	},

	getActiveFilters : function() {
		var personIds = [];
		$(".person").each(function(){
			if ($(this).find("input").is(":checked"))
			{
				personIds.push($(this).attr("id"));
			}
		});
		return personIds;
	}
}

timeline.year = {
	getYear : function(year)
	{
		var $year;
		var $lines = $(".year-line").filter(function(index){
			if ($(this).attr("data-year") === year.toString())
			{
				$year = $(this);
			} 
		});
		return $year;
	},

	getActiveYear : function()
	{
		var $activeYear;
		$(".year-line").each(function(index){
			if ($(this).position().left > year.startingPixels - $(this).width() + 2 && 
				$(this).position().left <= year.startingPixels + $(this).width())
			{
				$activeYear = $(this);
				return false;
			} 
		});	
		return $activeYear;
	},

	getActiveYearLabel : function(yearStr) {
		$activeYearLine = year.getActiveYear();
		var $yearLabel;
		$(".year").each(function(index) {
			if ($(this).attr("data-year") === yearStr.toString())
			{
				$yearLabel = $(this);
				return false;
			} 
		});
		return $yearLabel;
	}
}

var moment = timeline.moment;
var filter = timeline.filter;
var momentFilter = timeline.momentFilter;


timeline.momentFilter = {
	applyFilter : function(personId)
	{
		var $activeMoments = $(".moment");
		var $person = filter.people.filter(function(person){
			return (person.person === personId);
		});

		var $momentsToFilter = $person[0].moments;
		$toDisable = $(".moment").filter(function(index, moment) {
			console.log($.inArray($(moment).attr("id"), $momentsToFilter));

			return $.inArray($(moment).attr("id"), $momentsToFilter) === -1;
		})


		$toDisable.each(function(i, item){
			console.log(item);
			if (!$(item).hasClass("disabled"))
			{
				$(item).addClass("disabled");
				$(item).find(".moment-overlay").removeClass("hidden");
			}
		});
	},

	resetFilters : function() 
	{
		$(".moment.disabled .moment-overlay").addClass("hidden");
		$(".moment.disabled").removeClass("disabled");
	},

	removeFilter : function(personId)
	{
		timeline.momentFilter.resetFilters();
		$.each(filter.getActiveFilters(), function(i, item)
		{
			timeline.momentFilter.applyFilter(item);
		});

	}
}

filter.people = [
	{
		person : "person-1",
		moments : [ 
			"jennys-graduation",
			"mt-ranier-hike",
			"bears-game",
			"arcade-fire-concert",
			"johnnys-farewell"
		]
	},
	{
		person : "person-2",
		moments : [ 
			"nyc-conference",
			"mt-ranier-hike",
			"johnnys-farewell",
			"arcade-fire-concert"

		]
	}
];

var year = timeline.year;

timeline.year.year2013 = 480;
timeline.year.year2012 = 850;
timeline.year.year2011 = 800;
timeline.year.startingPixels = 328;




$(document).ready(function(){

	$("#2013-anchor").click(function(){
		var pixelsToScroll = $("#2013-line").position().left - timeline.year.startingPixels;
		var scrollLeft = pixelsToScroll < 0 ? "-="+Math.abs(pixelsToScroll) : "+="+pixelsToScroll;
		$(".tab-content").animate({
				scrollLeft: scrollLeft
			}, 300, function() {
			}
		);
	})

	$("#2012-anchor").click(function(){
		var pixelsToScroll = $("#2012-line").position().left - timeline.year.startingPixels;
		var scrollLeft = pixelsToScroll < 0 ? "-="+Math.abs(pixelsToScroll) : "+="+pixelsToScroll;
		$(".tab-content").animate({
				scrollLeft: scrollLeft
			}, 300, function() {
			}
		);
	})

	$("#2011-anchor").click(function(){
		var pixelsToScroll = $("#2011-line").position().left - timeline.year.startingPixels;
		var scrollLeft = pixelsToScroll < 0 ? "-="+Math.abs(pixelsToScroll) : "+="+pixelsToScroll;
		$(".tab-content").animate({
				scrollLeft: scrollLeft
			}, 300, function() {
			}
		);
	})

	$(".checkbox input").click(function(ev){
		var id = $(this).parent().parent(".person").attr("id");

		if ($(this).is(":checked"))
		{
			timeline.filter.enableFilter(id);
			$(this).parent().addClass("on");
		}
		else
		{
			timeline.filter.disableFilter(id);
			$(this).parent().removeClass("on");
		}
	});

	$(".moment").mouseenter(function() {
		var $hover = $("<div> </div>").addClass('moment-hover').text("Explore This Moment"); 
		$(this).prepend($hover);
		$(this).find(".people").hide();
	})

	$(".moment").mouseleave(function() {
		var $hover = $("<div> </div>").addClass('moment-hover').text("Explore This Moment"); 
		$(this).find(".moment-hover").remove();
		$(this).find(".people").show();
	})

	$(".moment").mouseenter(function(){
		if ($(this).position().left < 275)
		{
			var pixelsToScroll = $(this).position().left - 275;
			$(".tab-content").animate({
					scrollLeft: "-="+Math.abs(pixelsToScroll)
				}, 300, function() {
				}
			);
		}
	})

	$(".moment").click(function(){
		window.location = 'moment.html';
	});

	year.getYear(2013).css("width", timeline.year.year2013);
	year.getYear(2012).css("width", timeline.year.year2012);
	year.getYear(2011).css("width", timeline.year.year2011);

	$(".tab-content").scroll(function(){
		var $activeLine = $(".year-line.active");
		if ($activeLine.position().left <= year.startingPixels - $activeLine.width() + 2||
			$activeLine.position().left > year.startingPixels)  
		{
			$activeLine.removeClass("active");
			var $activeYearLine = year.getActiveYear();
			$activeYearLine.addClass("active");

			$label = year.getActiveYearLabel($activeYearLine.attr("data-year"));
			$(".year.active").removeClass("active");
			$label.addClass("active");
		}
	})

})