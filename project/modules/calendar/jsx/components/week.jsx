class WeekView extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.updateState = () => this.setState({});
    }

    componentDidMount() {
        this.context.calendar.bind('week.changed', this.updateState);
    }

    componentWillUnmount() {
        this.context.calendar.unbind('week.changed', this.updateState);
    }

    render() {

        const {calendar} = this.context;
        const week = calendar.activeWeek();

        const output = [];

        week.days.forEach(day => {
            output.push(
                <div key={day.index}>
                    <h4>{day.day}-{day.name} - {day.shortName}</h4>
                </div>
            )
        });
        const change = event => this.context.calendar.changeWeek(event.currentTarget.dataset.action);
        return (
            <>
                <h3>View {week.month.name}</h3>
                <button data-action="prev" onClick={change}>{`<`}</button>
                <button data-action="next" onClick={change}>{`>`}</button>
                <hr/>
                {output}
            </>
        )

    }
}

WeekView.contextType = JidaCalendarContext;