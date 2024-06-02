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
          {{ maxTime }}
        </p>
        <p v-if="maxTime != minTime">
          {{ minTime }}
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
import {formatTime} from "@/funcs/utils";

ChartJS.register(annotationPlugin);
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)


export default {
  // list[{
  //   datetime: Date,
  //   lengthSeconds: number,
  //   completed: boolean,
  //   specialTags: boolean,
  // }]
  props: ["activities"],

  components: {Scatter},
  data() {
    // sort the data by date
    let sortable = [];
    for (const x of this.activities.data) {
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
    let valsTranslation: { [id: string]: {}} = {}
    for (const x of sortable) {
      const info: any = x[1]
      vals.push(info.lengthSeconds)

      if (info.completed) {
        if (info.specialTags) {
          info["label"] = "Special Clear"
          special.push({
            x: i,
            y: info.lengthSeconds
          })
        } else {
          info["label"] = "Successful Clear"
          success.push({
            x: i,
            y: info.lengthSeconds
          })
        }
      } else {
        info["label"] = "Failed Clear"
        fail.push({
          x: i,
          y: info.lengthSeconds
        })
      }
      valsTranslation[i + "," + info.lengthSeconds] = info

      i += 1

      if (i == 10) {
        break
      }
    }

    // calc max / min
    const max = Math.max(...vals)
    const min = Math.min(...vals)

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

    // func to overwrite the default tooltip
    function genTooltip (tooltipItems: any) {
      const info = valsTranslation[tooltipItems.parsed.x + "," + tooltipItems.parsed.y]
      return [info.label, formatTime(info.lengthSeconds), info.datetime.toLocaleString()]
    }

    return {
      maxTime: formatTime(max),
      minTime: formatTime(min),
      valsTranslation: valsTranslation,
      chartData: {
        datasets: [
          {
            label: "Special",
            fill: true,
            backgroundColor: "#FFE629",
            data: special
          },
          {
            label: "Successful",
            fill: true,
            backgroundColor: "#008080",
            data: success
          },
          {
            label: "Failed",
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
          tooltip: {
            callbacks: {
              label: genTooltip,
            }
          },
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
</script>

