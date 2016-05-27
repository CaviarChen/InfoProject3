$(function () {
    $('#container1').highcharts({
        data: {
            table: 'datatable'
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'comparsion between new building and old buidling'
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Units'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name.toLowerCase();
            }
        }
    });
});
$(function () {
    $('#container2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'old building, have accessibility type in melbourne'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
           data: [{
        name: 'N-A',
        y: 161
      }, {
        name: 'L-L-A',
        y: 521,
        sliced: true,
        selected: true
      }, {
        name: 'M-L-A',
        y: 169
      }, {
        name: 'H-L-A',
        y: 449
      }]
    }]
  });
});

$(function () {
    // Age categories
    var categories = ['H-L-A', 'M-L-A', 'L-L-A', 'NA'];
    $(document).ready(function () {
        $('#container3').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'comparison of each type building between CBD and other area ,Melbourne 2015'
            },
            subtitle: {
                text: 'Source: dataMelbourne'
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value)  ;
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

            series: [{
                name: 'CBD',
                data: [-43.62, -13.87, -34.24, -7.94]
            }, {
                name: 'Other',
                data: [36.85, 9.41, 35.26, 18.48 ]
            }]
        });
    });

});
$(function () {
    $('#container4').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "high accessibility level building's type melbourne 2015"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Unoccupied - Unused',
                y: 23
            }, {
                name: 'Workshop/Studio',
                y: 4,
                sliced: true,
                selected: true
            }, {
                name: 'Unoccupied - Under Renovation',
                y:9
            }, {
                name: 'Unoccupied - Under Demolition/Condemned',
                y: 1
            }, {
                name: 'Unoccupied - Under Construction',
                y: 2
            }, {
                name: 'Transport',
                y: 3
            }, {
                name: 'Student Accommodation',
                y: 15
            }, {
                name: 'Storage',
                y:8
            }, {
                name: 'Retail - Stall',
                y: 4
            }, {
                name: 'Retail - Shop',
                y: 17
            }, {
                name: 'Retail - Cars',
                y: 1
            }, {
                name: 'Residential Apartment',
                y: 153
            }, {
                name: 'Public Display Area',
                y: 8
            }, {
                name: 'Performances, Conferences, Ceremonies',
                y: 18
            }, {
                name: 'Parking - Private Covered',
                y: 10
            }, {
                name: 'Parking - Commercial Covered',
                y: 24
            }, {
                name: 'Office',
                y: 204
            }, {
                name: 'Institutional Accommodation ',
                y: 5
            },{
                name: 'Hospital/Clinic',
                y: 14
            }, {
                name: 'Equipment Installation',
                y: 1
            },{
                name: 'Entertainment/Recreation - Indoor',
                y: 33
            }, {
                name: 'Proprietary or Undetectable',
                y: 0.2
            }]
        }]
    });
});
$(function () {
    $('#container5').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: 'Each type building for every 20 years'
        },
        subtitle: {
            text: 'Source:datamelbourne.com'
        },
        xAxis: {
            categories: ['1820-1840', '1840-1860', '1860-1880', '1800-1900', '1900-1920',
                '1920-1940', '1940-1960', '1960-1980', '1980-2000', '2000-Now'],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Percent'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
            shared: true
        },
        plotOptions: {
            area: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                }
            }
        },
        series: [{
            name: 'Not determined or not applicable',
            data: [ 0, 6, 9, 18, 17, 19, 37, 31, 52, 63]
        }, {
            name: 'Low level of accessibility',
            data: [ 3, 20, 34, 134, 94, 113, 98, 68, 63, 53]
        }, {
            name: 'Moderate level of accessibility',
            data: [ 1, 11, 17, 27, 31, 34, 28, 26, 25, 24]
        }, {
            name: 'High level of accessibility',
            data: [ 0, 8, 26, 43, 31, 60, 59, 139, 153, 222]
        }]
    });
});