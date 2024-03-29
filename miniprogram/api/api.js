// 封装api
import {post, get, file} from '../utils/request';

const baseURL = 'http://localhost:3000/'

// 登录注册页
const userLoginApi = {
    // 登录接口
    login: parmas => post(baseURL + 'ManagerCount/api/smallProgramCheckLogin', parmas),
    // 注册接口pl
    register: parmas => post(baseURL + 'ManagerCount/api/regNewUser', parmas)
}
// 文件上传
const fileUploadApi = {
    // 图片上传
    imgUpload: parmas => file(baseURL + 'fileUpload/api/upload', parmas)
}
// 用户信息相关的接口
const userMessageApi = {
    // 查询
    findData: parmas => post(baseURL + 'ManagerCount/api/getUserDataByDiscount', parmas)
}
// 题数据相关
const questionApi = {
    // 主观题上传
    subUpload: parmas => post(baseURL + 'addQuestion/api/addSubjectiveData', parmas),
    // 用户主观题查询
    subGetData: parmas => post(baseURL + 'getQuestion/api/miniGetSubjectiveList', parmas),
}

export {
    userLoginApi,
    fileUploadApi,
    userMessageApi,
    questionApi
}
