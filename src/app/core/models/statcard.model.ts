import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface StatCardData {
    label: string,
    value: number,
    todayCount: number,
    icon: IconDefinition,
    type: 'appointment' | 'payment' | 'review' | 'generic'
}