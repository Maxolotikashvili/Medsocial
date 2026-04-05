import { ApiUser } from "../models/user.model";

export const USER_ROLES = {
    PATIENT: 1,
    DOCTOR: 2,
    ADMINISTRATOR: 3
} as const;

export const USER_INITIAL_VALUE: ApiUser = {
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
    role: 1,
    slug: '',
    timezone: '',
    title: '',
    total_operations: 0
}