 var momentTimeline = {

      createDate : function(context, index, date)
      {
            var length = 40;
            var dateGap = 150;
            var yvalue = (dateGap*index);

            context.beginPath();
            context.lineWidth = 10;
            context.moveTo(60, yvalue);
            context.lineTo(60 + length, yvalue);
            context.stroke();
            context.strokeStyle = "#444";
            context.font = "18px sans-serif";
            context.fillStyle = "#444";
            context.fillText(date, 115, yvalue + 5);
      },

      draw : function ()
      {
            var canvas = document.getElementById('moment-timeline');
            var context = canvas.getContext('2d');
            var imageObj = new Image();

            // Timeline
            context.beginPath();
            context.moveTo(60, 000);
            context.lineTo(60, 1300);
            context.lineWidth = 10;
            context.strokeStyle = "#444";
            context.stroke();

            this.createDate(context, 1, 'March 1');
            this.createDate(context, 3, 'March 2');
            this.createDate(context, 5, 'March 3');
            this.createDate(context, 8, 'March 4');

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