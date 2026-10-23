const { Doctor, PatientDoctorMapping, Patient } = require('../models');

// POST /api/doctors/ - Add a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone, yearsOfExperience } = req.body;

    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialization, email, and phone are required fields',
      });
    }

    const existingDoctor = await Doctor.findOne({ where: { email: email.toLowerCase() } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this email already exists',
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      email: email.toLowerCase(),
      phone,
      yearsOfExperience: yearsOfExperience || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Create Doctor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding doctor',
      error: error.message,
    });
  }
};

// GET /api/doctors/ - Retrieve all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['name', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Get Doctors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving doctors',
      error: error.message,
    });
  }
};

// GET /api/doctors/<id>/ - Get details of a specific doctor
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: PatientDoctorMapping,
          as: 'mappings',
          include: [
            {
              model: Patient,
              as: 'patient',
              attributes: ['id', 'name', 'age', 'gender', 'contact'],
            },
          ],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('Get Doctor by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving doctor details',
      error: error.message,
    });
  }
};

// PUT /api/doctors/<id>/ - Update doctor details
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found`,
      });
    }

    const { name, specialization, email, phone, yearsOfExperience } = req.body;

    if (email && email.toLowerCase() !== doctor.email) {
      const emailExists = await Doctor.findOne({ where: { email: email.toLowerCase() } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Another doctor already has this email address',
        });
      }
    }

    await doctor.update({
      name: name || doctor.name,
      specialization: specialization || doctor.specialization,
      email: email ? email.toLowerCase() : doctor.email,
      phone: phone || doctor.phone,
      yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : doctor.yearsOfExperience,
    });

    return res.status(200).json({
      success: true,
      message: 'Doctor details updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Update Doctor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating doctor',
      error: error.message,
    });
  }
};

// DELETE /api/doctors/<id>/ - Delete a doctor record
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found`,
      });
    }

    await doctor.destroy();

    return res.status(200).json({
      success: true,
      message: `Doctor with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Delete Doctor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting doctor',
      error: error.message,
    });
  }
};
