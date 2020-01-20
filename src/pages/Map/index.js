import React from 'react';
import axios from 'axios';
import NavHeader from '../../components/NavHeader';
import styles from './index.module.css';

const BMap = window.BMap;

// 覆盖物样式
const labelStyle = {
	cursor: 'pointer',
	border: '0px solid rgb(255, 0, 0)',
	padding: '0px',
	whiteSpace: 'nowrap',
	fontSize: '12px',
	color: 'rgb(255, 255, 255)',
	textAlign: 'center'
};

export default class Map extends React.Component {
	initMap() {
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
			async point => {
				if (point) {
					map.centerAndZoom(point, 11);
					// map.addOverlay(new BMap.Marker(point));
					// 平移缩放控件
					map.addControl(new BMap.NavigationControl());
					// 比例尺
					map.addControl(new BMap.ScaleControl());

					// 获取房源数据
					const res = await axios.get(`http://localhost:8080/area/map?id=${value}`);
					res.data.body.forEach(item => {
						// 为每一条数据创建覆盖物
                        const { coord: {longitude, latitude}, label: areaName, count, value } = item;
						// 1. 创建 Label 实例对象
                        // 设置 setContent 后，第一个参数中设置的文本内容就失效了
                        const areaPoint = new BMap.Point(longitude, latitude);
						const label = new BMap.Label('', {
                            // position: point,
                            position: areaPoint,
							offset: new BMap.Size(-35, -35)
                        });
                        
                        label.id = value;

						// 设置房源覆盖物内容
						label.setContent(`
                            <div class="${styles.bubble}">
                                <p class="${styles.name}">${areaName}</p>
                                <p>${count}套</p>
                            </div>
                        `);

						// 2. 调用 setStyle() 方法设置样式
						label.setStyle(labelStyle);

						// 添加单机事件
						label.addEventListener('click', () => {
                            // console.log('hello', label.id);
                            // 以当前点击的覆盖物为中心放大地图
                            // 第一个参数：坐标对象，第二个参数：放大级别
                            map.centerAndZoom(areaPoint, 13);
                            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                            setTimeout(() => {
                                // 清除当前覆盖物信息
                                map.clearOverlays();
                            });
						});
						// 3. 在 map 对象上调用 addOverlay() 方法，将文本覆盖物添加到地图中
						map.addOverlay(label);
					});
				}
			},
			label
		);
	}
	componentDidMount() {
		this.initMap();
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
