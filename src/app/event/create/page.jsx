"use client"
import { AppContext } from '@/Context/AppContext'
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        event_date: '',
        location: ''
    });
    const [my_date, setMy_date] = useState('');
    const [my_time, setMy_time] = useState('');
    const [errors, setErrors] = useState({});
    const {token} = useContext(AppContext);
    const router = useRouter();
    
    const handleCreteEvent = async (e) => {
        e.preventDefault();
        const event_date = `${my_date} ${my_time}:00`;
        setFormData({...formData, event_date: event_date})
        console.log(formData)
        const googleMapsRegex = 'https://maps.app.goo.gl';
        if (!formData.location.includes(googleMapsRegex)) {
            console.log(formData.location.includes(googleMapsRegex))
            setErrors({ ...errors, location: ["Please enter a valid Google Maps link."] });
            return;
        }
        const res = await fetch('http://127.0.0.1:8000/api/events', {
            method: "post",
            body: JSON.stringify(formData),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json()
        if (data.errors) {
            setErrors(data.errors);
        } else {
            console.log(data);
            router.push('/');
        }
    }
    useEffect(() => {
        const event_date = `${my_date} ${my_time}:00`;
        setFormData({...formData, event_date: event_date})
    }, [my_date, my_time])
    useEffect(() => {
        if (!token) {
        router.push("/auth/login");
        }
    }, [token]);
    return (
        <div>
            <h1 className='title'>Create a new event</h1>
            <form onSubmit={handleCreteEvent} className='w-1/2 mx-auto space-y-6'>
                <div>
                    <input
                        type="text"
                        placeholder='Event Title'
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    {errors.title && <p className='error'>{errors.title[0]}</p>}
                </div>
                <div>
                    <textarea
                        rows="6"
                        placeholder='Event Content'
                        value={formData.body}
                        onChange={(e) => setFormData({...formData, body: e.target.value})}
                    />
                    {errors.body && <p className='error'>{errors.body[0]}</p>}
                </div>
                <div>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={my_date}
                        onChange={(e) => setMy_date(e.target.value)}
                    />
                    {errors.event_date && <p className='error'>{errors.event_date[0]}</p>}
                </div>
                <div>
                    <input
                        type="time"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={my_time}
                        onChange={(e) => setMy_time(e.target.value)}
                    />
                    {errors.event_date && <p className='error'>{errors.event_date[0]}</p>}
                </div>
                <div>
                    <label>Please select a location from <a className='google-maps-link' target="_blank" href="https://www.google.com/maps/">Google Maps</a>, copy the address link, and paste it here.</label>
                    <input
                        type="text"
                        placeholder='https://maps.app.goo.gl/example'
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    {errors.location && <p className='error'>{errors.location[0]}</p>}
                </div>
                <button className='primary-btn'>Create</button>
            </form>
        </div>
    )
}
