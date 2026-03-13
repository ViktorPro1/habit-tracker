import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logs, setLogs] = useState({});

    const today = new Date().toISOString().split('T')[0];

    const getLast30Days = () => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    const fetchLogs = useCallback(async (habitId) => {
        const res = await api.get(`/habits/${habitId}/logs`);
        const map = {};
        res.data.forEach((log) => {
            map[log.date.split('T')[0]] = log.completed;
        });
        setLogs((prev) => ({ ...prev, [habitId]: map }));
    }, []);

    const fetchHabits = useCallback(async () => {
        const res = await api.get('/habits');
        setHabits(res.data);
        res.data.forEach((habit) => fetchLogs(habit.id));
    }, [fetchLogs]);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/habits', { name, description });
        setName('');
        setDescription('');
        fetchHabits();
    };

    const handleToggle = async (habitId, date) => {
        await api.post(`/habits/${habitId}/toggle`, { date });
        fetchLogs(habitId);
    };

    const handleDelete = async (id) => {
        await api.delete(`/habits/${id}`);
        fetchHabits();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const days = getLast30Days();

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Привіт, {user?.name}</h2>
                <button onClick={handleLogout}>Вийти</button>
            </div>

            <form onSubmit={handleCreate} style={{ marginBottom: '32px' }}>
                <input
                    type="text"
                    placeholder="Назва звички"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Додати звичку
                </button>
            </form>

            {habits.length === 0 && <p style={{ color: '#999' }}>Звичок немає. Додай першу!</p>}

            {habits.map((habit) => (
                <div key={habit.id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                            <strong>{habit.name}</strong>
                            {habit.description && <p style={{ color: '#666', margin: '4px 0' }}>{habit.description}</p>}
                        </div>
                        <button onClick={() => handleDelete(habit.id)}>🗑️</button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {days.map((day) => {
                            const completed = logs[habit.id]?.[day];
                            const isToday = day === today;
                            return (
                                <div
                                    key={day}
                                    onClick={() => handleToggle(habit.id, day)}
                                    title={day}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        backgroundColor: completed ? '#22c55e' : '#e5e7eb',
                                        border: isToday ? '2px solid #3b82f6' : '2px solid transparent',
                                        cursor: 'pointer',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}