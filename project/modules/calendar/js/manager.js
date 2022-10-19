function CalendarManager(parent, base) {

    parent.changeWeek = (action) => {
        const month = parent.month;
        const totalWeeks = month.weeks.items.size;
        const activeIndex = month.weeks.active.index;
        const anotherMonth = action === 'prev' && activeIndex === 1 || action === 'next' && activeIndex >= totalWeeks;
        if (anotherMonth) {
            parent.changeMonth(action);
            return;
        }

        action === 'next' ? month.weeks.next() : month.weeks.prev();

    };

    const changeMonth = action => {

        const {active} = parent.months;
        const newactive = action === 'next' ? active.index + 1 : active.index - 1;

        if (newactive < 0) {
            base.activeDay = 31;
            base.activeMonth = 11;
            parent.previousYear();
            return;
        }

        if (newactive > 11) {
            base.activeDay = 1;
            base.activeMonth = 0;
            parent.nextYear();
            return;
        }

        parent.months[action]();
    };

    parent.changeMonth = changeMonth;
    parent.nextMonth = () => changeMonth('next');
    parent.previousMonth = () => changeMonth('prev');
    parent.nextWeek = () => parent.changeWeek('next');
    parent.previousWeek = () => parent.changeWeek('prev');
    parent.previousYear = () => base.years.prev();
    parent.nextYear = () => base.years.next();
    parent.activeWeek = () => {
        const year = base.years.active;
        return year.months.active.weeks.active;

    }

    parent.goTo = date => {
        base.years.goTo(dayjs(date));
    }
    this.getMonth = (day) => {
        const date = dayjs(day);
        if (!date.isValid()) throw Error('the argument day is not a valid date', day);
        return new Month(this, date.getMonth(), true);

    }
}
