<template>
  <div>
    <el-button @click="handleAdd" :icon="Plus">新增</el-button>
    <el-button @click="getList" :icon="Refresh">刷新</el-button>
    <el-table :data="tableList" v-loading="tableLoading">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <el-dialog v-model="visible" :title="title">
      <el-form v-model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input type="number" v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { Plus, Refresh } from '@element-plus/icons-vue';
import {type ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref} from 'vue'
import useMock from "@/hooks/useMock";
import useDialog from "@/hooks/useDialog.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import pagination from "@/components/Pagination/index.vue";

const { getMockInfo, getMockPage, addMockInfo, updateMockInfo, deleteMockInfo } = useMock('demo');
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '-createTime'
});
const total = ref(0);
const tableLoading = ref(false);
const tableList = ref([]);
const initForm = {
  id: '',
  title: '',
  num: ''
};
const form = ref(initForm);
const { title, visible } = useDialog({ title: '编辑' });

const getList = async () => {
  tableLoading.value = true;
  const res = await getMockPage('posts', queryParams);
  tableList.value = res.rows;
  total.value = res.total;
  tableLoading.value = false;
};

// 点击新增
const handleAdd = async () => {
  form.value = { ...initForm };
  title.value = '新增';
  visible.value = true;
};

// 点击编辑
const handleEdit = async (row) => {
  form.value = await getMockInfo('posts', row.id);
  title.value = '编辑';
  visible.value = true;
};

// 点击保存
const handleSave = async () => {
  if (form.value.id) {
    await updateMockInfo('posts', form.value.id, form.value);
  } else {
    await addMockInfo('posts', form.value);
  }
  visible.value = false;
  await getList();
  ElMessage({
    message: '操作成功',
    type: 'success',
  })
};

const handleDelete = async (row) => {
  await ElMessageBox.confirm('是否确认删除该条数据？')
  await deleteMockInfo('posts', row.id);
  await getList();
  ElMessage({
    message: '操作成功',
    type: 'success',
  })
};

onMounted(() => {
  getList();
});
</script>
<style scoped>

</style>

