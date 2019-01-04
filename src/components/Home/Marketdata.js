import React from 'react';
import axios from 'axios';
import preloader from '../../preloader.gif';
import { Line } from 'react-chartjs-2'

class Marketdata extends React.Component{
    state = {
        loadedData: [],
        loading: true,
        chartData: {
            labels: ['ETH', 'BTC', 'EOS', 'XPR', 'LTC', 'BCH'],
            datasets:[
                {
                    label:'Population',
                    data:[
                        153.14,
                        3833.51,
                        0.359947,
                        161.54,
                        2.69,
                        0.114041
                    ],
                    backgroundColor:[
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ]
                }
            ]
        }
    };

    componentDidMount(){
        this.getData();
    }

    getData = () => {
        axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD')
            .then(res => {
                this.setState({
                    loadedData: res.data.Data,
                    loading: false
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
                <div className="data-wrapper col-sm-5">
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
                <div className="col-sm-7">
                    <h1>Graph</h1>
                    <Line
                        data={this.state.chartData}
                    />
                </div>
            </div>
        )
    }
}

export default Marketdata;