import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';
import HouseDetail from './pages/HouseDetail';

function App() {
	return (
		<Router>
			<div className="App">
				{/* 配置路由 */}
				<Route path="/" exact render={() => <Redirect to="/home"/>}/>
				<Route path="/home" component={Home} />
				<Route path="/citylist" component={CityList} />
				<Route path="/map" component={Map} />
				{/* 房源详情的路由规则 */}
				<Route path="/detail/:id" component={HouseDetail}/>
			</div>
		</Router>
	);
}

export default App;
