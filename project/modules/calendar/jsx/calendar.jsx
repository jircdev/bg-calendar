export class JCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.calendar = new JidaCalendar();
        this.state = {};
        this.updateState = (state = {}) => this.setState(state);

    }

    componentDidMount() {
        this.calendar.bind('change', this.updateState);
    }

    componentWillUnmount() {
        this.calendar.unbind('change', this.updateState);
    }

    render() {

        if (!this.calendar.ready) return null;

        return (
            <JidaCalendarContextProvider calendar={this.calendar}>

            </JidaCalendarContextProvider>
        )
    }
}