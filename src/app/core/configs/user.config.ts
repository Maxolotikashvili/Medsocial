import { User } from "../models/user.model";

export const USER_ROLES = {
    DOCTOR: 1,
    PATIENT: 2
} as const;

export const USER_INITIAL_VALUE: User = {
    age_is_public: false,
    bio: '',
    dob: '',
    email: '',
    email_verified: false,
    first_name: '',
    id: '',
    image: '',
    is_active: false,
    is_verified: false,
    languages: [{code: '', name: ''}],
    last_name: '',
    phone: '',
    phone_verified: false,
    role: 2,
    slug: '',
    timezone: '',
    title: '',
    total_operations: 0
}