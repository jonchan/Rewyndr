 var momentTimeline = {

      createDate : function(context, index, date)
      {
            var length = 20;
            var dateGap = 150;
            var yvalue = (dateGap*index);

            context.beginPath();
            context.moveTo(80, yvalue);
            context.lineTo(80 + length, yvalue);
            context.stroke();
            context.font = "12px sans-serif";
            context.fillText(date, 105, yvalue + 5);
      },

      draw : function ()
      {
            var canvas = document.getElementById('moment-timeline');
            var context = canvas.getContext('2d');
            var imageObj = new Image();

            // Timeline
            context.beginPath();
            context.moveTo(80, 000);
            context.lineTo(80, 1000);
            context.stroke();

            this.createDate(context, 1, 'March 1, 2013');
            this.createDate(context, 3, 'March 2, 2013');
            // dates
/*
            context.beginPath();
            context.moveTo(50, 200);
            context.lineTo(80, 200);
            context.stroke();
            context.font = "12px sans-serif";
            context.fillText("date", 5, 205);

            context.beginPath();
            context.moveTo(50, 400);
            context.lineTo(80, 400);
            context.stroke();
            context.font = "12px sans-serif";
            context.fillText("date", 5, 405);

            context.beginPath();
            context.moveTo(50, 600);
            context.lineTo(80, 600);
            context.stroke();
            context.font = "12px sans-serif";
            context.fillText("date", 5, 605);

            context.beginPath();
            context.moveTo(50, 900);
            context.lineTo(80, 900);
            context.stroke();
            context.font = "12px sans-serif";
            context.fillText("date", 5, 905);
*/
  }
};