const pool = require('../config/db');

// Отримати всі звички юзера
const getHabits = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

// Створити звичку
const createHabit = async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO habits (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

// Видалити звичку
const deleteHabit = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Звичку не знайдено' });
        }

        res.json({ message: 'Звичку видалено' });
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

// Відмітити виконання звички за день
const toggleLog = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    try {
        const existing = await pool.query(
            'SELECT * FROM habit_logs WHERE habit_id = $1 AND date = $2',
            [id, date]
        );

        if (existing.rows.length > 0) {
            const toggled = !existing.rows[0].completed;
            await pool.query(
                'UPDATE habit_logs SET completed = $1 WHERE habit_id = $2 AND date = $3',
                [toggled, id, date]
            );
            res.json({ completed: toggled });
        } else {
            await pool.query(
                'INSERT INTO habit_logs (habit_id, user_id, date, completed) VALUES ($1, $2, $3, true)',
                [id, req.user.id, date]
            );
            res.json({ completed: true });
        }
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

// Отримати логи звички за останні 30 днів
const getLogs = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT date, completed FROM habit_logs 
       WHERE habit_id = $1 AND date >= NOW() - INTERVAL '30 days'
       ORDER BY date ASC`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

// Статистика звички
const getStats = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT COUNT(*) as total,
              SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as done
       FROM habit_logs WHERE habit_id = $1`,
            [id]
        );

        const { total, done } = result.rows[0];
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;

        res.json({ total: parseInt(total), done: parseInt(done), percent });
    } catch (err) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};

module.exports = { getHabits, createHabit, deleteHabit, toggleLog, getLogs, getStats };