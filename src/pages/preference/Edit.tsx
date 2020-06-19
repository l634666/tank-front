import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import {Button, Form, Input, InputNumber, Switch} from "antd";
import {SaveOutlined} from '@ant-design/icons';
import TankContentCard from "../widget/TankContentCard";
import Preference from "../../common/model/preference/Preference";
import FileUtil from "../../common/util/FileUtil";
import {FormInstance} from "antd/lib/form";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import Sun from "../../common/model/global/Sun";

interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Edit extends TankComponent<IProps, IState> {

  formRef = React.createRef<FormInstance>();

  user: User = Moon.getSingleton().user
  preference: Preference = Moon.getSingleton().preference

  constructor(props: IProps) {
    super(props);

    this.state = {};

    this.preference.detailLoading = true
  }

  componentDidMount() {

    let that = this

    that.refreshPreference()
  }

  refreshPreference() {

    let that = this

    that.preference.httpFetch(function () {
      that.preference.detailLoading = false
      that.updateUI()
    })
  }

  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let user = that.user

    that.preference.assign(values)

    that.preference.httpSave(function () {
      MessageBoxUtil.success("修改成功！")

      Sun.updateFrame()

      Sun.navigateTo("/preference/index")
    })

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    let preference = that.preference

    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };

    let initialValues: any = preference.getForm()

    return (
      <div className="page-preference-edit">

        <TankTitle name={'网站偏好编辑'}>
        </TankTitle>

        <TankContentCard loading={preference.detailLoading}>

          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            initialValues={initialValues}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
            onValuesChange={() => {
              that.updateUI()
            }}
          >

            <Form.Item
              label="网站名称"
              name="name"
              rules={[{required: true, message: '请输入网站名称!'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="logo"
              name="logoUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="favicon"
              name="faviconUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="版权信息"
              name="copyright"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="备案信息"
              name="record"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="office预览地址"
              name="officeUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="zip最大数量限制"
              name="downloadDirMaxNum"
              rules={[{required: true, message: 'zip最大数量限制必填!'}]}
            >
              <InputNumber min={-1} max={1000} className='w150'/>
            </Form.Item>

            <Form.Item label="zip大小限制(B)"
                       required={true}
            >
              <Form.Item
                name="downloadDirMaxSize"
                rules={[{required: true, message: 'zip大小限制必填!'}]}
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("downloadDirMaxSize"))
                  : FileUtil.humanFileSize(preference.defaultTotalSizeLimit)}
              </span>
            </Form.Item>

            <Form.Item label="默认用户空间大小(B)"
                       required={true}
            >
              <Form.Item
                name="defaultTotalSizeLimit"
                rules={[{required: true, message: '默认用户空间大小必填!'}]}
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("defaultTotalSizeLimit"))
                  : FileUtil.humanFileSize(preference.defaultTotalSizeLimit)}
              </span>
            </Form.Item>

            <Form.Item
              label="开放注册"
              name="allowRegister"
              required={true}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>

            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}>
                保存
              </Button>
            </div>

          </Form>
        </TankContentCard>

      </div>
    );
  }
}


