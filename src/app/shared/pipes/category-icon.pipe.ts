import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { faCapsules, faCircleInfo, faEye, faFlask, faHeartPulse, faStethoscope } from '@fortawesome/free-solid-svg-icons';

@Pipe({
  name: 'categoryIcon',
})
export class CategoryIconPipe implements PipeTransform {
  private readonly iconMap: Record<string, IconDefinition> = {
    heart: faHeartPulse,
    stethoscope: faStethoscope,
    eye: faEye,
    pills: faCapsules,
    flask: faFlask,
    default: faCircleInfo,
  };

  transform(title: string): IconDefinition {
    if (!title) return this.iconMap['default'];

    const text = title.toLowerCase();

    if (this.matches(text, ['cardiology', 'surgery', 'surgical', 'heart'])) {
      return this.iconMap['heart'];
    }
    if (this.matches(text, ['neurology', 'consultation', 'general', 'checkup'])) {
      return this.iconMap['stethoscope'];
    }
    if (this.matches(text, ['examination', 'examine'])) {
      return this.iconMap['eye'];
    }
    if (this.matches(text, ['diabetes', 'pills', 'management', 'medication'])) {
      return this.iconMap['pills'];
    }
    if (this.matches(text, ['lab', 'blood', 'test', 'analysis', 'ultrasound', 'dna'])) {
      return this.iconMap['flask'];
    }

    return this.iconMap['default'];
  }

  private matches(title: string, keywords: string[]): boolean {
    return keywords.some((key) => title.includes(key));
  }
}
