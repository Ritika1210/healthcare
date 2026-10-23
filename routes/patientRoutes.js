const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

// All patient endpoints require authentication
router.use(authMiddleware);

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
