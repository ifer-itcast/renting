import React from 'react';
import { Flex } from 'antd-mobile';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import { API } from '../../utils/api';
import { BASE_URL } from '../../utils/url';
import SearchHeader from '../../components/SearchHeader';
import Filter from './components/Filter';

import styles from './index.module.css';
import HouseItem from '../../components/HouseItem';

// 获取当前定位城市信息
const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
	state = {
		// 列表数据
		list: [],
		// 总条数
		count: 0
	};
	// 初始化实例属性
	filters = {};
	componentDidMount() {
		this.searchHouseList();
	}
	// 用来获取房屋列表数据
	async searchHouseList() {
		// 获取当前定位城市 ID
		// const { value } = JSON.parse(localStorage.getItem('hkzf_city'));

		const res = await API.get('/houses', {
			params: {
				cityId: value,
				...this.filters,
				start: 1,
				end: 20
			}
		});
		const { count, list } = res.data.body;
		this.setState({
			list,
			count
		});
	}
	// 接收 Filter 组件中的筛选条件数据
	onFilter = filters => {
		this.filters = filters;
		// 调用获取房屋数据的方法
		this.searchHouseList();
	};
	renderHouseList = ({
		key, // Unique key within array of rows
		index, // 索引号
		style // 指定了每一样的样式
	}) => {
		// 根据索引号来获取当前这一行的房屋数据
		const { list } = this.state;
		const house = list[index];
		return (
			<HouseItem
				key={key}
				style={style}
				src={BASE_URL + house.houseImg}
				title={house.title}
				desc={house.desc}
				tags={house.tags}
				price={house.price}
			/>
		);
	};
	render() {
		return (
			<div>
				<Flex className={styles.header}>
					<i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
					<SearchHeader cityName={label} className={styles.searchHeader} />
				</Flex>
				{/* 条件筛选栏 */}
				<Filter onFilter={this.onFilter} />
				{/* 房屋列表 */}
				<div className={styles.houseItems}>
					<WindowScroller>
						{({ height, isScrolling, scrollTop }) =>
							<AutoSizer>
								{({ width }) =>
									<List
										autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
										width={width} // 视口的宽度
										height={height} // 视口的高度
										rowCount={this.state.count} // List 列表的行数
										rowHeight={120} // 每一行的高度
										rowRenderer={this.renderHouseList} // 选中每一行
										isScrolling={isScrolling}
										scrollTop={scrollTop}
									/>}
							</AutoSizer>}
					</WindowScroller>
				</div>
			</div>
		);
	}
}
