"use client"
import { AppContext } from '@/Context/AppContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { Fragment, useContext, useState } from 'react'
import { Menu, X } from 'lucide-react' // Icons for menu toggle
import { Dialog, Transition } from '@headlessui/react';

export default function Nav() {
    const { user, token, setToken, setUser, loading } = useContext(AppContext);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLogout = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/logout', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            closeModal();
            router.push('/auth/login');
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Evently</Link>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className="hidden md:flex space-x-6 items-center">
                    <Link className="text-gray-300 hover:text-white transition" href="/">Home</Link>
                    {loading ? (
                        <p className="text-gray-400">Loading user...</p>
                    ) : user ? (
                        <>
                            <Link className="text-gray-300 hover:text-white transition" href="/event/show">My Events</Link>
                            <Link className="text-gray-300 hover:text-white transition" href="/event/create">New Event</Link>
                            <p className="text-gray-400 text-sm">Welcome back, {user.name}</p>
                            <button onClick={openModal} className="text-gray-300 hover:text-red-500 transition">Logout</button>

                        </>
                    ) : (
                        <>
                            <Link className="text-gray-300 hover:text-white transition" href="/auth/register">Sign Up</Link>
                            <Link className="text-gray-300 hover:text-white transition" href="/auth/login">Log In</Link>
                        </>
                    )}
                </div>
            </nav>
            {isOpen && (
                <div className="md:hidden bg-gray-800 text-white p-6 space-y-4">
                    <Link className="block text-gray-300 hover:text-white transition" href="/">Home</Link>
                    {loading ? (
                        <p className="text-gray-400">Loading user...</p>
                    ) : user ? (
                        <>
                            <Link className="block text-gray-300 hover:text-white transition" href="/event/show">My Events</Link>
                            <Link className="block text-gray-300 hover:text-white transition" href="/event/create">New Event</Link>
                            <p className="text-gray-400 text-sm">Welcome back, {user.name}</p>
                            <button onClick={openModal} className="text-gray-300 hover:text-red-500 transition">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="block text-gray-300 hover:text-white transition" href="/auth/register">Sign Up</Link>
                            <Link className="block text-gray-300 hover:text-white transition" href="/auth/login">Log In</Link>
                        </>
                    )}
                </div>
            )}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm p-6">
                            <Dialog.Title className="text-lg font-bold text-gray-900">Logout Confirmation</Dialog.Title>
                            <Dialog.Description className="mt-2 text-sm text-gray-500">
                                Are you sure you want to log out?
                            </Dialog.Description>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-all"
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </header>
    );
}
