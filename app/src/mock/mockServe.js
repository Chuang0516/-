// 引入 mockjs 模块
import Mock from 'mockjs';

// 把 JSON 数据引入
import banners from './banners.json';
import floors from './floors.json';

// mock 数据
Mock.mock('/mock/banner', { code: 200, data: banners });
Mock.mock('/mock/floor', { code: 200, data: floors });
