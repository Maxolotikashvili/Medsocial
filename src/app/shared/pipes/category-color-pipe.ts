import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryColor',
})
export class CategoryColorPipe implements PipeTransform {
  transform(title: string | undefined | null): string {
    if (!title) return 'background-gray';

    const text = title.toLowerCase();

    // 1. Red: Acute / Heart / Surgery
    if (this.contains(text, ['cardiology', 'surgery', 'surgical', 'heart', 'emergency'])) {
      return 'background-red';
    }

    // 2. Green: General
    if (this.contains(text, ['consultation','general', 'check'])) {
      return 'background-green';
    }

    // 3. Orange: Examination
    if (this.contains(text, ['examination','examine'])) {
      return 'background-orange';
    }
    
    // 4. Yellow: Analysis / Lab / Diagnostics
    if (this.contains(text, ['lab', 'blood', 'test', 'analysis', 'ultrasound', 'neurology', 'brain'])) {
      return 'background-yellow';
    }

    // 5. Blue: Medication / Management
    if (this.contains(text, ['diabetes', 'pills', 'management', 'medication', 'pharmacy'])) {
      return 'background-blue';
    }

    return 'background-gray';
  }

  private contains(text: string, keywords: string[]): boolean {
    return keywords.some((key) => text.includes(key));
  }
}
