export const API_ENDPOINTS = {
    ADDRESS: {
        CITIES: 'address/cities/',
        COUNTRIES: 'address/countries/',
        LANGUAGES: 'address/languages/',
        TIMEZONES: 'address/timezones/'
    },

    AUTH: {
        PASSWORD_RESET: 'auth/password-reset/',
        REGISTER: 'auth/register/',
        RESET_CONFIRM: (uid: string, token: string) => `auth/reset/${uid}/${token}/confirm/`,
        LOGIN: 'auth/token/',
        TOKEN_REFRESH: 'auth/token/refresh/',
        TOKEN_VERIFY: 'auth/token/verify/'
    },

    CHATS: {
        CHATS: 'chats/',
        CHAT: (id: string) => `chats/${id}`,
        MESSAGES: (id: string) => `chats/${id}/messages/`,
        MESSAGE_IS_SEEN: (id: string, message_id: string) => `chats/${id}/${message_id}/`,
        ATTACH_FILE: (id: string) => `chats/${id}/messages/attach/`
    },

    DOCTORS: {
        DOCTORS: 'doctors/',
        WORKING_HOURS: (id: string) => `doctors/${id}/working-hours/`,
        DOCTORS_APPOINTMENT: (id: string) => `doctors/${id}/appointment/`,
        DOCTOR: (id: string) => `doctors/${id}/`,
        DOCTORS_REVIEW: (id: string) => `doctors/${id}/review/`,
        DOCTORS_REVIEWS: (id: string) => `doctors/${id}/reviews/`,
        PROCEDURES: 'doctors/procedures/',
        PROCEDURE: (id: string) => `doctors/procedures/${id}/`,
        PROCEDURES_REVIEW: (id: string) => `doctors/procedures/${id}/review/`,
        PROCEDURES_REVIEWS: (id: string) => `doctors/procedures/${id}/reviews/`
    },

    PATIENTS: {
        PATIENT: (id: string) => `patients/${id}/`,
        FAVOURITE_PROCEDURES: 'patients/favourite-procedures/',
        REMOVE_FAVOURITE_PROCEDURE: (id: string) => `patients/favourite-procedures/${id}/`
    },

    SCHEDULE: {
        EVENTS: (id: string) => `schedule/${id}/events/`,
        EVENT: (event_id: string, id: string) => `schedule/${id}/events/${event_id}/`,
        PARTICIPANTS: (id: string, event_id: string) => `schedule/${id}/events/${event_id}/participants/`,
        PARTICIPANT: (id: string, event_id: string, participant_id: string) => `schedule/${id}/events/${event_id}/participants/${participant_id}/`
    },

    USERS: {
        USER: (id: string) => `users/${id}/`,
        ADDRESSES: (id: string) => `users/${id}/addresses/`,
        ADRESS: (id: string, address_id: string) => `users/${id}/addressess/${address_id}/`,
        CONSULTATIONS: (id: string) => `users/${id}/consultations/`,
        CONSULTATION: (id: string, consultation_id: string) => `users/${id}/consultations/${consultation_id}/`,
        EDUCATIONS: (id: string) => `users/${id}/educations/`,
        EDUCATION: {
            create: (id: string) => `users/${id}/educations/`,
            update: (id: string, education_id: string) => `users/${id}/educations/${education_id}/`
        },
        EXPERIENCES: (id: string) => `users/${id}/experiences/`,
        EXPERIENCE: {
            create: (id: string) => `users/${id}/experiences/`,
            update: (id: string, experience_id: string) => `users/${id}/experiences/${experience_id}/`
        },
        INTRODUCTIONS: (id: string) => `users/${id}/introductions/`,
        INTRODUCTION: (id: string, introduction_id: string) => `users/${id}/introductions/${introduction_id}/`,
        LANGUAGES: (id: string) => `users/${id}/languages/`,
        NOTIFICATIONS: (id: string) => `users/${id}/notifications/`,
        NOTIFICATION: (id: string, notification_id: string) => `users/${id}/notifications/${notification_id}/`,
        PROCEDURES: (id: string) => `users/${id}/procedures/`,
        PROCEDURE: (id: string, procedure_id: string) => `users/${id}/procedures/${procedure_id}/`,
        SCHEDULES: {
            get: (id: string) => `users/${id}/working-hours/schedules/`,
            post: (id: string) => `users/${id}/working-hours/schedules/`,
            patch: (id: string, wh_id: string) => `users/${id}/working-hours/schedules/${wh_id}/`,
            delete: (id: string, wh_id: string) => `users/${id}/working-hours/schedules/${wh_id}/`,
        },
        SCHEDULE_OVERRIDES: (id: string) => `users/${id}/working-hours/schedule-overrides/`,
        SCHEDULE_OVERRIDE: (id: string, wh_id: string) => `users/${id}/working-hours/schedule-overrides/${wh_id}/`,
        DASHBOARD: 'users/dashboard/'
    }
} as const