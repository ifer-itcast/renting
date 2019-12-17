import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import CityList from './pages/CityList';

function App() {
	return (
		<Router>
			<div className="App" />
			{/* 导航菜单 */}
			<ul>
				<li>
					<Link to="/home">首页</Link>
				</li>
				<li>
					<Link to="/citylist">城市</Link>
				</li>
			</ul>

			{/* 配置路由 */}
			<Route path="/home" component={Home} />
			<Route path="/citylist" component={CityList} />
		</Router>
	);
}

export default App;
