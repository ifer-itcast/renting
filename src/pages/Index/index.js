import React from 'react';
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import axios from 'axios';
import './index.scss';

import { getCurrentCity } from '../../utils';

import { BASE_URL } from '../../utils/url';

import nav1 from '../../assets/images/nav-1.png';
import nav2 from '../../assets/images/nav-2.png';
import nav3 from '../../assets/images/nav-3.png';
import nav4 from '../../assets/images/nav-4.png';

// 导航菜单的数据
const navs = [
	{
		id: 0,
		img: nav1,
		title: '整租',
		path: '/home/list'
	},
	{
		id: 1,
		img: nav2,
		title: '合租',
		path: '/home/list'
	},
	{
		id: 2,
		img: nav3,
		title: '地图找房',
		path: '/home/map'
	},
	{
		id: 3,
		img: nav4,
		title: '去出租',
		path: '/home/list'
	}
];

navigator.geolocation.getCurrentPosition(position => {
	console.log(position);
    // position 对象表示当前位置信息
    // 纬度 => latitude
    // 经度 => longitude
    // 经纬度精度 => accuracy
    // 海拔高度 => altitude
    // 海拔高度精度 => altitudeAccuracy
    // 设备行进方向 => heading
    // 速度 => speed
});

export default class Index extends React.Component {
	state = {
		swipers: [],
		isSwiperLoaded: false,
		groups: [],
		news: [],
		curCityName: '上海'
	};
	async getSwipers() {
		// 请求数据
		let { data: res } = await axios.get('http://localhost:8080/home/swiper');
		// 把获取到的值设置给state
		this.setState({
			swipers: res.body,
			isSwiperLoaded: true
		});
	}
	// 获取租房小组数据
	async getGroups() {
		const res = await axios.get('http://localhost:8080/home/groups', {
			params: {
				area: 'AREA%7C88cff55c-aaa4-e2e0'
			}
		});

		this.setState({
			groups: res.data.body
		});
	}
	// 获取最新资讯数据
	async getNews() {
		const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0');
		this.setState({
			news: res.data.body
		});
	}
	async componentDidMount () {
		this.getSwipers();
		this.getGroups();
		this.getNews();

		// 根据 IP 定位获取当前城市名称/信息
		/* const curCity = new window.BMap.LocalCity();
		curCity.get(async res => {
			const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`);
			this.setState({
				curCityName: result.data.body.label
			});
		}); */

		const curCity = await getCurrentCity();
		this.setState({
			curCityName: curCity.label
		});
	}
	// 渲染轮播图的逻辑代码
	renderSwipers() {
		return this.state.swipers.map(item =>
			<a
				key={item.id}
				href="http://www.itcast.cn"
				style={{ display: 'inline-block', width: '100%', height: 212 }}
			>
				<img
					src={BASE_URL + item.imgSrc}
					alt=""
					style={{ width: '100%', verticalAlign: 'top' }}
				/>
			</a>
		);
	}
	// 渲染导航菜单的逻辑代码
	renderNavs() {
		return navs.map(item => {
			return (
				<Flex.Item
					key={item.id}
					onClick={() => {
						this.props.history.push(item.path);
					}}
				>
					<img src={item.img} alt="" />
					<h2>
						{item.title}
					</h2>
				</Flex.Item>
			);
		});
	}
	// 渲染最新资讯
	renderNews() {
		return this.state.news.map(item =>
			<div className="news-item" key={item.id}>
				<div className="imgwrap">
					<img className="img" src={`http://localhost:8080${item.imgSrc}`} alt="" />
				</div>
				<Flex className="content" direction="column" justify="between">
					<h3 className="title">
						{item.title}
					</h3>
					<Flex className="info" justify="between">
						<span>
							{item.from}
						</span>
						<span>
							{item.date}
						</span>
					</Flex>
				</Flex>
			</div>
		);
	}
	render() {
		return (
			<div className="index">
				<div className="swiper">
					{this.state.isSwiperLoaded
						? <Carousel autoplay infinite autoplayInterval="2000">
								{/* 调用渲染轮播图的方法 */}
								{this.renderSwipers()}
							</Carousel>
						: null}
					{/* 搜索框 */}
					<Flex className="search-box">
						{/* 左侧白色区域 */}
						<Flex className="search">
							{/* 位置 */}
							<div className="location" onClick={() => this.props.history.push('/citylist')}>
								<span className="name">{this.state.curCityName}</span>
								<i className="iconfont icon-arrow" />
							</div>
							{/* 搜索表单 */}
							<div className="form" onClick={() => this.props.history.push('/search')}>
								<i className="iconfont icon-seach" />
								<span className="text">请输入小区或地址</span>
							</div>
						</Flex>
						{/* 右侧地图图标 */}
						<i className="iconfont icon-map" onClick={() => this.props.history.push('/map')} />
					</Flex>
				</div>

				{/* 导航菜单 */}
				<Flex className="nav">
					{this.renderNavs()}
				</Flex>

				{/* 租房小组 */}
				<div className="group">
					<h3 className="group-title">
						租房小组<span className="more">更多</span>
					</h3>
					<Grid
						data={this.state.groups}
						columnNum={2}
						square={false}
						hasLine={false}
						renderItem={item =>
							<Flex className="group-item" justify="around" key={item.id}>
								<div className="desc">
									<p className="title">
										{item.title}
									</p>
									<span className="info">
										{item.desc}
									</span>
								</div>
								<img src={`http://localhost:8080${item.imgSrc}`} alt="" />
							</Flex>}
					/>
				</div>
				{/* 最新资讯 */}
				<div className="news">
					<h3 className="group-title">最新资讯</h3>
					<WingBlank size="md">
						{this.renderNews()}
					</WingBlank>
				</div>
			</div>
		);
	}
}
