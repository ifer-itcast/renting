import React from 'react';
import NavHeader from '../../components/NavHeader';
import styles from './index.module.css';

const BMap = window.BMap;

export default class Map extends React.Component {
	componentDidMount() {
		// // 全局对象需要作为 window 的属性访问
		// // 否则通不过 ESLint
		// const map = new window.BMap.Map('container');
		// // 设置中心点坐标
		// const point = new window.BMap.Point('114.40710586445101','30.70768223644838');
		// // 初始化地图，并设置展示级别
		// map.centerAndZoom(point, 15);

		// 获取当前定位城市
		const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));
		const map = new BMap.Map('container');
		const myGeo = new BMap.Geocoder();
		myGeo.getPoint(
			label,
			point => {
				if (point) {
					map.centerAndZoom(point, 11);
                    // map.addOverlay(new BMap.Marker(point));
                    map.addControl(new BMap.NavigationControl());
                    map.addControl(new BMap.ScaleControl());
				}
			},
			label
		);
	}
	render() {
		return (
			<div className={styles.map}>
				<NavHeader>地图找房</NavHeader>
				<div id="container" className={styles.container}>
					地图
				</div>
			</div>
		);
	}
}
