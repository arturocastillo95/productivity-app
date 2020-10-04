import arrayMove from 'array-move';
import React, {useState, useEffect} from 'react'
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default function Chart() {
    const [data, setData] = useState([]);

    function dateToStr(date) {
        var dd = String(date.getDate()).padStart(2,'0');
        var mm = String(date.getMonth() + 1).padStart(2,'0');
        var year = date.getFullYear();

        var today = year + '-' + mm + '-' + dd;
        return today;
    }

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
            const url = 'http://127.0.0.1:8000/api/task-list/'

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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Completed Tasks" stroke="#1abc9c" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
      </div>
    )
}
