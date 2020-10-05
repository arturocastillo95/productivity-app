import React, {useState, useEffect} from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import {dateToStr} from './utils'
import {BASE_URL} from './../App'

export default function Chart() {
    const [data, setData] = useState([]);

    function dataHeaders() {
        var today = new Date();
        var arr = [today];
        var i;
        for (i = -1; i > -8; i--) {
            var current = today;
            arr.unshift(current.addDays(i));
        };
        var headers = arr.map(d => dateToStr(d))
        return headers;
    }

    useEffect(() => {
        const runCall = async () => {
            let values = await fetchData();
            // const headers = values.map(h => h.finish_date)
            // headers = headers.filter(Boolean)
            var result = new Map();

            values.forEach(e => {
                if(result.get(e.finish_date)) {
                    result.set(e.finish_date, result.get(e.finish_date) + 1);
                } else {
                    result.set(e.finish_date, 1);
                }
            });

            var headers = dataHeaders();
            var arr = []
            
            headers.forEach(d => {
                var obj= {}
                obj['name'] = d;
                obj['Completed Tasks'] = (result.get(d) ? result.get(d): 0);
                arr.push(obj)
            })

            setData(arr);
        }

        const fetchData = async () => {
            const url = BASE_URL + 'api/task-list/'

            try {
                const response = await fetch(url);
                return response.ok ? response.json() : null;
            } catch (error) {
                console.log(error);
                return null;
            }
        }

        runCall();

    }, [])

    return (
        <div className='container has-text-centered'>
            <h2 className='title is-4'>Completed Tasks</h2>
            <h3 className='subtitle pb-5'>Measure your productivity in the last 7 days</h3>

            <ResponsiveContainer width="90%" height={400} >
                <LineChart
                    // width={700}
                    // height={400}
                    data={data}
                >
                    <defs>
                        <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1abc9c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1abc9c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Completed Tasks" stroke="#1abc9c" activeDot={{ r: 8 }} fill='url(#colorComplete)' />
                </LineChart>
            </ResponsiveContainer>
      </div>
    )
}
