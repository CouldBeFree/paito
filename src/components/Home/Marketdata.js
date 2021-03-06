import React from 'react';
import axios from 'axios';
import preloader from '../../preloader.gif';
import { Line } from 'react-chartjs-2'

class Marketdata extends React.Component{
    state = {
        loadedData: [],
        loading: true,
        chartData: {}
    };

    componentDidMount(){
        this.getData();
    }

    getData = () => {
        axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD')
            .then(res => {
                let coinName = Object.values(res.data.Data).map(item => item.CoinInfo.Name);
                let coinPercentage = Object.values(res.data.Data).map(item => item.DISPLAY.USD.CHANGEPCTDAY);
                this.setState({
                    loadedData: res.data.Data,
                    labels: coinName,
                    loading: false,
                    chartData:{
                        labels: coinName,
                        datasets:[
                            {
                                label:'Percentage',
                                data:coinPercentage,
                                backgroundColor:[
                                    'rgba(153, 102, 255, 0.6)'
                                ]
                            }
                        ]
                    }
                });
            })
            .catch(err => {
                console.log(err);
            })
    };

    render(){
        const { loadedData, loading } = this.state;
        return(
            <div className="row">
                <div className="data-wrapper col-md-12 col-lg-5">
                    <ul className="data-list">
                        <li>
                            <div className="head d-flex justify-content-between">
                                <span>Coins</span>
                                <span>Prices</span>
                                <span>Change %</span>
                            </div>
                        </li>
                        {
                            loading ? <img className="preloader" src={preloader} alt="preloader"/> :
                                Object.values(loadedData).map(item => {
                                    return <li key={item.CoinInfo.Id}>
                                        <div className="content d-flex justify-content-between">
                                            <span>{item.CoinInfo.Name}</span>
                                            <span>{item.DISPLAY.USD.PRICE}</span>
                                            <span className={item.DISPLAY.USD.CHANGEPCTDAY > 0 ? 'green' : 'red'}>
                                               <i className="fas fa-chevron-up"></i> {item.DISPLAY.USD.CHANGEPCTDAY} %
                                            </span>
                                        </div>
                                    </li>
                                })
                        }
                    </ul>
                </div>
                <div className="col-md-12 col-lg-7">
                    <Line
                        data={this.state.chartData}
                        options={{
                            title:{
                                display:'Test',
                                text:'Price change %',
                                fontSize:25
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default Marketdata;