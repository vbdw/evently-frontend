"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/Context/AppContext";
import { useRouter } from "next/navigation";
import Event from "@/component/Event";
import no_events from '../../../assets/no-events.jpg'
import Link from "next/link";

export default function ShowEvents() {
    const [events, setEvents] = useState([]);
    const [eventLoading, setEventLoading] = useState(true);
    const router = useRouter();
    const { token, user } = useContext(AppContext);

    const getAllEvents = async () => {
        setEventLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/events");
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        } finally {
            setEventLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/auth/login");
        }
    }, [token]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) { // Ensure user is available before fetching events
                const data = await getAllEvents();
                setEvents(data.filter(event => event.user_id === user.id));
            }
        };
        fetchEvents();
    }, [user]); // Fetch events only when user is available

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="title">Event Listing</h1>
            {eventLoading ? (
                <p className="text-center text-gray-500">Loading events...</p>
            ) : events.length > 0 ? (
                events.map(event => <Event key={event.id} user={user} event={event} />)
            ) : (
                <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <img
                        src={no_events.src} // Free illustration link
                        alt="No events"
                        className="w-48 h-48 mb-4"
                    />
                    <p className="text-gray-500 text-lg">No events available.</p>
                    <Link
                        href="/event/create"
                        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                    >
                        ➕ Create an Event
                    </Link>
                </div>
            )}
        </div>
    );
}
