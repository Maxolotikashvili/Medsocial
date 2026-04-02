import { Rating } from './rating.model';
import { Language, BaseUser } from './user.model';

export type Patient = BaseUser;

export interface Doctor extends BaseUser {
  title: string;
  age_is_public: boolean;
  rating: Rating;

  educations: Education[];
  certifications: Certifications[];
  experiences: Experience[];
  introductions: Introductions[];
}

export interface Education {
  id: string;
  university: string;
  degree?: EducationDegree,
  from_date: string;
  till_date: string;
  description: string;
  image: string;
}

export type EducationDegree = "high school diploma" | "associate degree" | "bachelor's degree" | "master's degree" | "doctorate (Phd)" | "professional degree (Md, Jd, etc.)"

export interface Experience {
  id: string;
  work_title: string;
  from_date: string;
  till_date: string;
  image: string;
  description: string;
}

export interface Certifications {
  id: string;
  educational_institution: string;
  from_date: string;
  till_date: string;
  description: string;
}

export interface Introductions {
  id: string;
  video: string;
  image: string;
  description: string;
}
