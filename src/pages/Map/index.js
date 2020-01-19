import React from 'react';
import NavHeader from '../../components/NavHeader';
import './index.scss';

export default class Map extends React.Component {
    componentDidMount () {
        // 全局对象需要作为 window 的属性访问
        // 否则通不过 ESLint
        const map = new window.BMap.Map('container');
        // 设置中心点坐标
        const point = new window.BMap.Point('114.40710586445101','30.70768223644838');
        // 初始化地图，并设置展示级别
        map.centerAndZoom(point, 15);
    }
    render () {
        return <div className="map">
            <NavHeader>地图找房</NavHeader>
            <div id="container">
                地图
            </div>
        </div>
    }
}
