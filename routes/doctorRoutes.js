const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

// Public endpoints to view doctors
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected endpoints to manage doctors
router.post('/', authMiddleware, createDoctor);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

module.exports = router;
