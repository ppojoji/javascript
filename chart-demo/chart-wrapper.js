function ChartWrapper(canvasId, duration, chartType) {
  let instance;
  let labels = ["걷기", "달리기", "자전기", "하이킹"];
  if (chartType === "pie") {
    const data = {
      labels,
      datasets: [
        {
          label: "파이차트 예제",
          data: [300, 50, 100, 210],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(56, 105, 184)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const config = {
      type: "pie",
      data: data,
    };
    return (instance = new Chart($(canvasId), config));
  } else {
    console.log("////");
  }
}

$(document).ready(() => {
  let instance;

  //   const LineWithLine = Chart.controllers.line;
  //   Chart.controllers.LineWithLine = Object.assign(LineWithLine, {
  //     draw: function (ease) {
  //       Chart.controllers.line.prototype.draw.call(this, ease);

  //       if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
  //         var activePoint = this.chart.tooltip._active[0],
  //           ctx = this.chart.ctx,
  //           x = activePoint.tooltipPosition().x,
  //           topY = this.chart.legend.bottom,
  //           bottomY = this.chart.chartArea.bottom;

  //         // draw line
  //         ctx.save();
  //         ctx.beginPath();
  //         ctx.moveTo(x, topY);
  //         ctx.lineTo(x, bottomY);
  //         ctx.lineWidth = 3;
  //         ctx.strokeStyle = "#07C";
  //         ctx.stroke();
  //         ctx.restore();
  //       }
  //     },
  //   });

  Chart.defaults.LineWithLine = Chart.defaults.line;
  //Chart.defaults.LineWithLine.idx = 0;
  //class LineWithLine extends Chart.LineController {
  let LineWithLine = Chart.controllers.line.extend({
    //bottomView: [],
    //order: null,
    draw(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);
      var meta = this.getMeta();
      const views = meta.data.map((data) => data._view);
      if (this.index === 1) {
        this.chart.options.bottomViews = views;
      } else if (this.index === 0) {
        const { bottomViews } = this.chart.options;
        let { ctx } = this.chart;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#07C";

        for (let i = 0; i < views.length; i++) {
          ctx.moveTo(views[i].x, views[i].y);
          ctx.lineTo(bottomViews[i].x, bottomViews[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }
    },
  });
  Chart.controllers.LineWithLine = LineWithLine;

  const closeChart = () => {
    if (instance) {
      instance.destroy();
    }
  };

  const pieChart = (canvasId, labels, data) => {
    const config = {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "파이차트 예제",
            data,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(56, 105, 184)",
            ],
            hoverOffset: 4,
          },
        ],
      },
    };
    return (instance = new Chart($(canvasId), config));
  };
  const barStackChart = (canvasId, labels, chartData) => {
    const config = {
      type: "bar",
      data: data,
      data: {
        labels,
        datasets: chartData,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Stack Bar Chart",
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    };
    return (instance = new Chart($(canvasId), config));
  };
  const barChart = (canvasId, labels, chartData, colorResolver) => {
    /*
     목표 미달 : 
     목표 초과 : 
     활성 상태 : 
    */
    const FAILURE_COLOR = "#eeeeee";
    const SUCCESS_COLOR = "orange";
    const ACTIVE_COLOR = "blue";

    const chartColors = labels.map((_, index) =>
      colorResolver(FAILURE_COLOR, SUCCESS_COLOR, chartData[index])
    );

    // for(let i = 0 ; i < labels.length; i++) {
    //   chartColors[i] = colorResolver(FAILURE_COLOR, SUCCESS_COLOR, chartData[i]);
    // }

    const data = {
      labels,
      datasets: [
        {
          label: "My First Dataset",
          data: chartData,
          fill: false,
          borderColor: FAILURE_COLOR,
          backgroundColor: chartColors,
          tension: 0.1,
          hoverBackgroundColor: ACTIVE_COLOR,
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        onClick(e) {
          console.log("???", e);
          var elem = this.getElementAtEvent(e);
          if (elem.length === 0) {
            return;
          }
          chartColors.forEach((c, i) => {
            chartColors[i] = colorResolver(
              FAILURE_COLOR,
              SUCCESS_COLOR,
              chartData[i]
            );
          });
          console.log(elem[0]);
          chartColors[elem[0]._index] = ACTIVE_COLOR;
          this.update();
        },
      },
    };

    return new Chart($(canvasId), config);
  };
  const bloodSugarChart = (canvasId, labels, chartData) => {
    const data = {
      labels,
      datasets: [
        {
          label: "My First Dataset",
          data: chartData,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
    };

    return new Chart($(canvasId), config);
  };

  const scatterChart = (canvasId, labels, chartData) => {
    const data = {
      labels,
      datasets: [
        {
          label: "분산형 점 예제",
          data: chartData,
          backgroundColor: "rgb(255, 99, 132)",
        },
      ],
    };
    const config = {
      type: "scatter",
      data: data,
      options: {
        scales: {
          x: {
            stacked: true,
          },
        },
      },
    };

    return new Chart($(canvasId), config);
  };

  const bloodPressureChart = (canvasId, labels, chartData) => {
    const data = {
      labels,
      datasets: [
        {
          data: chartData[0].data,
          backgroundColor: "rgba(255, 255, 255, 0)",
          pointBackgroundColor: "#76b424",
          borderColor: "#76b42400",
          borderWidth: 0,
          pointRadius: 5,
          pointHoverRadius: 5,
        },
        {
          data: chartData[1].data,
          backgroundColor: "rgba(255, 255, 255, 0)",
          pointBackgroundColor: "#76b424",
          borderColor: "#76b42400",
          borderWidth: 0,
          pointRadius: 5,
          pointHoverRadius: 5,
        },
      ],
    };
    const config = {
      type: "LineWithLine",
      data: data,
      options: {
        bottomViews: [],
        scales: {
          y: {
            beginAtZero: true, // y는 0부터 시작
          },
        },
        tooltips: {
          enabled: false, // 툴팁 끔. 모든 x에 y 값이 있는 게 아니어서 툴팁을 켜면 잘못된 정보가 표시됨
          // (만약 툴팁을 true로 할 거면 툴팁 정보를 정정하는 코드를 추가해야 함)
        },
      },
      onClick: (e) => {
        var activePoint = LineWithLine.getElementAtEvent(e);
        console.log(activePoint);
      },
    };

    return new Chart($(canvasId), config);
  };
  const chart = {
    activityPieChart: (canvasId, duration, data) => {
      const label = ["걷기", "달리기", "자전거", "하이킹"];
      closeChart();
      return (instance = pieChart(canvasId, label, data));
    },
    barStackChart: (canvasId, duration, data) => {
      //const label = ["걷기", "달리기", "자전거", "하이킹"];
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = barStackChart(canvasId, labels[duration], data));
    },
    walkChart: (canvasId, duration, data, colorResolver) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = barChart(
        canvasId,
        labels[duration],
        data,
        colorResolver
      ));
    },
    runningChart: (canvasId, duration, data, colorResolver) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = barChart(
        canvasId,
        labels[duration],
        data,
        colorResolver
      ));
    },
    bycChart: (canvasId, duration, data, colorResolver) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = barChart(
        canvasId,
        labels[duration],
        data,
        colorResolver
      ));
    },
    hikingChart: (canvasId, duration, data, colorResolver) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = barChart(
        canvasId,
        labels[duration],
        data,
        colorResolver
      ));
    },
    bloodSugarChart: (canvasId, duration, data) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = bloodSugarChart(canvasId, labels[duration], data));
    },
    scatterChart: (canvasId, duration, data) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = scatterChart(canvasId, labels[duration], data));
    },
    bloodPressureChart: (canvasId, duration, data) => {
      const labels = {
        day: [7, 8, 9, 10, 11, 12],
        week: "일월화수목금토".split(""),
        month: [5, 6, 7, 8],
        year: [2018, 2019, 2020, 2021],
      };
      closeChart();
      return (instance = bloodPressureChart(canvasId, labels[duration], data));
    },
  };

  window.chart = chart;
});
