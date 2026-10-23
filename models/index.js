const sequelize = require('../config/db');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const PatientDoctorMapping = require('./Mapping');

// User <-> Patient association
User.hasMany(Patient, { foreignKey: 'userId', as: 'patients', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Patient <-> Doctor associations through PatientDoctorMapping
Patient.hasMany(PatientDoctorMapping, { foreignKey: 'patientId', as: 'mappings', onDelete: 'CASCADE' });
PatientDoctorMapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(PatientDoctorMapping, { foreignKey: 'doctorId', as: 'mappings', onDelete: 'CASCADE' });
PatientDoctorMapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  PatientDoctorMapping,
};
