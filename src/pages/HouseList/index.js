import React from 'react';
import { Flex } from 'antd-mobile';
import SearchHeader from '../../components/SearchHeader';

import styles from './index.module.css';

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
	render() {
		return (
			<div>
				<Flex className={styles.header}>
					<i className="iconfont icon-back" />
					<SearchHeader cityName={label} className={styles.searchHeader} />
				</Flex>
			</div>
		);
	}
}
