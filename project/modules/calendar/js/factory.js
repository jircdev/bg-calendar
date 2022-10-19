const calendars = new Map();

export function calendarFactory(specs) {

    specs = (typeof specs === 'string') ? {date: specs} : specs;
    let DEFAULT_SPECS = {
        view: 'WEEK',
        format: 'YYYY-MM-DD'
    };

    specs = Object.assign(DEFAULT_SPECS, specs);
    let {year, month, date, view} = specs;
    if (calendars.has(date)) {
        return calendars.get(date);
    }
    const calendar = new JidaCalendar(specs);
    calendars.set(date, calendar);
    return calendar;

}
