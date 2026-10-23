const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  assignDoctor,
  getAllMappings,
  getDoctorsByPatient,
  removeMapping,
} = require('../controllers/mappingController');

// All mapping endpoints require authentication
router.use(authMiddleware);

router.post('/', assignDoctor);
router.get('/', getAllMappings);
router.get('/:patient_id', getDoctorsByPatient);
router.delete('/:id', removeMapping);

module.exports = router;
