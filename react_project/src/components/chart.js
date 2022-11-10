import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries } from '@syncfusion/ej2-react-charts';


class App extends React.Component {
    constructor(props, chart) {
        super(props);
        this.series1 = [];
        this.value = 10;
        this.setTimeoutValue = 100;
        this.i = 0;
        for (; this.i < 50; this.i++) {
            if (Math.random() > .5) {
                this.value += Math.random() * 2.0;
            }
            this.series1[this.i] = { x: this.i, y: this.value };
        }
        this.chart = chart;
    }
    ;
    loaded(args) {
        this.intervalId = setTimeout(() => {
            if (this.chart === null) {
                clearInterval(this.intervalId);
            }
            else {
                if (Math.random() > .5) {
                    this.value += Math.random() * 2.0;
                }
                this.i++;
                this.series1.push({ x: this.i, y: this.value });
                this.series1.shift();
                args.chart.series[0].dataSource = this.series1;
            }
        }, this.setTimeoutValue);
    }
    render() {
        return <ChartComponent id='charts' loaded={this.loaded.bind(this)}>
      <Inject services={[LineSeries]}/>
      <SeriesCollectionDirective>
        <SeriesDirective dataSource={this.series1} xName='x' yName='y' type='Line'>
        </SeriesDirective>
      </SeriesCollectionDirective>
    </ChartComponent>;
    }
}
;
ReactDOM.render(<App />, document.getElementById('charts'));