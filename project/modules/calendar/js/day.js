/**
 *
 * @param {JidaCalendar} calendar
 * @param {Month} month
 * @param {Week} week the week that contains the day
 * @param {dayjs} date The dayjs object with current day set
 * @param index
 * @constructor
 */
function Day(calendar, month, week, date, index) {

    Object.defineProperty(this, 'index', {get: () => index});
    const id = `${month.date.year()}.${month.date.month()}.${week.index}.${index}`;
    Object.defineProperty(this, 'id', {get: () => id});
    Object.defineProperty(this, 'week', {get: () => week});
    Object.defineProperty(this, 'month', {get: () => month});

    //TODO revisar los valores de las propiedades day y date estan retornando el mismo valor
    Object.defineProperty(this, 'day', {get: () => date.date()});
    Object.defineProperty(this, 'date', {get: () => date.format(calendar.format)});

    Object.defineProperty(this, 'object', {get: () => date});

    Object.defineProperty(this, 'name', {
        get: () => date.toDate().toLocaleString('es-ES', {weekday: 'long'})
    });
    Object.defineProperty(this, 'shortName', {
        get: () => date.toDate().toLocaleString('es-ES', {weekday: 'short'})
    });

    Object.defineProperty(this, 'dayjs', {get: () => date});

}
