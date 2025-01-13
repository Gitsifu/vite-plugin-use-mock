import request from '@/utils/request';
import {nanoid} from 'nanoid';
import {parseTime} from '@/utils';
import qs from 'qs'

interface IData {
    pageNum?: number;
    pageSize?: number;

    [key: string]: any;
}

function apiRequest(url: string, method: string, data?: IData) {
    return request({
        url: url,
        method,
        data,
        baseURL: import.meta.env.VITE_APP_LOCAL_MOCK_BASE_API,
    });
}

// 辅助函数：检查是否为对象
function isObject(value: any): value is { [key: string]: any } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 封装 CRUD 操作

/**
 * 获取指定 resource 所有数据
 * @param resource
 * @param id
 * @param sort
 */
export function getLocalMockInfo(resource: string, id?: string | number | undefined | null, sort?: string) {
    // 如果id存在，则获取指定数据
    if (id) {
        return apiRequest(`${resource}/${id}`, 'get');
    } else {
        const params = sort ? {_sort: sort} : {};
        const queryString = qs.stringify(params, {addQueryPrefix: true});
        return apiRequest(`${resource}${queryString}`, 'get');
    }
}

/**
 * 获取分页列表
 * @param resource
 * @param data
 */
export async function getLocalMockPage(resource: string, data?: IData) {
    const params = {
        ...data,
        _page: data?.pageNum ?? 1,
        _per_page: data?.pageSize ?? 10,
        _sort: data?.sort ?? 'createTime',
    }
    delete params.pageNum
    delete params.pageSize
    const paramsString = qs.stringify(params, {allowDots: true})
    return await apiRequest(`${resource}?${paramsString}`, 'get').then(res => {
        return {
            rows: res.data,
            total: res.items
        }
    });
}

/**
 * 添加
 * @param resource
 * @param data
 */
export function addLocalMock(resource: string, data?: IData) {
    data = {
        ...data,
        id: nanoid(8),
        createTime: parseTime(new Date()),
        updateTime: parseTime(new Date()),
    }
    return apiRequest(resource, 'post', data);
}

/**
 * 修改
 * @param resource 资源名称
 * @param id 修改数据的 id 或者 对象
 * @param data 修改的数据
 */
export function updateLocalMockInfo(resource: string, id: { [key: string]: any } | string | number, data?: IData) {
    // 当前时间戳
    const currentTime = parseTime(new Date());

    // 检查 `id` 是否为对象
    if (isObject(id)) {
        return apiRequest(`${resource}`, 'put', {
            ...id,
            updateTime: currentTime, // 添加更新时间戳
        });
    } else {
        return apiRequest(`${resource}/${id}`, 'put', {
            ...data,
            updateTime: currentTime, // 添加更新时间戳
        });
    }

}

/**
 * 删除
 * @param resource
 * @param id
 */
export function deleteLocalMockInfo(resource: string, id: string | number) {
    return apiRequest(`${resource}/${id}`, 'delete');
}
