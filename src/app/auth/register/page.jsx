'use client'
import { AppContext } from '@/Context/AppContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const {token, setToken} = useContext(AppContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: "post",
        body: JSON.stringify(formData),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json()
    if (data.errors) {
      setErrors(data.errors);
    } else {
      console.log(data);
      localStorage.setItem('token', data.token);
      setToken(data.token)
      router.push('/');
    }
    
  }
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token]);

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className="title">Create new account</h1>
      <form onSubmit={handleRegister} className='w-1/2 mx-auto space-y-6'>
        <div>
          <input
            type="text"
            placeholder='Name'
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <p className='error'>{errors.name[0]}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder='E-mail'
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className='error'>{errors.email[0]}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder='Password'
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <p className='error'>{errors.password[0]}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder='Confirme Password'
            value={formData.password_confirmation}
            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
          />
        </div>
        <button className='primary-btn'>Register</button>
      </form>
    </div>
  )
}
