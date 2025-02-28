import { AppContext } from '../../contexts/AppContext';
import { api } from '../../lib/axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ExpensesChart = () => {

    const [data, setData] = useState([]);
    const {user} = useContext(AppContext);

    const getData = useCallback(async() => {
        try{

            const response = await api.get(`${import.meta.env.VITE_SERVER_ADDRESS}/expenses/resume-by-year/${user}`);

            setData(response.data);
        }
        catch (error) {
            console.error("Error fetching data", error);
          }
    }, [user]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                barSize={20}
            >
                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="pv" fill="black" background={{ fill: '#eee' }} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ExpensesChart;
