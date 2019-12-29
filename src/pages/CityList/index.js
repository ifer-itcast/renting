import React from 'react';
import { NavBar } from 'antd-mobile';
import axios from 'axios';
import { List, AutoSizer } from 'react-virtualized';
import './index.scss';

import { getCurrentCity } from '../../utils';

// 列表数据源
const list = Array(100).fill('react-virtualized');

// 渲染每一行数据的函数
function rowRenderer({
	key, // Unique key within array of rows
	index, // 索引号
	isScrolling, // 当前项是否滚动中，滚动中为 true
	isVisible, // 当前项在 List 中可见
	style // 指定了每一样的样式
}) {
	return (
		<div key={key} style={style}>
			{list[index]}
		</div>
	);
}

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
		// 城市列表
		const res = await axios.get('http://localhost:8080/area/city?level=1');
		const { cityList, cityIndex } = formatCityData(res.data.body);
		// 热门城市
		const hotRes = await axios.get('http://localhost:8080/area/hot');
		cityList['hot'] = hotRes.data.body;
		cityIndex.unshift('hot');
		// 当前城市
		const curCity = await getCurrentCity();
		cityList['#'] = [curCity];
		cityIndex.unshift('#');
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
				{/* 城市列表 */}
				<AutoSizer>
					{
						({width, height}) => <List width={width} height={height} rowCount={list.length} rowHeight={20} rowRenderer={rowRenderer} />
					}
				</AutoSizer>
				
			</div>
		);
	}
}
