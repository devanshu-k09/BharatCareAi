import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Static legal categories data (served directly, no DB needed)
const categories = [
  { _id: '1', title: 'Online Shopping & Consumer Problems', icon: 'fa-shopping-cart', description: 'Help with defective products, wrong items delivered, refund issues, and online shopping fraud.', commonIssues: ['Defective products', 'Overcharging / MRP violation', 'Poor after-sales service', 'Online shopping fraud', 'Misleading advertisements'] },
  { _id: '2', title: 'Online Scams & Cybercrime', icon: 'fa-shield-halved', description: 'Guidance on what to do if you are a victim of online fraud, hacking, or social media harassment.', commonIssues: ['Online financial fraud', 'Hacking / unauthorized access', 'Identity theft', 'Cyber stalking / harassment', 'Social media abuse'] },
  { _id: '3', title: 'UPI & Banking Fraud', icon: 'fa-landmark', description: 'Steps to recover your money after unauthorized UPI transfers, ATM fraud, or bank cheating.', commonIssues: ['Unauthorized transactions', 'ATM / card cloning', 'Loan mis-selling', 'Cheque bounce issues', 'Insurance fraud'] },
  { _id: '4', title: 'Salary & Workplace Issues', icon: 'fa-hard-hat', description: 'Your rights regarding unpaid salaries, sudden firing, workplace harassment, or contract issues.', commonIssues: ['Unpaid salaries', 'Wrongful termination', 'Workplace harassment', 'PF / ESI issues', 'Contract violations'] },
  { _id: '5', title: 'Tenant & Landlord Problems', icon: 'fa-house', description: 'Disputes regarding house rent, forced eviction, maintenance issues, and deposit refunds.', commonIssues: ['Illegal eviction', 'Security deposit disputes', 'Rent hike issues', 'Property maintenance neglect', 'Unauthorized subletting'] },
  { _id: '6', title: 'Property & Land Issues', icon: 'fa-map-location-dot', description: 'Help with land grabbing, title disputes, family property inheritance, and builder delays.', commonIssues: ['Land encroachment', 'Title disputes', 'Property inheritance', 'Builder delays / RERA', 'Illegal construction'] },
  { _id: '7', title: 'Women\'s Safety & Rights', icon: 'fa-venus', description: 'Support for workplace harassment, domestic violence, dowry issues, and gender discrimination.', commonIssues: ['Workplace sexual harassment', 'Domestic violence', 'Dowry harassment', 'Maternity benefit issues', 'Gender discrimination'] },
  { _id: '8', title: 'Police Issues & FIR Help', icon: 'fa-user-shield', description: 'Guidance on how to file an FIR, and what to do if the police refuse to register your complaint.', commonIssues: ['Refusal to file FIR', 'Police misconduct / brutality', 'Illegal detention', 'Custodial violence', 'Bribe demands'] },
];

const authorities = [
  { _id: '1', name: 'National Consumer Disputes Redressal Commission (NCDRC)', officeType: 'Consumer Forum', description: 'National apex body for consumer dispute redressal in India.', website: 'https://ncdrc.nic.in', contactNumber: '011-23387263' },
  { _id: '2', name: 'Cyber Crime Reporting Portal', officeType: 'Cyber Crime', description: 'National portal to file cyber crime complaints online.', website: 'https://cybercrime.gov.in', contactNumber: '1930' },
  { _id: '3', name: 'Right to Information (RTI) Portal', officeType: 'RTI', description: 'File RTI applications and track status online.', website: 'https://rtionline.gov.in', contactNumber: 'N/A' },
  { _id: '4', name: 'National Commission for Women (NCW)', officeType: "Women's Rights", description: 'Statutory body safeguarding rights of women.', website: 'https://ncw.nic.in', contactNumber: '7827170170' },
  { _id: '5', name: 'RBI Ombudsman', officeType: 'Banking', description: 'Resolve banking grievances and disputes.', website: 'https://cms.rbi.org.in', contactNumber: '14448' },
  { _id: '6', name: 'RERA Authority', officeType: 'Property / Real Estate', description: 'Regulatory authority for real estate disputes under RERA Act.', website: 'https://rera.gov.in', contactNumber: 'State Specific' },
  { _id: '7', name: 'Labour Commissioner Office', officeType: 'Labour', description: 'File labour, PF and ESI grievances.', website: 'https://labour.gov.in', contactNumber: '011-23710266' },
  { _id: '8', name: 'District Legal Services Authority (DLSA)', officeType: 'Legal Aid', description: 'Free legal aid and advice from government.', website: 'https://nalsa.gov.in', contactNumber: '15100' },
  { _id: '9', name: 'State Police Grievance Portal', officeType: 'Police', description: 'File complaints against police inaction or misconduct.', website: 'https://pgportal.gov.in', contactNumber: '112' },
];

router.get('/categories', protect, (req, res) => {
  res.json(categories);
});

router.get('/authorities', protect, (req, res) => {
  res.json(authorities);
});

export default router;
