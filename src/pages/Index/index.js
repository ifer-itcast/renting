import React from 'react';
import { Carousel, Flex, Grid } from 'antd-mobile';
import axios from 'axios';
import './index.scss';

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

const data = Array.from(new Array(4)).map((_val, i) => ({
	icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
	text: `name${i}`
}));

export default class Index extends React.Component {
	state = {
		swipers: [],
		isSwiperLoaded: false,
		groups: []
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
	componentDidMount() {
		this.getSwipers();
		this.getGroups();
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
					src={`http://localhost:8080${item.imgSrc}`}
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
						data={data}
						columnNum={2}
						square={false}
						hasLine={false}
						renderItem={() =>
							<Flex className="group-item" justify="around">
								<div className="desc">
									<p className="title">家住回龙观</p>
									<span className="info">归属的感觉</span>
								</div>
								<img src="" alt="" />
							</Flex>}
					/>
				</div>
			</div>
		);
	}
}
