import React from 'react';
import _ from 'lodash';

class GameConatiner extends React.Component {
    constructor(props){
        super(props); 
        this.state = {
            gameData: [],
            activePage: 1, 
        }  
    }

    componentDidMount() {
        fetch('http://starlord.hackerearth.com/gamesarena')
        .then(res=>res.clone().json())
        .then(data => 
            {   
                const totalData = _.cloneDeep(data.filter(o => o.title));
                totalData.sort((a,b) => {
                    if (a[this.props.filter.sort_by] > b[this.props.filter.sort_by])
                    {return 1;} 
                    else {return -1}
                });
                const pageData = _.cloneDeep(totalData);
                data = _.cloneDeep(totalData);
                const total = pageData.filter(o => o.title).length / 6;
                const page = data.splice(0,6)
                this.setState({gameData: page, totalPages: Math.ceil(total), totalData})
            })
    }

    componentDidUpdate(prevProps, nextState) {
        const totalData =  _.cloneDeep(this.state.totalData);
        totalData.sort((a,b) => {
            if (a[this.props.filter.sort_by] > b[this.props.filter.sort_by])
            {return 1;} 
            else {return -1}
        });
        
        if (JSON.stringify(prevProps.filter) !== JSON.stringify(this.props.filter)) {
            const pageData =  _.cloneDeep(totalData);
            const page = pageData.splice(0,6)
            this.setState({gameData: page, totalData, groupedData: _.groupBy(totalData, this.props.filter.group_by),});
        }
    }

    displayDetails = game => {
        let view = null;
        if (game) {
            view = <div style={{display: 'flex', justifyContent: 'space-between', height: '100%'}}> 
                <div className="card-container">
                <div className="heading">
                <img alt="select" src="logo.svg" style={{'padding':'0 20px'}}/>
                <div className="title">{game.title}</div>
                </div>
                <div className="details">
                <div>
                <div className="text">
                    Genre:  <span style={{fontWeight: '800'}}>{game.genre}</span>
                    </div>
                    <div className="text">
                    Platform: <span style={{fontWeight: '800'}}>{game.platform}</span>
                    </div>
                    </div>
                    <div className="text" style={{    alignSelf: 'flex-end'}}>
                    <span style={{fontSize: '50px', fontWeight: '1000'}}>{game.score}</span>
                    </div>
                </div>
                </div>
                {game.editors_choice === 'Y' ? <div className="label">
                <div className="choice">EDITOR'S CHOICE</div>
                </div> : null}
            </div>;
        }
        return view
    }

    setPage = i => {
        // if (i !== this.state.activePage) {
            const totalData = _.cloneDeep(this.state.totalData);
            totalData.sort((a,b) => {
                if (a[this.props.filter.sort_by] > b[this.props.filter.sort_by])
                {return 1;} 
                else {return -1}
            });
            const pageData =  _.cloneDeep(totalData);
            const page = _.cloneDeep(pageData.splice(((i - 1) * 6),6))
            this.setState({gameData: page, activePage: i});
        //}
        
    }

    showPagination = () => {
        let view = null;
        const totalPages =this.state.totalPages;
        const pages = [];
        for (let i = 1; i <= totalPages; i += 1) {
            const style = {};
            style.opacity = '50%';
            if (this.state.activePage === i) {
                style.opacity = '100%';
            }
            pages.push(<div className="button" style={style} onClick={() => {this.setPage(i)}}> {i}</div>)
        }
        view = <div className="page">
            {pages}
        </div>
        return view;
    }

    handleSearch = e => {
        const value = e.target.value;
        const totalData = this.state.totalData;
        let groupedData = this.state.groupedData;
        const data = totalData.filter(o => o.title && o.title.toLowerCase().includes(value));
        if (groupedData && this.props.filter.group_by) {
            groupedData = _.groupBy(data, this.props.filter.group_by)
        }
        const total = data.length / 6;
        let page = data.splice(1,6);
        
        this.setState({gameData: page.length ? page : [], activePage: 1, totalPages: Math.ceil(total), groupedData})
    }

    displayPaginated = () => {
        return (<div>
             <div className="grid-container">{
                this.state.gameData.map(game => 
                {return game.title ? <div className="card">{this.displayDetails(game)}</div>: null})}
                </div>
            <div>
                {this.showPagination()}
                </div>
        </div>);
    }

    displayGrouped = () => {
        let view = null;
        if (this.state.groupedData) {
        view =  (
        <div>
            {Object.entries(this.state.groupedData).map(game => 
            {return game[0] && game[0] !== 'undefined' ? <div>
                <div className="group-head"> {game[0]} </div>
            <div className="grid-container">{
               game[1].map(game => 
               {return game.title  ? <div className="card">{this.displayDetails(game)}</div>: null})}
               </div>
               </div>: null}
            )}
       </div>);
        }
        return view;
    }

    render() {
        return (
        <div className="main">
            <div className="panel"> 
            <div>
            <spam>Search </spam><input type="text" onChange={(e) => {this.handleSearch(e)}}/>
            </div>
            </div>
            {this.props.filter.group_by ? this.displayGrouped() : this.displayPaginated()}
        </div>

        )
    }
}

export default GameConatiner;