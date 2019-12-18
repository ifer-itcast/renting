import React from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import News from '../News';
import './index.css';

export default class Home extends React.Component {
	state = {
		selectedTab: 'redTab'
	};
	renderContent(pageText) {
		return (
			<div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
				<div style={{ paddingTop: 60 }}>
					Clicked “{pageText}” tab， show “{pageText}” information
				</div>
				<a
					style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
					onClick={e => {
						e.preventDefault();
						this.setState({
							hidden: !this.state.hidden
						});
					}}
				>
					Click to show/hide tab-bar
				</a>
				<a
					style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
					onClick={e => {
						e.preventDefault();
						this.setState({
							fullScreen: !this.state.fullScreen
						});
					}}
				>
					Click to switch fullscreen
				</a>
			</div>
		);
	}
	render() {
		return (
            <div className="home">
			
				<TabBar
					tintColor="#21b97a"
					barTintColor="white"
				>
					<TabBar.Item
						title="Life"
						key="Life"
						icon={
							<i className="iconfont icon-ind"></i>
						}
						selectedIcon={
							<i className="iconfont icon-ind"></i>
						}
						selected={this.state.selectedTab === 'blueTab'}
						onPress={() => {
							this.setState({
								selectedTab: 'blueTab'
							});
						}}
						data-seed="logId"
					>
						{this.renderContent('首页')}
					</TabBar.Item>
					<TabBar.Item
						icon={
							<i className="iconfont icon-findHouse"></i>
						}
						selectedIcon={
							<i className="iconfont icon-findHouse"></i>
						}
						title="找房"
						key="Koubei"
						selected={this.state.selectedTab === 'redTab'}
						onPress={() => {
							this.setState({
								selectedTab: 'redTab'
							});
						}}
						data-seed="logId1"
					>
						{this.renderContent('Koubei')}
					</TabBar.Item>
					<TabBar.Item
						icon={
							<i className="iconfont icon-infom"></i>
						}
						selectedIcon={
							<i className="iconfont icon-infom"></i>
						}
						title="资讯"
						key="Friend"
						selected={this.state.selectedTab === 'greenTab'}
						onPress={() => {
							this.setState({
								selectedTab: 'greenTab'
							});
						}}
					>
						{this.renderContent('Friend')}
					</TabBar.Item>
					<TabBar.Item
						icon={
                            <i className="iconfont icon-my"></i>
                        }
						selectedIcon={
                            <i className="iconfont icon-my"></i>
                        }
						title="我的"
						key="my"
						selected={this.state.selectedTab === 'yellowTab'}
						onPress={() => {
							this.setState({
								selectedTab: 'yellowTab'
							});
						}}
					>
						{this.renderContent('My')}
					</TabBar.Item>
				</TabBar>
            </div>
		);
	}
}
