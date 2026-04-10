import { EducationDegree } from "../models/doctor.model";
import { ProcedureCategoryTitle } from "../models/procedures.model";

export const ALL_PROCEDURE_CATEGORIES: ProcedureCategoryTitle[] = [
  'Rhinoplasty (nose reshaping)',
  'Mammoplasty',
  'Breast augmentation',
  'Breast reduction',
  'Breast lift (mastopexy)',
  'Liposuction',
  'Abdominoplasty (tummy tuck)',
  'Facelift (rhytidectomy)',
  'Blepharoplasty (eyelid surgery)',
  'Otoplasty (ear reshaping)',
  'Chin augmentation (genioplasty)',
  'Neck lift',
  'Brazilian butt lift (BBL)',
  'Dental implants',
  'Veneers',
  'Teeth whitening',
  'Dental crowns',
  'Bridges',
  'Root canal treatment (endodontics)',
  'Orthodontics (braces, aligners)',
  'Gum grafting',
  'Tooth extraction (including wisdom teeth removal)',
  'Angioplasty (balloon dilation of arteries)',
  'Coronary artery bypass grafting (CABG)',
  'Pacemaker implantation',
  'Heart valve repair/replacement',
  'Cardiac catheterization'
] as const;

export const EDUCATION_DEGREES: EducationDegree[] = ["high school diploma", 'associate degree', "bachelor's degree", "master's degree", "doctorate (Phd)", "professional degree (Md, Jd, etc.)"] as const;