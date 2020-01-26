import React from 'react';
import { Flex } from 'antd-mobile';
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';
import { API } from '../../utils/api';
import { BASE_URL } from '../../utils/url';
import SearchHeader from '../../components/SearchHeader';
import Filter from './components/Filter';

import styles from './index.module.css';
import HouseItem from '../../components/HouseItem';

// 导入吸顶组件
import Sticky from '../../components/Sticky';

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
	renderHouseList = ({ key, index, style }) => {
		// 根据索引号来获取当前这一行的房屋数据
		const { list } = this.state;
		const house = list[index];

		// 判断 house 是否存在
		// 如果不存在，就渲染 loading 元素占位
		if (!house) {
			console.log(233);
			return (
				<div key={key} style={style}>
					<p className={styles.loading} />
				</div>
			);
		}

		return (
			<HouseItem
				key={key}
				// 注意：该组件中应该接收 style，然后给组件元素设置样式！！！
				style={style}
				src={BASE_URL + house.houseImg}
				title={house.title}
				desc={house.desc}
				tags={house.tags}
				price={house.price}
			/>
		);
	};
	// 判断列表中的每一行是否加载完成
	isRowLoaded = ({ index }) => {
		return !!this.state.list[index];
	};
	// 用来获取更多房屋列表数据
	loadMoreRows = ({ startIndex, stopIndex }) => {
		return new Promise(resolve => {
			// 数据加载完成时，调用 resolve 即可
			API.get('/houses', {
				params: {
					cityId: value,
					...this.filters,
					start: startIndex,
					end: stopIndex
				}
			}).then(res => {
				this.setState({
					list: [...this.state.list, ...res.data.body.list]
				});
				// 数据加载完成时，调用 resolve 即可
				resolve();
			});
		});
	};
	render() {
		const { count } = this.state;
		return (
			<div>
				<Flex className={styles.header}>
					<i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
					<SearchHeader cityName={label} className={styles.searchHeader} />
				</Flex>
				{/* 条件筛选栏 */}
				<Sticky height={40}>
					<Filter onFilter={this.onFilter} />
				</Sticky>
				{/* 房屋列表 */}
				<div className={styles.houseItems}>
					<InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.loadMoreRows} rowCount={count}>
						{({ onRowsRendered, registerChild }) =>
							<WindowScroller>
								{({ height, isScrolling, scrollTop }) =>
									<AutoSizer>
										{({ width }) =>
											<List
												onRowsRendered={onRowsRendered}
												ref={registerChild}
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
							</WindowScroller>}
					</InfiniteLoader>
				</div>
			</div>
		);
	}
}
