<template>
  <div class="flex flex-col justify-center h-full">
    <div class="grid grid-cols-4">
      <div class="col-span-3 pr-2 self-center overflow-x-auto h-20">
        <div class="h-20">
          <Scatter
              id="my-chart-id"
              :options="chartOptions"
              :data="chartData"
          />
        </div>
      </div>

      <div class="flex flex-col font-medium italic text-sm text-text_dull justify-between">
        <!-- todo -->
        <p>
          Max Time
        </p>
        <p>
          Min Time
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Scatter} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(annotationPlugin);
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)


export default {
  // list[{
  //   datetime: Date,
  //   lengthSeconds: number,
  //   completed: boolean,
  //   special: boolean,
  // }]
  props: ["activities"],

  components: {Scatter},
  data() {
    // sort the data by date
    let sortable = [];
    for (const x of this.activities) {
      sortable.push([x.datetime, x])
    }

    sortable.sort(function (a: any, b: any) {
      return a[0] - b[0];
    })

    // calc the correct data
    const special = []
    const success = []
    const fail = []

    let i = 0
    let vals = []
    for (const x of sortable) {
      const info: any = x[1]
      vals.push(info.lengthSeconds)

      if (info.completed) {
        if (info.special) {
          special.push({
            x: i,
            y: info.lengthSeconds
          })
        } else {
          success.push({
            x: i,
            y: info.lengthSeconds
          })
        }
      } else {
        fail.push({
          x: i,
          y: info.lengthSeconds
        })
      }

      i += 1

      if (i == 10) {
        break
      }
    }

    // calc average
    let sum = 0;
    for (let i = 0; i < vals.length; i++) {
      sum += vals[i];
    }
    const averageLine = {
      type: 'line',
      borderColor: '#A2F0EF',
      borderWidth: 0.5,
      scaleID: 'y',
      value: sum / vals.length
    }

    return {
      chartData: {
        datasets: [
          {
            label: "Special",
            fill: true,
            backgroundColor: "#FFE629",
            data: special
          },
          {
            label: "Success",
            fill: true,
            backgroundColor: "#008080",
            data: success
          },
          {
            label: "Fail",
            fill: true,
            backgroundColor: "#E54D2E",
            data: fail
          }
        ]
      }
      ,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        elements:
            {
              point: {
                radius: 8
              }
            }
        ,
        plugins: {
          legend: {
            display: false
          }
          ,
          annotation: {
            annotations: {
              averageLine
            }
          }
        }
        ,
        scales: {
          x: {
            border: {
              display: false
            }
            ,
            ticks: {
              display: false
            }
            ,
            grid: {
              display: false,
            },
            beginAtZero: true
          }
          ,
          y: {
            border: {
              display: false
            }
            ,
            ticks: {
              display: false
            }
            ,
            grid: {
              display: false
            },
          }
          ,
        }
      }
    }
  }
}
// const canvas: any = document.getElementById("my-chart-id")
// canvas.style.width = props.activities.length * 40
</script>

