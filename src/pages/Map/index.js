import React from 'react';
// import axios from 'axios';
import { API } from '../../utils/api';
import { Link } from 'react-router-dom';
import NavHeader from '../../components/NavHeader';
import styles from './index.module.css';

import { Toast } from 'antd-mobile';

import { BASE_URL } from '../../utils/url';
import HouseItem from '../../components/HouseItem';

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
	state = {
		// 小区下的房源列表
		housesList: [],
		// 表示是否展示房源列表
		isShowList: false
	};
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
		this.map = map; // 在其他方法中通过 this 能获取到地图对象
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
					/* const res = await axios.get(`http://localhost:8080/area/map?id=${value}`);
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
                    }); */

					this.renderOverlays(value);
				}
			},
			label
		);
		map.addEventListener('movestart', () => {
			if (this.state.isShowList) {
				this.setState({
					isShowList: false
				});
			}
		});
	}
	// 渲染覆盖物入口
	async renderOverlays(id) {
		try {
			// 开启 loading
			Toast.loading('加载中...', 0, null, false);
			const res = await API.get(`/area/map?id=${id}`);
			// 关闭 loading
			Toast.hide();
			const data = res.data.body;
			// 调用 getTypeAndZoom 方法获取级别和类型
			const { nextZoom, type } = this.getTypeAndZoom();
			data.forEach(item => {
				// 创建覆盖物
				this.createOverlays(item, nextZoom, type);
			});
		} catch (e) {
			// 关闭 loading
			Toast.hide();
		}
	}
	createOverlays(data, zoom, type) {
		const { coord: { longitude, latitude }, label: areaName, count, value } = data;
		// 创建坐标对象
		const areaPoint = new BMap.Point(longitude, latitude);

		if (type === 'circle') {
			// 区或镇
			this.createCircle(areaPoint, areaName, count, value, zoom);
		} else {
			// 小区，小区就不需要再放大了
			this.createRect(areaPoint, areaName, count, value);
		}
	}
	// 创建区、镇覆盖物
	createCircle(point, name, count, id, zoom) {
		// 创建覆盖物
		const label = new BMap.Label('', {
			position: point,
			offset: new BMap.Size(-35, -35)
		});
		// 给 label 对象添加一个唯一标识
		label.id = id;
		// 设置房源覆盖物内容
		label.setContent(`
			<div class="${styles.bubble}">
				<p class="${styles.name}">${name}</p>
				<p>${count}套</p>
			</div>
		`);
		// 设置样式
		label.setStyle(labelStyle);
		label.addEventListener('click', () => {
			// 获取该区域下的房源数据
			this.renderOverlays(id);

			// 以当前点击的覆盖物为中心放大地图
			this.map.centerAndZoom(point, zoom);

			// 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
			setTimeout(() => {
				this.map.clearOverlays();
			});
		});
		// 添加覆盖物到地图中
		this.map.addOverlay(label);
	}
	createRect(point, name, count, id) {
		// 创建覆盖物
		const label = new BMap.Label('', {
			position: point,
			offset: new BMap.Size(-50, -28)
		});
		// 给 label 对象添加一个唯一标识
		label.id = id;
		// 设置房源覆盖物内容
		label.setContent(`
			<div class="${styles.rect}">
				<p class="${styles.housename}">${name}</p>
				<p class="${styles.housenum}">${count}套</p>
				<i class="${styles.arrow}"></i>
			</div>
		`);
		// 设置样式
		label.setStyle(labelStyle);
		label.addEventListener('click', e => {
			this.getHouseList(id);

			const target = e.changedTouches[0];
			this.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY);
		});
		// 添加覆盖物到地图中
		this.map.addOverlay(label);
	}
	// 获取小区房源数据
	async getHouseList(id) {
		try {
			// 开启 loading
			Toast.loading('加载中...', 0, null, false);
			const res = await API.get(`/houses?cityId=${id}`);
			// 关闭 loading
			Toast.hide();
			this.setState({
				housesList: res.data.body.list,
				// 展示房源列表
				isShowList: true
			});
		} catch (e) {
			// 关闭 loading
			Toast.hide();
		}
	}
	// 计算要绘制的覆盖物类型和下一个缩放级别
	// 区 => 11，范围：>= 10 < 12
	// 镇 => 13，范围：>= 12 < 14
	// 小区 => 15，范围：>= 14 < 16
	getTypeAndZoom() {
		// 调用地图的 getZoom() 方法，来获取当前缩放级别
		const zoom = this.map.getZoom();
		let nextZoom, type;
		if (zoom >= 10 && zoom < 12) {
			// 区
			nextZoom = 13;
			type = 'circle';
		} else if (zoom >= 12 && zoom < 14) {
			// 镇
			nextZoom = 15;
			type = 'circle';
		} else if (zoom >= 14 && zoom < 16) {
			// 小区
			type = 'rect';
		}
		return {
			nextZoom,
			type
		};
	}
	componentDidMount() {
		this.initMap();
	}
	/* renderHousesList() {
		return this.state.housesList.map(item =>
			<div className={styles.house} key={item.houseCode}>
				<div className={styles.imgWrap}>
					<img className={styles.img} src={BASE_URL + item.houseImg} alt="" />
				</div>
				<div className={styles.content}>
					<h3 className={styles.title}>
						{item.title}
					</h3>
					<div className={styles.desc}>
						{item.desc}
					</div>
					<div>
						{item.tags.map((tag, index) => {
							const tagClass = 'tag' + (index + 1);
							return (
								<span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
									{tag}
								</span>
							);
						})}
					</div>
					<div className={styles.price}>
						<span className={styles.priceNum}>{item.price}</span> 元/月
					</div>
				</div>
			</div>
		);
	} */
	renderHousesList() {
		return this.state.housesList.map(item =>
			<HouseItem
				key={item.houseCode}
				src={BASE_URL + item.houseImg}
				title={item.title}
				desc={item.desc}
				tags={item.tags}
				price={item.price}
			/>
		);
	}
	render() {
		return (
			<div className={styles.map}>
				<NavHeader>地图找房</NavHeader>
				{/* 地图容器元素 */}
				<div id="container" className={styles.container} />
				{/* 房源列表 */}
				{/* 添加 styles.show 展示房屋列表 */}
				<div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
					<div className={styles.titleWrap}>
						<h1 className={styles.listTitle}>房屋列表</h1>
						<Link className={styles.titleMore} to="/home/list">
							更多房源
						</Link>
					</div>

					<div className={styles.houseItems}>
						{/* 房屋结构 */}
						{this.renderHousesList()}
					</div>
				</div>
			</div>
		);
	}
}
