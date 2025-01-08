# vite-plugin-use-mock

这是基于 `json-server` 的 `vite` 模拟接口数据插件使用示例。

## 开始
```shell
npm i

npm run start
```

访问: http://localhost:8080

## 使用

在 `src/mock/modules/` 文件夹下创建文件，如： `modulesName.js`

```javascript
export default {
  data: [
    {
      id: '1',
      name: '测试数据'
    },
    {
      id: '2',
      name: '测试数据2'
    }
  ],
  // ...
}
```

使用：

```javascript
import useMock from '@/hooks/useMock'

const {
  getMockInfo,
  getMockPage,
  addMockInfo,
  updateMockInfo,
  deleteMockInfo
} = useMock('modulesName')

getMockInfo('data').then(res=>{
    console.log(res)
})
```
