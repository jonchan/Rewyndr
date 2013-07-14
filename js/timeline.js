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
	}

}

var moment = timeline.moment;

$(document).ready(function(){
	$("#timeline .time").hover(function() {
		moment.toggleHighlight($(this).attr("moment-id"));
	});

	$(".moment").hover(function() {
		moment.showPeople($(this).attr("id"));
	})

	$(".moment").click(function(){
		window.location = 'moment.html';
	})
})