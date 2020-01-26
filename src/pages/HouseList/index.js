import React from 'react';
import { Flex } from 'antd-mobile';
import { API } from '../../utils/api';
import SearchHeader from '../../components/SearchHeader';
import Filter from './components/Filter';

import styles from './index.module.css';

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'));

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
		const { value } = JSON.parse(localStorage.getItem('hkzf_city'));

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
	render() {
		return (
			<div>
				<Flex className={styles.header}>
					<i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
					<SearchHeader cityName={label} className={styles.searchHeader} />
				</Flex>
				<Filter onFilter={this.onFilter} />
			</div>
		);
	}
}
