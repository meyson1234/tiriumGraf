
// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

//==============================================
const fetcher = async () => {
  // const rawResponse = await fetch('http://localhost:3000/data', {
  const rawResponse = await fetch('https://kapisoonod.beget.app/data', {
    method: 'GET',
  //   mode: "no-cors", 
    headers: {
      // 'Content-Type': 'text/plain',
      // 'Content-Type': 'application/json',
  },
    // body: JSON.stringify(output)
  });
  const content = await rawResponse;
  console.log(content);
  return content
};

  function readedata(params) {
    const objtrue = {},
          objflase = {};
    console.log(params);

      function newData(obgectBoolean,spliset,item) {
        if(typeof obgectBoolean[spliset] ==='undefined') {
          obgectBoolean[spliset] = [item];
        } else {
          obgectBoolean[spliset].push(item);
        }
      } 

    params.forEach(item=> {
      // console.log('==================');
      // console.log(item.time);
      const [d,t] = item.time.indexOf('T') === -1? item.time.split(' ') : item.time.split('T');
      // console.log
      const [h,m] = t.split(':'),
      timeSort = +m > 30 ?`${d}T${h}:30:00.000Z`:`${d}T${h}:00:00.000Z`;
      // console.log(timeSort)
      newData(objflase,timeSort,item);
      // newData(objflase,timeSort,item);
    });
    
    // console.log(objflase);
    const arrTrue = [],
      arrFalse = [];


    for (const key in objflase) {
      const element = objflase[key];
      arrFalse.push({x:key, y: element.length, arr:element});
    }
    const result = arrFalse.sort(function(a, b) {
      var c = new Date(a.x);
      var d = new Date(b.x);
      return c-d;
    })
    
    // console.log(arrFalse);
    return result;
    // return arrFalse;
  }
function createElem(tableOneOrZero,arr) {
  const wrap = document.createElement('div');
        wrap.className = tableOneOrZero == 0?'removeTrue':'removeFalse';
        console.log(arr)
        arr.forEach(item=> {
          const div = document.createElement('article');
          div.className = 'team-member';
                div.innerHTML = `
                  <div class="team-member-name">
                    <h3>${item.time}</h3>
                    <p>${item.text}</p>
                  </div>
                  <ul class="social-links">
                    <li><a href="#"><i class="fa-brands fa-linkedin"></i></a></li>
                    <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                    <li><a href="#"><i class="fa-brands fa-github"></i></a></li>
                  </ul>
                `;
                wrap.appendChild(div);

        })

        const block =  tableOneOrZero == 0? document.querySelector('.removeTrue'): document.querySelector('.removeFalse');
        
        block.replaceWith(wrap);
}

fetcher()
.then((response) => {
  return response.json();
})
.then((data) => {
  const trueDateArr = readedata(data.trueData),
        fasleDateArr = readedata(data.falseData);
        // console.log(fasleDateArr);
        createElem(0, trueDateArr[trueDateArr.length -1].arr )
        createElem(1, fasleDateArr[fasleDateArr.length -1].arr )
  const chartOptions = {
      series: [
        {
          name: "true",
          data: trueDateArr
          // data: readedata(data.trueData)
        },
        {
          name: "false",
          data: fasleDateArr
        },
      ],
      chart: {
        id: "chart2",

          events: { 
            click: function (event, chartContext, config) {
            console.log("test click");

            if(config.dataPointIndex == -1 && config.seriesIndex == -1) return console.log('false');
            createElem(config.seriesIndex, config.globals.initialSeries[config.seriesIndex].data[config.dataPointIndex].arr);
           
          },
          dataPointSelection: function (event, chartContext, config) {
            console.log("test dps");
          }
        },
        // type: "bar",
        type: "area",
        width:1050,
        foreColor: "#ccc",
        height: 350,
        // stacked: true,
        toolbar: {
          autoSelected: "pan",
        show: true
        },
      
      },
      colors: [ "#00E396", "#fb3c00", "#CED4DC"],
      stroke: {
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      xaxis: {
        type: "datetime"
      },
      markers: {
        size: 2,
        colors: ['#6ef31e',"#f31e1e"],
        strokeColor: "#00BAEC",
        strokeWidth: 3
      },
      grid: {
        borderColor: "#555",
        clipMarkers: false,
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.55,
          opacityTo: 0
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        min: 0,
        tickAmount: 4
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        style: {
          fontSize: '12px',
          fontFamily: undefined
        },
        onDatasetHover: {
            highlightDataSeries: false,
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          // console.log(series) //точки по вертикали 
          // console.log(seriesIndex) //красная линия или зеленая 
          // console.log(dataPointIndex) //протяженность с лево на право
          // console.log(w); 
          console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]) 
          const obj =  w.globals.initialSeries[seriesIndex].data[dataPointIndex] 
          console.log(obj.x)
          const [d, t] = obj.x.split('T');
            console.log(d);
          const data = d+' '+t.slice(0,t.indexOf('.'));
            // w.globals.labels[dataPointIndex] +
          return (
            '<div class="arrow_box">' +
            "<span>" +
            data +
            " : " +
            series[seriesIndex][dataPointIndex] +
            "</span>" +
            "</div>"
          );
        }
    } 
 
    }

  
  var chart1 = new ApexCharts(document.querySelector("#chart-area"), chartOptions);
  
  chart1.render();
  
  var options2 = {
    chart: {
      events: { 
        click: function (event, chartContext, config) {
        console.log("test click");
      },
      dataPointSelection: function (event, chartContext, config) {
        console.log("test dps");
      }
    },
 
      
      id: "chart1",
      height: 130,
      width:1050,
      type: "bar",
      foreColor: "#ccc",
      brush: {
        target: "chart2",
        enabled: true
      },
      selection: {
        enabled: true,
        fill: {
          color: "#fff",
          opacity: 0.4
        },
        // xaxis: {
        //   min: new Date("27 Jul 2017 10:00:00").getTime(),
        //   max: new Date("14 Aug 2017 10:00:00").getTime()
        // }
      }
    },
    colors: ["green",'red'],
    series: [{
              name: "true",
              data: trueDateArr
            },
            {
              name: "false",
              data: fasleDateArr
            }
    ],
    stroke: {
      width: 2
    },
    grid: {
      borderColor: "#444"
    },
    // markers: {
    //   size: 0
    // },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tickAmount: 2
    }
  };
  
  var chart2 = new ApexCharts(document.querySelector("#chart-bar"), options2);
  
  chart2.render();
  
  
});
