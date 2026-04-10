export const transformDate = (date: Date | number | string | (Date | number | string)[], format: '12h' | '24h'): string | string[] => {
  const formatTime = (input: Date | number | string): string => {
    let dateObj: Date;

    if (input instanceof Date) {
      dateObj = input;
    } else if (typeof input === 'number') {
      if (input >= 0 && input < 24) {
        dateObj = new Date();
        dateObj.setHours(input, 0, 0, 0);
      } else {
        dateObj = new Date(input);
      }
    } else if (typeof input === 'string') {
      const num = parseInt(input, 10);
      if (!isNaN(num) && num >= 0 && num < 24) {
        dateObj = new Date();
        dateObj.setHours(num, 0, 0, 0);
      } else if (input === '00' || input === '00:00') {
        dateObj = new Date();
        dateObj.setHours(0, 0, 0, 0);
      } else {
        const timeParts = input.split(':');
        if (timeParts.length === 2) {
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          if (!isNaN(hours) && !isNaN(minutes)) {
            dateObj = new Date();
            dateObj.setHours(hours, minutes, 0, 0);
          } else {
            dateObj = new Date(input);
          }
        } else {
          dateObj = new Date(input);
        }
      }
    } else {
      throw new Error('Invalid input type');
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    if (format === '24h') {
      const displayHours = hours === 0 ? 24 : hours;
      return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 0 : hours > 12 ? hours - 12 : hours;
      return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  if (Array.isArray(date)) {
    return date.map(d => formatTime(d));
  } else {
    return formatTime(date);
  }
};