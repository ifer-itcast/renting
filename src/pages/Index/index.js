import React from 'react';
import { Carousel } from 'antd-mobile';
import axios from 'axios';

export default class Index extends React.Component {
	state = {
		swipers: [],
		data: ['1', '2', '3']
	};
	async getSwipers() {
		// 请求数据
        let { data: res } = await axios.get('http://localhost:8080/home/swiper');
		// 把获取到的值设置给state
		this.setState({
			swipers: res.body
		});
	}
	componentDidMount() {
		this.getSwipers();
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
	render() {
		return (
			<div className="index">
				<Carousel autoplay infinite autoplayInterval="2000">
					{/* 调用渲染轮播图的方法 */}
					{this.renderSwipers()}
				</Carousel>
			</div>
		);
	}
}
