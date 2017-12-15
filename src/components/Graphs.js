import React, { Component } from 'react';
import DataGetter from '../data/getData';
const ReactHighcharts = require('react-highcharts')
require('highcharts-more')(ReactHighcharts.Highcharts);

class Graphs extends Component
{
	constructor(props)
	{
		super(props);

		this.state =
		{
			showNewItemInputs: false,
			charted: false,
			chartType: 'column',
			polar: false,
			items: [],
			form: {
				scenario: [10, 11, 12],
				indicator: [131, 123, 133, 125, 120],
				timePeriod: 23,
			}, // end form
			config: {chart: {polar: false}, series: [0]}, 
		};// end this.state

		this.chart = this.chart.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
	}// end constructor

	componentDidMount() {
		DataGetter.getScenarioCollectionById(24, 6).then(results =>
		{
			this.setState({ items: results, showNewItemInputs: true });
			this.chart();
		});// end then
	}// end componentDidMount()

	chart()
	{
		let processedtodoTypes = [];
		const todoTypes = this.state.items[0];

		todoTypes.values.forEach(element =>
		{
			let todoIndex = processedtodoTypes.findIndex(todoType => todoType.name === element.value);
			this.state.form.indicator.forEach(indicator =>
			{
				this.state.form.scenario.forEach(scenario =>
				{
					if (element.scenarioId === scenario && element.indicatorId === indicator && element.timePeriodId === this.state.form.timePeriod )
					{
						if (todoIndex === -1)
						{
							processedtodoTypes.push({ inId: indicator, scId: scenario, data: element.value })
						}// end if
						else
						{
							processedtodoTypes[todoIndex].y++;
						}// end else
					}// end if
				}); // end scenario.forEach
			});// end indicator.forEach
		});//end forEach

		this.setState({data: processedtodoTypes});

		let final = [{}];
		let dtArr = [];
		let inArr = [];
		let scArr = [];
		let swaps;
		for(let i=0; i< processedtodoTypes.length; i++)
		{
			dtArr[i] = processedtodoTypes[i].data;
			inArr[i] = processedtodoTypes[i].inId;
			scArr[i] = processedtodoTypes[i].scId;
		}// end for
		for (let i = 0; i < processedtodoTypes.length; i++)
		{
			swaps = 0;
			for (let j = 0; j < processedtodoTypes.length-i; j++)
			{
				if (inArr[j] > inArr[j+1])
				{
					//Sort Indicator
					let temp = inArr[j];
					inArr[j] = inArr[j+1];
					inArr[j+1] = temp;
					//Sort scenario
					temp = scArr[j];
					scArr[j] = scArr[j + 1];
					scArr[j + 1] = temp;
					//Sort Data
					temp = dtArr[j];
					dtArr[j] = dtArr[j + 1];
					dtArr[j + 1] = temp;
					swaps++;
				}// end if
			}// end for
			if(swaps === 0)
			{
				break;	
			}// end if
		}// end for

		todoTypes.indicatorCategories.forEach(inCateg =>
		{
			inCateg.indicators.forEach(ind =>
			{
				for(let i=0; i<inArr.length; i++)
				{
					if(ind.id === inArr[i])
					{
						inArr[i] = ind.name;
					}// end if
				}// end for
			}); // end indicators.forEach
		}); // end indicatorCategories.forEach

		todoTypes.scenarios.forEach(scen =>
		{
			for (let i = 0; i < scArr.length; i++)
			{
				if (scen.id === scArr[i])
				{
					scArr[i] = scen.name;
				}// end if
			}// end for
		}); // end scenarios.forEach

		let tempI = 0;
		for (let i = 0; i < dtArr.length; i++)
		{
			let temp = {}
			temp.name = scArr[i];
			temp.indicator = [];
			temp.data = [];
			for (let j = 0; j < inArr.length; j++)
			{
				if(scArr[j] === temp.name)
				{
					temp.indicator.push(inArr[j]);
					temp.data.push(dtArr[j]);
				}// end if
			}// end for

			let bool = false;
			for (let j = 0; j < final.length; j++)
			{
				if (final[j].name === temp.name)
				{
					bool = true;
				}// end if
			}// end for
			if(!bool)
			{
				final[tempI] = [];
				final[tempI] = temp;

				tempI++;
			}// end if
		}// end for

		final.type = 'column';
		final.pointPlacement = 'between';
		final.colorByPoint = false;

		const config =
		{
			chart:
			{
				polar: this.state.polar,
				type: this.state.chartType,
				height: 500, //+ pieHeight,
				marginRight: 0,
				marginLeft: 0,
				spacingRight: 0,
				spacingLeft: 0,
			}, // end chart

			title:
			{
				text: '<b>' + todoTypes.name + '</b> : ' + todoTypes.description
			}, // end title

			pane:
			{
				startAngle: 0,
				endAngle: 360
			}, // end pane

			xAxis:
			{
				tickInterval: 1,
				categories: final[0].indicator
			}, // end xAxis

			yAxis:
			{
				min: 0,
				max: 1
			}, // end yAxis
			
			tooltip:
			{
				headerFormat: '<span style="font-size:10px"></span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y}</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			}, // end tooltip

			plotOptions:
			{
				series:
				{
					allowPointSelect: true,
					pointStart: 0,
					pointInterval: 1,
				},// end series
				column:
				{
					allowPointSelect: true,
					pointPadding: 0,
					borderWidth: 0,
					//groupPadding: 0
				},// end column
			},// end plotOptions

			series: final
		};// end config

		if(this.state.polar)
		{
			config.pane =
			{
				startAngle: 0,
				endAngle: 360
			}// end pane
			config.xAxis =
			{
				tickInterval: 360 / (this.state.form.indicator.length),
				min: 0,
				max: 360,
				labels:
				{
					formatter: function () {
						return final[0].indicator[(this.value) / (360 / final[0].indicator.length)];
					}// end formatter
				}// end labels
			}// end xAxis
			config.plotOptions =
			{
				series:
				{
					allowPointSelect: true,
					pointStart: 0,
					pointInterval: 360 / (final[0].indicator.length),
				}, // end series
				column:
				{
					pointPadding: 0,
					groupPadding: 0
				}// end column
			}// end plotOptions
		}// end if

		let store = this.state;
		store.config = config;
		this.setState(store);
	}// end chart()
	
	handleOptionChange(e)
	{
		let store = this.state;
		if(e.target.value === 'polar')
		{
			store.chartType = 'column';
			store.polar = true;
			store.config.pane =
			{
				startAngle: 0,
				endAngle: 360
			}// end pane
			store.config.xAxis =
			{
				tickInterval: 360 / (store.form.indicator.length),
				min: 0,
				max: 360,
				labels:
				{
					formatter: function () {
						return store.config.series[0].indicator[(this.value) / (360 / store.form.indicator.length)];
					}// end formatter
				}// end labels
			}// end xAxis
			store.config.plotOptions =
			{
				series:
				{
					allowPointSelect: true,
					pointStart: 0,
					pointInterval: 360 / (store.form.indicator.length),
				}, // end series
				column:
				{
					pointPadding: 0,
					groupPadding: 0
				}// end column
			}// end plotOptions
		}// end if
		else if (e.target.value === 'table')
		{
			store.chartType = 'table';
			store.polar = false;
		}// end else if
		else
		{
			store.chartType = e.target.value;
			store.polar = false;
			store.config.plotOptions =
			{
				series:
				{
					allowPointSelect: true,
					pointStart: 0,
					pointInterval: 1,
				},// end series
				column:
				{
					allowPointSelect: true,
					pointPadding: 0,
					borderWidth: 0,
				},// end column
			}// end plotOptions
			store.config.xAxis =
			{
				categories: (store.config.series[0].indicator),
			}// end xAxis
			store.config.pane =
			{
				startAngle: 0,
				endAngle: 360
			}// end pane
		}// end else
		store.config.chart.type = store.chartType;
		store.config.chart.polar = store.polar;
		this.setState(store);
	}// end handleOptionsChange

	render()
	{
		if (this.state.showNewItemInputs)
		{
			const { form, config } = this.state;
			return (
				<div className="container">
					<div>
						<ReactHighcharts config={config} />
					</div>
					<div>
						<form>
							<table className="container">
								<tbody className="container">
									<tr>
										<td>
											<label><input type="radio" value="polar" checked={config.chart.polar === true && this.state.chartType === 'column'} onChange={this.handleOptionChange} />Polar</label>
										</td>
										<td>
											<label><input type="radio" value="column" checked={config.chart.polar === false && this.state.chartType === 'column'} onChange={this.handleOptionChange} />Column</label>
										</td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>
			);// end render
		}//end if
		else
		{
			return (<div>Retrieving Data</div>);
		}// end else
	}// end render
}// end Graphs

export default Graphs