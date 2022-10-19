class MonthView extends React.Component {

    constructor() {
        super();

        this.state = {};
        this.updateState = () => this.setState({});
    }

    componentDidMount() {
        this.context.calendar.bind('month.changed', this.updateState);
    }

    componentWillUnmount() {
        this.context.calendar.unbind('month.changed', this.updateState);
    }

    render() {

        const {calendar} = this.context;
        const {daysNames, month} = calendar;
        const output = daysNames.map(item => <th key={`day-${item}`}>{item}</th>);
        const weeks = [];

        month.weeks.items.forEach((week, i) => {
            const output = [];
            week.days.forEach((day, i) => output.push(<td key={`${day.day}-${i}`}>{day.day}</td>));
            weeks.push(<tr key={`week-${i}`}>{output}</tr>)
        });

        const changeMonth = event => {

            const action = event.currentTarget.dataset.action;
            const method = action === 'next' ? 'nextMonth' : 'previousMonth';

            this.context.calendar[method]()
        }

        return (
            <>

                <h1>{month.name}</h1>
                <button data-action="prev" onClick={changeMonth}>{`<`}</button>
                <button data-action="next" onClick={changeMonth}>{`>`}</button>
                <table>
                    <tbody>
                    <tr>{output}</tr>
                    {weeks}
                    </tbody>

                </table>
            </>
        );

    }
}

MonthView.contextType = JidaCalendarContext;