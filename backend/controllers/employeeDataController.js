// src/controllers/employeeDataController.js
const { pool } = require('../config/db');

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// GET All Employees
exports.getAllEmployees = async (req, res) => {
    try {
        const [employees] = await pool.query(
            `SELECT e.*, u.is_active AS user_account_status, u.email AS user_account_email, u.role AS user_role
             FROM employees e
             LEFT JOIN users u ON e.user_id = u.user_id
             ORDER BY e.full_name ASC`
        );
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching all employees:', error);
        res.status(500).json({ message: 'Server error fetching employees.' });
    }
};

// GET Employee Detail
exports.getEmployeeDetail = async (req, res) => {
    const { id } = req.params;
    try {
        // PERBAIKAN: Tambahkan LEFT JOIN ke tabel users
        const [employee] = await pool.query(
            `SELECT 
                e.*, 
                u.is_active AS user_account_status, 
                u.email AS user_account_email, 
                u.role AS user_account_role
             FROM employees e
             LEFT JOIN users u ON e.user_id = u.user_id
             WHERE e.employee_id = ?`, 
            [id]
        );

        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        
        const [dependents] = await pool.query('SELECT * FROM dependents WHERE employee_id = ?', [id]);
        
        res.status(200).json({ employee: employee[0], dependents });
    } catch (error) {
        console.error('Error fetching employee detail:', error);
        res.status(500).json({ message: 'Server error fetching employee detail.' });
    }
};

// CREATE Employee
exports.createEmployee = async (req, res) => {
    const { employee_nik, full_name, position, department, base_salary, email } = req.body;
    const actorId = req.user.user_id;

    if (!employee_nik || !full_name || !email) {
        return res.status(400).json({ message: 'NIK, Full Name, and Email are required.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingNik] = await connection.query('SELECT employee_id FROM employees WHERE employee_nik = ?', [employee_nik]);
        if (existingNik.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'NIK already exists.' });
        }
        const [existingEmail] = await connection.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'Email is already used for another system account.' });
        }

        const [userResult] = await connection.query(
            'INSERT INTO users (email, full_name, role, is_active, password_hash) VALUES (?, ?, ?, ?, ?)',
            [email, full_name, 'KARYAWAN', false, null]
        );
        const newUserId = userResult.insertId;

        const [employeeResult] = await connection.query(
            'INSERT INTO employees (employee_nik, full_name, position, department, base_salary, email, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [employee_nik, full_name, position, department, base_salary, email, newUserId]
        );
        
        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'CREATE_EMPLOYEE', `Menambahkan karyawan baru: ${full_name} (NIK: ${employee_nik})`]
        );

        await connection.commit();
        res.status(201).json({ message: 'Employee and user account created successfully.', employeeId: employeeResult.insertId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Server error adding employee.' });
    } finally {
        if (connection) connection.release();
    }
};

// UPDATE Employee
exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { employee_nik, full_name, position, department, base_salary, email } = req.body;
    const actorId = req.user.user_id;

    if (!employee_nik || !full_name || !position || !department || !email) {
        return res.status(400).json({ message: 'All fields are required for update.' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE employees SET employee_nik = ?, full_name = ?, position = ?, department = ?, base_salary = ?, email = ?
             WHERE employee_id = ?`,
            [employee_nik, full_name, position, department, base_salary, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        await pool.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'UPDATE_EMPLOYEE', `Memperbarui data karyawan: ${full_name} (NIK: ${employee_nik})`]
        );

        res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server error updating employee.' });
    }
};

// DELETE Employee
exports.deleteEmployee = async (req, res) => {
    const { id: employeeId } = req.params;
    const actorId = req.user.user_id;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [employeeData] = await connection.query('SELECT full_name, employee_nik, user_id FROM employees WHERE employee_id = ?', [employeeId]);
        if (employeeData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Employee not found.' });
        }
        const { full_name, employee_nik, user_id } = employeeData[0];
        
        await connection.query('DELETE FROM employees WHERE employee_id = ?', [employeeId]);
        if (user_id) {
            await connection.query('DELETE FROM users WHERE user_id = ?', [user_id]);
        }

        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'DELETE_EMPLOYEE', `Menghapus karyawan: ${full_name} (NIK: ${employee_nik})`]
        );

        await connection.commit();
        res.status(200).json({ message: 'Employee and associated data deleted successfully.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error while deleting employee.' });
    } finally {
        if (connection) connection.release();
    }
};

// --- CRUD for Dependents ---
exports.createDependent = async (req, res) => {
    const { employeeId } = req.params;
    const { full_name, relationship, birth_date } = req.body;
    try {
        // PERBAIKAN: Tambahkan kolom is_active dan nilai FALSE (0)
        const [result] = await pool.query(
            `INSERT INTO dependents (employee_id, full_name, relationship, birth_date, is_active) 
             VALUES (?, ?, ?, ?, FALSE)`,
            [employeeId, full_name, relationship, formatDate(birth_date)]
        );
        res.status(201).json({ message: 'Dependent added successfully.', dependentId: result.insertId });
    } catch (error) {
        console.error('Error adding dependent:', error);
        res.status(500).json({ message: 'Server error adding dependent.' });
    }
};
exports.updateDependent = async (req, res) => {
    const { id } = req.params;
    const { full_name, relationship, birth_date } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE dependents SET full_name = ?, relationship = ?, birth_date = ? WHERE dependent_id = ?`,
            [full_name, relationship, formatDate(birth_date), id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Dependent not found.' });
        res.status(200).json({ message: 'Dependent updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating dependent.' });
    }
};
exports.deleteDependent = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM dependents WHERE dependent_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Dependent not found.' });
        res.status(200).json({ message: 'Dependent deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting dependent.' });
    }
};