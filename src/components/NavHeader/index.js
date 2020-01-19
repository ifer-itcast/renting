import React from 'react';
import PropTypes from 'prop-types';
import { NavBar } from 'antd-mobile';

import { withRouter } from 'react-router-dom';

// 导入样式
import './index.scss';

function NavHeader({ children, history, onLeftClick }) {
    const defaultHandler = () => history.go(-1);

	return (
		<NavBar
			className="navbar"
			mode="light"
			icon={<i className="iconfont icon-back" />}
			onLeftClick={onLeftClick || defaultHandler}
		>
			{children}
		</NavBar>
	);
}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
};

export default withRouter(NavHeader);