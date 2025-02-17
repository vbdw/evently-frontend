import { useState, useContext, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/Context/AppContext";
import Link from "next/link";

export default function Event({ event }) {
    const { token, user } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const deleteEvent = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/events/${event.id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            closeModal();
            window.location.reload();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{event.title}</h2>
                    <small className="text-sm text-gray-500">
                        Created by {event.user.name} at {new Date(event.created_at).toLocaleTimeString()}
                    </small>
                </div>
            </div>
            <div className="border rounded-md p-4 bg-gray-100">
                <p className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.body.replace(/\n/g, "<br/>") }}></p>
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-500">
                Event Date: <span className="text-gray-800">{event.event_date.replace(" ", " at ")}</span>
            </p>
            {event.location && (
                <a
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={event.location}
                >
                    📍 View Location
                </a>
            )}

            {user && user.id === event.user_id && (
                <div className="flex items-center justify-end gap-4">
                    <Link
                        className="bg-slate-600 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-lg px-4 py-2 shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        href={`/event/update/${event.id}`}
                    >
                        Update Event
                    </Link>
                    <button
                        onClick={openModal}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg px-4 py-2 shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        🗑️ Delete Event
                    </button>
                </div>
            )}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm p-6">
                            <Dialog.Title className="text-lg font-bold text-gray-900">Confirm Deletion</Dialog.Title>
                            <Dialog.Description className="mt-2 text-sm text-gray-500">
                                Are you sure you want to delete this event? This action cannot be undone.
                            </Dialog.Description>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteEvent}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-all"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
