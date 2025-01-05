import {ref} from 'vue'
import {
    getLocalMockInfo,
    getLocalMockPage,
    addLocalMock,
    updateLocalMockInfo,
    deleteLocalMockInfo
} from '@/api_mock'

interface IData {
    pageNum?: number;
    pageSize?: number;
    [key: string]: any;
}

/**
 * mock信息
 * @param module 模块名称
 */
export default (module: string) => {

    const moduleName = ref(module)

    /**
     * 获取mock信息
     * @param resource
     * @param id
     * @param sort
     */
    const getMockInfo = (resource: string, id?: string | number | undefined | null, sort?: string) => {
        return getLocalMockInfo(`${moduleName.value}_${resource}`, id, sort)
    }

    /**
     * 获取mock分页信息
     * @param resource
     * @param data
     */
    const getMockPage = (resource: string, data?: IData) => {
        return getLocalMockPage(`${moduleName.value}_${resource}`, data)
    }

    /**
     * 添加mock信息
     * @param resource
     * @param data
     */
    const addMockInfo = (resource: string, data?: IData) => {
        return addLocalMock(`${moduleName.value}_${resource}`, data)
    }

    /**
     * 更新mock信息
     * @param resource
     * @param id
     * @param data
     */
    const updateMockInfo = (resource: string, id: { [key: string]: any } | string | number , data?: IData) => {
        return updateLocalMockInfo(`${moduleName.value}_${resource}`, id, data)
    }

    /**
     * 删除mock信息
     * @param resource
     * @param id
     */
    const deleteMockInfo = (resource: string, id: string | number) => {
        return deleteLocalMockInfo(`${moduleName.value}_${resource}`, id)
    }


    return {
        moduleName,
        getMockInfo,
        getMockPage,
        addMockInfo,
        updateMockInfo,
        deleteMockInfo
    }
}
