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
		}

		timeline.momentFilter.removeFilter(personId);
	},

	enableFilter : function(personId)
	{
		if ($(".filters").hasClass("hidden"))
		{
			$(".filters").removeClass("hidden");
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
			if ($(this).position().left > year.startingPixels - $(this).width() && 
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
			"nyc-conference"
		]
	},
	{
		person : "person-2",
		moments : [ 
			"jennys-graduation",
			"mt-ranier-hike"
		]
	}
];

var year = timeline.year;

timeline.year.year2013 = 800;
timeline.year.year2012 = 800;
timeline.year.year2011 = 800;
timeline.year.startingPixels = 328;




$(document).ready(function(){

	$(".checkbox input").click(function(ev){
		var id = $(this).parent().parent(".person").attr("id");

		if ($(this).is(":checked"))
		{
			filter.enableFilter(id);
		}
		else
		{
			filter.disableFilter(id);
		}
	});


	$(".moment").hover(function() {
		moment.showPeople($(this).attr("id"));
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

	year.getYear(2013).css("width", timeline.year2013);
	year.getYear(2012).css("width", timeline.year2012);
	year.getYear(2011).css("width", timeline.year2011);

	$(".tab-content").scroll(function(){
		var $activeLine = $(".year-line.active");
		if ($activeLine.position().left <= year.startingPixels - $activeLine.width() ||
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