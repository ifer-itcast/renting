import React from 'react';
import ReactDOM from 'react-dom';

// antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css';
// react-virtualized 的样式
import 'react-virtualized/styles.css';
// 字体图标的样式
import './assets/fonts/iconfont.css';
// 自定义的全局样式
import './index.css';

// 应该将组件的导入放在样式导入后面，让组件中自定义样式覆盖默认的
import App from './App';

// import './utils/url';

ReactDOM.render(<App />, document.getElementById('root'));