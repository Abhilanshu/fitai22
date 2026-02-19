import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface WorkoutLog {
    date: string;
    duration: number;
    caloriesBurned: number;
    exercises: any[];
}

const HistoryCalendar = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<WorkoutLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedLogs, setSelectedLogs] = useState<WorkoutLog[]>([]);

    useEffect(() => {
        if (!user) return;
        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/history/${user?.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Highlight days with workouts
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const hasWorkout = history.some(log =>
                new Date(log.date).toDateString() === date.toDateString()
            );
            return hasWorkout ? 'bg-green-500/20 text-green-400 font-bold rounded-full' : null;
        }
    };

    const handleDateClick = (value: Date) => {
        setSelectedDate(value);
        const logs = history.filter(log =>
            new Date(log.date).toDateString() === value.toDateString()
        );
        setSelectedLogs(logs);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Workout History
            </h3>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 calendar-container">
                    <Calendar
                        onChange={(val) => handleDateClick(val as Date)}
                        value={selectedDate}
                        tileClassName={tileClassName}
                        className="bg-transparent border-none text-white w-full"
                    />
                </div>

                <div className="flex-1 bg-black/40 rounded-xl p-4 min-h-[300px]">
                    <h4 className="text-lg font-bold mb-4 text-white border-b border-gray-700 pb-2">
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </h4>

                    {selectedLogs.length > 0 ? (
                        <div className="space-y-4">
                            {selectedLogs.map((log, idx) => (
                                <div key={idx} className="bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-400 font-bold">{Math.floor(log.duration / 60)} min</span>
                                        <span className="text-orange-400 text-sm">{log.caloriesBurned} kcal</span>
                                    </div>
                                    <div className="space-y-1">
                                        {log.exercises.map((ex: any, i: number) => (
                                            <div key={i} className="text-xs text-gray-300 flex justify-between">
                                                <span>{ex.name}</span>
                                                <span>{ex.reps} reps</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-10">No workouts recorded on this day.</p>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .react-calendar { 
                    background: transparent !important; 
                    border: none !important; 
                    font-family: inherit !important;
                    width: 100% !important;
                }
                .react-calendar__tile {
                    color: #fff;
                    padding: 10px 0;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: rgba(59, 130, 246, 0.2) !important;
                    border-radius: 8px;
                }
                .react-calendar__tile--now {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border-radius: 8px;
                }
                .react-calendar__navigation button {
                    color: white !important;
                    font-size: 1.2rem;
                }
                .react-calendar__viewContainer {
                   
                }
            `}</style>
        </div>
    );
};

export default HistoryCalendar;
