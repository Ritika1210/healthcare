const { PatientDoctorMapping, Patient, Doctor } = require('../models');

// POST /api/mappings/ - Assign a doctor to a patient
exports.assignDoctor = async (req, res) => {
  try {
    const { patientId, doctorId, notes } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'patientId and doctorId are required',
      });
    }

    // Verify Patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`,
      });
    }

    // Verify Doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${doctorId} not found`,
      });
    }

    // Check if already mapped
    const existingMapping = await PatientDoctorMapping.findOne({
      where: { patientId, doctorId },
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: `Doctor ${doctor.name} is already assigned to Patient ${patient.name}`,
      });
    }

    // Create Mapping
    const mapping = await PatientDoctorMapping.create({
      patientId,
      doctorId,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor assigned to patient successfully',
      data: mapping,
    });
  } catch (error) {
    console.error('Assign Doctor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error assigning doctor',
      error: error.message,
    });
  }
};

// GET /api/mappings/ - Retrieve all patient-doctor mappings
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await PatientDoctorMapping.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'age', 'gender', 'contact'],
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'phone', 'email'],
        },
      ],
      order: [['assignedDate', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings,
    });
  } catch (error) {
    console.error('Get All Mappings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving mappings',
      error: error.message,
    });
  }
};

// GET /api/mappings/<patient_id>/ - Get all doctors assigned to a specific patient
exports.getDoctorsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patient_id} not found`,
      });
    }

    const mappings = await PatientDoctorMapping.findAll({
      where: { patientId: patient_id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
        },
      ],
      order: [['assignedDate', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
      },
      count: mappings.length,
      assignedDoctors: mappings.map((m) => ({
        mappingId: m.id,
        assignedDate: m.assignedDate,
        notes: m.notes,
        doctor: m.doctor,
      })),
    });
  } catch (error) {
    console.error('Get Doctors by Patient error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving assigned doctors',
      error: error.message,
    });
  }
};

// DELETE /api/mappings/<id>/ - Remove a doctor from a patient
exports.removeMapping = async (req, res) => {
  try {
    const { id } = req.params;

    const mapping = await PatientDoctorMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: `Mapping record with ID ${id} not found`,
      });
    }

    await mapping.destroy();

    return res.status(200).json({
      success: true,
      message: `Doctor assignment removed successfully (Mapping ID: ${id})`,
    });
  } catch (error) {
    console.error('Remove Mapping error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing assignment',
      error: error.message,
    });
  }
};
