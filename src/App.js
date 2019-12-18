import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import CityList from './pages/CityList';

function App() {
	return (
		<Router>
			<div className="App">
				{/* 配置路由 */}
				<Route path="/home" component={Home} />
				<Route path="/citylist" component={CityList} />
			</div>
		</Router>
	);
}

export default App;
