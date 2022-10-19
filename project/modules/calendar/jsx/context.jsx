export const JidaCalendarContext = React.createContext();

export function JidaCalendarContextProvider({calendar, children}) {

    const components = Object.freeze({
        MONTH: MonthView,
        WEEK: WeekView,
        YEAR: YearView,
        DAY: DayView,
        YEARS: YearView
    })
    const value = {calendar: calendar, ready: calendar.ready};
    const [view, setView] = React.useState(calendar.view);

    React.useEffect(() => {
        const onChange = () => setView(calendar.view);
        calendar.bind('change', onChange);
        return () => calendar.unbind('change', onChange);
    });

    let Control = components[view];
    const changeView = event => calendar.setView(event.currentTarget.dataset.view);

    if (!calendar.ready) return null;
    return (
        <JidaCalendarContext.Provider value={value}>
            <div>
                <button data-view="MONTH" onClick={changeView}>Mes</button>
                <button data-view="WEEK" onClick={changeView}>Semana</button>
                <Control/>
            </div>
        </JidaCalendarContext.Provider>
    );

}

export const useJidaCalendarContext = () => React.useContext(JidaCalendarContext);