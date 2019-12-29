import React from 'react';
import { NavBar } from 'antd-mobile';
import axios from 'axios';
import { List, AutoSizer } from 'react-virtualized';
import './index.scss';

import { getCurrentCity } from '../../utils';

// 列表数据源
// const list = Array(100).fill('react-virtualized');

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

// 处理字符的索引
const formatCityIndex = letter => {
	switch (letter) {
		case '#':
			return '当前定位';
		case 'hot':
			return '热门城市';
		default:
			return letter.toUpperCase();
	}
};

const TITLE_HEIGHT = 36; // 索引高度
const NAME_HEIGHT = 50; // 每个城市名称高度

export default class CityList extends React.Component {
	state = {
		cityList: {},
		cityIndex: [],
		activeIndex: 0
	};
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

		this.setState({
			cityList,
			cityIndex
		});
	}
	// 渲染每一行数据的函数
	rowRenderer = ({
		key, // Unique key within array of rows
		index, // 索引号
		isScrolling, // 当前项是否滚动中，滚动中为 true
		isVisible, // 当前项在 List 中可见
		style // 指定了每一样的样式
	}) => {
		const { cityIndex, cityList } = this.state;
		const letter = cityIndex[index];
		// cityList[letter]
		return (
			<div key={key} style={style} className="city">
				<div className="title">
					{formatCityIndex(letter)}
				</div>
				{cityList[letter].map(item =>
					<div className="name" key={item.value}>
						{item.label}
					</div>
				)}
			</div>
		);
	};
	// 动态获取高度
	getRowHeight = ({ index }) => {
		// 索引标题高度 + 城市数量 * 城市名称的高度
		// TITLE_HEIGHT + cityList[cityIndex[index]] * NAME_HEIGHT
		const { cityList, cityIndex } = this.state;
		return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
	};

	renderCityIndex() {
		const { cityIndex, activeIndex } = this.state;
		return cityIndex.map((item, index) =>
			<li className="city-index-item" key={item}>
				<span className={activeIndex === index ? 'index-active' : ''}>
					{item === 'hot' ? '热' : item.toUpperCase()}
				</span>
			</li>
		);
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
					{({ width, height }) =>
						<List
							width={width}
							height={height}
							rowCount={this.state.cityIndex.length}
							rowHeight={this.getRowHeight}
							rowRenderer={this.rowRenderer}
						/>}
				</AutoSizer>
				{/* 右侧索引列表 */}
				<ul className="city-index">
					{this.renderCityIndex()}
				</ul>
			</div>
		);
	}
}
