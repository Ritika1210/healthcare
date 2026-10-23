const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PatientDoctorMapping = sequelize.define('PatientDoctorMapping', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'patient_doctor_mappings',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['patientId', 'doctorId'],
    },
  ],
});

module.exports = PatientDoctorMapping;
