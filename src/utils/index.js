import axios from 'axios';

export const getCurrentCity = () => {
    // 判断 localStorage 中是否有
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'));
    if (!localCity) {
        return new Promise((resolve, reject) => {
            // 如果没有，使用首页中获取定位城市的代码来获取，并且存储到本地，然后返回该城市数据
            const curCity = new window.BMap.LocalCity();
            curCity.get(async res => {
                try {
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`);
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body));
                    resolve(result.data.body);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    // 为了返回值的统一，此处也使用 Promise
    return Promise.resolve(localCity);
};

export { API } from './api';
export { BASE_URL } from './url';