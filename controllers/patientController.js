const { Patient, PatientDoctorMapping, Doctor } = require('../models');

// POST /api/patients/ - Add a new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    if (!name || !age || !gender || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, gender, and contact are required fields',
      });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      medicalHistory,
      userId: req.user.id, // linked to authenticated user
    });

    return res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: patient,
    });
  } catch (error) {
    console.error('Create Patient error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding patient',
      error: error.message,
    });
  }
};

// GET /api/patients/ - Retrieve all patients created by the authenticated user
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: PatientDoctorMapping,
          as: 'mappings',
          include: [
            {
              model: Doctor,
              as: 'doctor',
              attributes: ['id', 'name', 'specialization', 'phone'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Get Patients error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving patients',
      error: error.message,
    });
  }
};

// GET /api/patients/<id>/ - Get details of a specific patient
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: {
        id,
        userId: req.user.id,
      },
      include: [
        {
          model: PatientDoctorMapping,
          as: 'mappings',
          include: [
            {
              model: Doctor,
              as: 'doctor',
            },
          ],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Get Patient by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving patient details',
      error: error.message,
    });
  }
};

// PUT /api/patients/<id>/ - Update patient details
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }

    const { name, age, gender, contact, address, medicalHistory } = req.body;

    await patient.update({
      name: name || patient.name,
      age: age || patient.age,
      gender: gender || patient.gender,
      contact: contact || patient.contact,
      address: address !== undefined ? address : patient.address,
      medicalHistory: medicalHistory !== undefined ? medicalHistory : patient.medicalHistory,
    });

    return res.status(200).json({
      success: true,
      message: 'Patient details updated successfully',
      data: patient,
    });
  } catch (error) {
    console.error('Update Patient error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating patient',
      error: error.message,
    });
  }
};

// DELETE /api/patients/<id>/ - Delete a patient record
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }

    await patient.destroy();

    return res.status(200).json({
      success: true,
      message: `Patient record with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Delete Patient error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting patient',
      error: error.message,
    });
  }
};
