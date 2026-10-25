import { BRANCHES, GENDERS, STUDENT_NUMBER_REGEX, PHONE_REGEX, NAME_REGEX } from './constants';

export const validateParticipant = (participant, prefix = '') => {
  const errors = {};

  // Full Name validation
  const name = (participant.fullName || '').trim();
  if (!name) {
    errors[`${prefix}fullName`] = 'Participant name is required';
  } else if (name.length < 2 || name.length > 100) {
    errors[`${prefix}fullName`] = 'Participant name must be between 2 and 100 characters';
  } else if (!NAME_REGEX.test(name)) {
    errors[`${prefix}fullName`] = 'Participant name should contain letters only';
  }

  // Student Number validation
  const studentNum = (participant.studentNumber || '').trim();
  if (!studentNum) {
    errors[`${prefix}studentNumber`] = 'Student number is required';
  } else if (!/^\d+$/.test(studentNum)) {
    errors[`${prefix}studentNumber`] = 'Student number must contain digits only';
  } else if (!studentNum.startsWith('24') && !studentNum.startsWith('25')) {
    errors[`${prefix}studentNumber`] = 'Student number must start with 24 or 25.';
  } else if (!STUDENT_NUMBER_REGEX.test(studentNum)) {
    errors[`${prefix}studentNumber`] = 'Student number must start with 24 or 25 and be 7 or 8 digits.';
  }

  // Phone validation
  const phone = (participant.phone || '').trim();
  if (!phone) {
    errors[`${prefix}phone`] = 'Phone number is required';
  } else if (!/^\d+$/.test(phone)) {
    errors[`${prefix}phone`] = 'Phone number must contain digits only';
  } else if (!PHONE_REGEX.test(phone)) {
    errors[`${prefix}phone`] = 'Please enter a valid 10-digit Indian phone number starting with 6-9';
  }

  // Branch validation
  if (!participant.branch) {
    errors[`${prefix}branch`] = 'Please select a valid branch';
  } else if (!BRANCHES.includes(participant.branch)) {
    errors[`${prefix}branch`] = 'Please select a valid branch from the list';
  }

  // Gender validation
  if (!participant.gender) {
    errors[`${prefix}gender`] = 'Please select a valid gender option';
  } else if (!GENDERS.includes(participant.gender)) {
    errors[`${prefix}gender`] = 'Please select a valid gender option';
  }

  // Residence validation
  if (!participant.residence) {
    errors[`${prefix}residence`] = 'Residence must be either "Hosteller" or "Day Scholar"';
  } else if (!['Hosteller', 'Day Scholar'].includes(participant.residence)) {
    errors[`${prefix}residence`] = 'Residence must be either "Hosteller" or "Day Scholar"';
  }

  return errors;
};

export const validateRegistrationForm = (formData) => {
  let errors = {};

  // Team Name is required for both Solo and Team
  const teamName = (formData.teamName || '').trim();
  if (!teamName) {
    errors.teamName = 'Team name is required (2-50 characters)';
  } else if (teamName.length < 2 || teamName.length > 50) {
    errors.teamName = 'Team name must be between 2 and 50 characters';
  }

  // Validate Team Leader (Candidate 1)
  const leaderErrors = validateParticipant(formData.leader, 'leader_');
  errors = { ...errors, ...leaderErrors };

  // If Duo Team, validate Teammate (Candidate 2)
  if (formData.registrationType === 'team') {
    const teammateErrors = validateParticipant(formData.teammate, 'teammate_');
    errors = { ...errors, ...teammateErrors };

    // Prevent same student number for leader and teammate
    if (
      formData.leader.studentNumber &&
      formData.teammate.studentNumber &&
      formData.leader.studentNumber.trim() === formData.teammate.studentNumber.trim()
    ) {
      errors.teammate_studentNumber = 'Teammate student number cannot be identical to Team Leader';
    }

    // Prevent same phone for leader and teammate
    if (
      formData.leader.phone &&
      formData.teammate.phone &&
      formData.leader.phone.trim() === formData.teammate.phone.trim()
    ) {
      errors.teammate_phone = 'Teammate phone number cannot be identical to Team Leader';
    }
  }

  return errors;
};
