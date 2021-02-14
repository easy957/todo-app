import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe extends DatePipe implements PipeTransform {

  transform(date: any, format: any = 'mediumDate'): any {

    if (date == null) {
      return 'Без срока';
    }

    date = new Date(date);

    const currentDate = new Date().getDate();

    if (date.getDate() === currentDate) {
      return 'Сегодня';
    }
    if (date.getDate() === currentDate - 1) {
      return 'Вчера';
    }
    if (date.getDate() === currentDate + 1) {
      return 'Завтра';
    }

    return new DatePipe('ru-RU').transform(date, format);
  }

}
