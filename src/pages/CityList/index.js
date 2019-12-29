import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import './index.scss';

export default class CityList extends React.Component {
	render() {
		return (
			<div className="citylist">
				<NavBar
                    className="navbar"
					mode="light"
					icon={<i className="iconfont icon-back" />}
					onLeftClick={() => this.props.history.go(-1)}
				>
					城市选择
				</NavBar>
			</div>
		);
	}
}
