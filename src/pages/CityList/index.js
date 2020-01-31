import React from 'react';
import { NavBar } from 'antd-mobile';
import axios from 'axios';
import './index.scss';

// [{label: '北京', value: '', pinyin: 'beijing', short: 'bj'}]
// [b: [{label: '北京', value: '', pinyin: 'beijing', short: 'bj'}]]

const formatCityData = list => {
	const cityList = {};
	list.forEach(item => {
		// 通过简写获取首字母
		let first = item.short.substr(0, 1);
		// 如果对象中有就 push
		if (cityList[first]) {
			cityList[first].push(item);
		} else {
			// 没有就新建一个数组，数组里面装这个数据
			cityList[first] = [item];
		}
	});
	const cityIndex = Object.keys(cityList).sort();

	return {
		cityList,
		cityIndex
	};
};

export default class CityList extends React.Component {
	componentDidMount() {
		this.getCityList();
    }
    // 获取城市数据并格式化
	async getCityList() {
		const res = await axios.get('http://localhost:8080/area/city?level=1');
		const { cityList, cityIndex } = formatCityData(res.data.body);
		console.log(cityList, cityIndex);
	}
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
