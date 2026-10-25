export const BRANCHES = [
  'CSE',
  'CSE(AIML)',
  'CSE(DS)',
  'CSIT',
  'CS',
  'CS(Hindi)',
  'AIML',
  'IT',
  'ECE',
  'EN',
  'Mechanical',
  'Civil',
];

export const GENDERS = ['Male', 'Female'];

export const RESIDENCE_TYPES = [
  { value: 'Hosteller', label: 'HOSTELLER', description: 'Residing on AKGEC Campus' },
  { value: 'Day Scholar', label: 'DAY SCHOLAR', description: 'Commuting from home/PG' },
];

export const STUDENT_NUMBER_REGEX = /^(?:24|25)\d{5,6}$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const NAME_REGEX = /^[a-zA-Z\s]{2,100}$/;

export const DEFAULT_API_BASE_URL = 'https://registration-form-for-event-ekkr.vercel.app';
export const DEFAULT_TURNSTILE_SITE_KEY = '0x4AAAAAAFlswzFQMQC4_HWO';
