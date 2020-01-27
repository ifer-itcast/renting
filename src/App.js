import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';
import HouseDetail from './pages/HouseDetail';

// 登录
import Login from './pages/Login';
import Registe from './pages/Registe';

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
				<Route path="/login" component={Login} />
				<Route path="/registe" component={Registe} />
			</div>
		</Router>
	);
}

export default App;
