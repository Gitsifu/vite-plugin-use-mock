import path from 'path'
import fs from 'fs';
import { pathToFileURL } from 'url';
import JSON5 from 'json5';

interface Config {
    modulesDir: string,
    outputPath: string
}

interface ModuleExport {
    [key: string]: any;
}


const loadModules = async (modulesDir: string) => {
    // 声明一个对象用于存储导入的模块，并定义其类型
    const modules: Record<string, ModuleExport> = {};

    try {
        const files = fs.readdirSync(modulesDir);
        for (const file of files) {
            // 检查文件是否为 TypeScript 文件
            if (file.endsWith('.js')) {
                const moduleName = file.slice(0, -3); // 去掉文件扩展名
                const modulePath = path.join(modulesDir, file);

                try {
                    // 动态导入模块
                    const fileUrl = pathToFileURL(modulePath).href;
                    // 动态导入模块
                    modules[moduleName] = (await import(fileUrl)).default;
                } catch (importError) {
                    console.error(`加载模块 ${moduleName} 失败:`, importError);
                }
            }
        }
    } catch (readError) {
        console.error('读取模块目录时出错:', readError);
    }

    return modules;
}

/**
 * 将给定的数据对象转换为指定格式并写入文件
 * @param {Object} modulesData - 原始数据对象
 * @param {string} outputPath - 相对于当前脚本文件的输出路径
 */
const writeDataToFile = (modulesData: Record<string, ModuleExport>, outputPath: string) => {

    // 创建一个空对象用于存储转换后的结果
    const formattedData: Record<string, any> = {};

    // 检查特定模块名
    for (const moduleName in modulesData) {
        if (modulesData.hasOwnProperty(moduleName) && typeof modulesData[moduleName] === 'object') {
            const moduleData = modulesData[moduleName];
            Object.keys(moduleData).forEach((key) => {
                formattedData[`${moduleName}_${key}`] = moduleData[key];
            });
        }
    }

    // 确保目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // 确保没有尾随逗号
    const jsonString = JSON5.stringify(formattedData, null, 2)
        // .replace(/,\s*}/g, '}') // 去掉对象末尾的逗号
        // .replace(/,\s*]/g, ']'); // 去掉数组末尾的逗号
    // console.log(jsonString)
    // 将数据写入指定的文件
    fs.writeFile(outputPath, jsonString, (err) => {
        if (err) {
            console.error('写入文件失败:', err);
        } else {
            console.log(`数据成功写入 ${outputPath}`);
        }
    });
}

export default (config: Config) => {
    const {modulesDir, outputPath} = config;
    return {
        name: 'vite-plugin-use-mock',
        handleHotUpdate: async ({file}) => {
            // 规范化文件路径
            const normalizedFile = path.normalize(file);
            // 如果file是modulesDir下的js文件
            if(normalizedFile.endsWith('.js') && normalizedFile.startsWith(modulesDir + path.sep)){
                console.log('normalizedFile:', normalizedFile)
                // 读取 modulesDir 下的文件
                const modulesData = await loadModules(modulesDir);
                console.log('modulesData:', modulesData)
                writeDataToFile(modulesData, outputPath)
            }
        }
    }
}