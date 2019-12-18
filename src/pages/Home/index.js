import React from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import News from '../News';
import Index from '../Index';
import HouseList from '../HouseList';
import Profile from '../Profile';
import './index.css';

// 不变的数据，没必要存成状态
const tabItems = [
	{
		title: '首页',
		icon: 'icon-ind',
		path: '/home/index'
	},
	{
		title: '找房',
		icon: 'icon-findHouse',
		path: '/home/list'
	},
	{
		title: '资讯',
		icon: 'icon-infom',
		path: '/home/news'
	},
	{
		title: '我的',
		icon: 'icon-my',
		path: '/home/profile'
	}
];

export default class Home extends React.Component {
	state = {
		selectedTab: this.props.location.pathname
	};
	renderTabBarItem() {
		return tabItems.map(item => {
			return (
				<TabBar.Item
					title={item.title}
					key={item.title}
					icon={<i className={`iconfont ${item.icon}`} />}
					selectedIcon={<i className={`iconfont ${item.icon}`} />}
					selected={this.state.selectedTab === item.path}
					onPress={() => {
						this.setState({
							selectedTab: item.path
						});
						this.props.history.push(item.path);
					}}
				/>
			);
		});
	}
	render() {
		return (
			<div className="home">
				{/* 子路由 */}
				{/* 首页 */}
				<Route path="/home/index" component={Index} />
				{/* 找房 */}
				<Route path="/home/list" component={HouseList} />
				{/* 资讯 */}
				<Route path="/home/news" component={News} />
				{/* 我的 */}
				<Route path="/home/profile" component={Profile} />

				<TabBar tintColor="#21b97a" barTintColor="white" noRenderContent>
					{this.renderTabBarItem()}
				</TabBar>
			</div>
		);
	}
}
