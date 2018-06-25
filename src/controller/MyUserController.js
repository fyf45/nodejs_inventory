/**
 * Created by nick on 2018/6/20.
 */
'use strict';

import MyUserModel from "../models/MyUserModel";
import MyBaseController from "./base/MyBaseController";
import formidable from "formidable";
import crypto from "crypto";

function Md5(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
}

function encryption(password) {
    const newpassword = Md5(Md5(password).substr(2, 7) + Md5(password));
    return newpassword
}
class MyUserController extends MyBaseController {

    /**
     *
     *
     * 绑定需要调用this. 相关方法：
     eg: this.login = this.login.bind(this);
     */
    constructor() {
        super()
    }

    async login(req, res, next) {
        let req_url = MyConstantUtil.REQ_URL.REQ_URL___user__login;
        let msg = '';
        let code = '0';

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                code = CODE.code_40001.code;
                msg = MyConstantUtil.MSG.MSG___request_data_error;
                MyCommon.res_send_error(
                    code,
                    msg,
                    req_url,
                    res
                );
                return
            }
            const { user_name, password, } = fields;
            let b = MyVerifyUtil.verify_parameter([
                MyConstantUtil.PARAM.PARAM___user_name,
                MyConstantUtil.PARAM.PARAM___password,
            ], fields);
            if (!b.passed) {
                code = CODE.code_40001.code;
                msg = b.key_name + i18n.__('error');
                MyCommon.res_send_error(
                    code,
                    msg,
                    req_url,
                    res
                );
                return
            }
            const newpassword = encryption(password);
            try {
                const user = await MyUserModel.findOne({ user_name })
                if (!user) {
                    code = CODE.code_30001.code;
                    msg = MyConstantUtil.MSG.MSG___user_name_does_not_exist;
                    MyCommon.res_send_error(
                        code,
                        msg,
                        req_url,
                        res
                    );
                    return
                } else if (newpassword.toString() != user.password.toString()) {
                    console.log('登录密码错误');
                    code = CODE.code_30001.code;
                    msg = MyConstantUtil.MSG.MSG___password_error;
                    MyCommon.res_send_error(
                        code,
                        msg,
                        req_url,
                        res
                    );

                    return
                } else {
                    req.session.user_id = user._id;

                    let data = null;
                    data = {
                        'access_token' : 'access_token',
                        'user_id' : user._id,
                    };
                    MyCommon.res_send_success(
                        msg,
                        data,
                        req_url,
                        res
                    );

                    return
                }
            } catch (err) {
                console.log('登录失败', err);
                msg = MyConstantUtil.MSG.MSG___login_failure;
                MyLog.error(`
                
                err___
                ${req_url}__\n
                ${msg}__\n
                ${JSON.stringify(err)}__\n
                `);

                MyCommon.res_send_sys_error(
                    msg,
                    req_url,
                    res
                );

                return
            }
        })
    };

    async register(req, res, next) {
        let req_url = MyConstantUtil.REQ_URL.REQ_URL___user__register;
        let msg = '';
        let code = '0';

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                code = CODE.code_40001.code;
                msg = MyConstantUtil.MSG.MSG___request_data_error;

                MyCommon.res_send_error(
                    code,
                    msg,
                    req_url,
                    res
                );
                return
            }
            const { user_name, password, } = fields;
            let b = MyVerifyUtil.verify_parameter([
                MyConstantUtil.PARAM.PARAM___user_name,
                MyConstantUtil.PARAM.PARAM___password,
            ], fields);
            if (!b.passed) {
                code = CODE.code_40001.code;
                msg = b.key_name + i18n.__('error');
                MyCommon.res_send_error(
                    code,
                    msg,
                    req_url,
                    res
                );
                return
            }
            try {
                const user = await MyUserModel.findOne({ user_name })
                if (user) {
                    console.log('该用户已经存在');
                    code = CODE.code_30002.code;
                    msg = MyConstantUtil.MSG.MSG___this_user_name_had_exist;
                    MyCommon.res_send_error(
                        code,
                        msg,
                        req_url,
                        res
                    );
                    return
                } else {
                    const newpassword = encryption(password);
                    const newUser = {
                        user_name : user_name,
                        password : newpassword,
                    }
                    await MyUserModel.create(newUser);
                    // const user2 = await MyUserModel.findOne({ user_name });
                    // req.session.user_id = user2._id;
                    msg = MyConstantUtil.MSG.MSG___register_success;
                    MyCommon.res_send_success(
                        msg,
                        undefined,
                        req_url,
                        res
                    );

                    return
                }
            } catch (err) {
                console.log('注册失败', err);

                msg = MyConstantUtil.MSG.MSG___register_failure;
                MyLog.error(`
                
                err___
                ${req_url}__\n
                ${msg}__\n
                ${JSON.stringify(err)}__\n
                `);

                MyCommon.res_send_sys_error(
                    msg,
                    req_url,
                    res
                );

                return
            }
        })
    };
}

export default new MyUserController()